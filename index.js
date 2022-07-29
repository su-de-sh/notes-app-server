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

App.get("/notes/:id", (request, response) => {
  const id = Number(request.params.id);

  const note = notes.find((note) => note.id === id);
  if (note) response.json(note);
  else
    response
      .status(404)
      .json({ error: "404", message: `Notes with id:${id} not found` });
});

App.post("/notes/", (request, response) => {
  let data = request.body;
  data = { ...data, id: notes.length + 1, date: new Date().toISOString() };
  notes.push(data);
  response.status(201).json(data);
});

App.delete("/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).send(`Note with id ${id} deleted!!`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

App.use(unknownEndpoint);

const PORT = process.env.PORT || "3001";

App.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}/`);
});
