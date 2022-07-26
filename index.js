const express = require("express");
const cors = require("cors");
const App = express();

App.use(cors());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-1-17T17:30:31.098Z",
    important: false,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    date: "2022-1-17T18:39:34.091Z",
    important: true,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-1-17T19:20:14.298Z",
    important: false,
  },
];

App.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
App.get("/notes", (request, response) => {
  response.json(notes);
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

App.delete("/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

App.listen("3001", () => {
  console.log("Server running on port 3001");
});
