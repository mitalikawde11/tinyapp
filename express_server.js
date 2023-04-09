// Creating web server with express

const express = require("express");
const app = express();
const PORT = 8080;  // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// registers a handler on the root path, "/"
app.get("/", (req, res) => {
  res.send("Hello!");
});

// adding routes
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// sending HTML
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});