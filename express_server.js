// Creating web server with express
const express = require("express");
const app = express();
const PORT = 8080;  // default port 8080

// telling the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// add a route for "/urls" and pass URL data to template using res.render()
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

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
 
 // can't access the 'a' variable which defined in other method 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});