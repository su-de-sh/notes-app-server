const express = require("express");
const cors = require("cors");
const { response } = require("express");
const App = express();
require("dotenv").config();
const Note = require("./models/note");

App.use(express.static("build"));
App.use(cors());
App.use(express.json());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

App.use(requestLogger);

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2022-1-17T17:30:31.098Z",
//     important: false,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     date: "2022-1-17T18:39:34.091Z",
//     important: true,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2022-1-17T19:20:14.298Z",
//     important: false,
//   },
// ];

App.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
App.get("/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

App.get("/notes/:id", (request, response, next) => {
  // const id = Number(request.params.id);

  // const note = notes.find((note) => note.id === id);
  // if (note) response.json(note);
  // else
  //   response
  //     .status(404)
  //     .json({ error: "404", message: `Notes with id:${id} not found` });
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

App.post("/notes", (request, response, next) => {
  let data = request.body;
  const note = new Note({
    content: data.content,
    important: data.important,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

App.put("/notes/:id", (request, response, next) => {
  const body = request.body;
  console.log("here");
  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

App.delete("/notes/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  // notes = notes.filter((note) => note.id !== id);

  // response.status(204).send(`Note with id ${id} deleted!!`);

  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

App.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware.
App.use(errorHandler);

const PORT = process.env.PORT || "3001";

App.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}/`);
});
