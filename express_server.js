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

// The body-parser library will convert the request body from a Buffer into string that we can read.
app.use(express.urlencoded({ extended: true }));

// generate a random short URL ID (random string)
function generateRandomString() {
  const randomStr = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
  return randomStr;
};

// add a route for "/urls" and pass URL data to template using res.render()
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET route to render the urls_new.ejs template in the browser, to present the form to the user
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// add a POST route to receive the form submission (receive the input value to the server)
app.post("/urls", (req, res) => {
  const shortURLid = generateRandomString();
  const reqLongURL = req.body.longURL;
  // save new short URL id and long URL to database(object) 
  urlDatabase[shortURLid] = reqLongURL;
  // redirect to '/urls/:id'
  res.redirect(`/urls/${shortURLid}`);
});

// redirect short URLs to the appropriate longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// render information about a single URL
// use the 'id' from the route parameter to lookup it's associated longURL from the urlDatabase
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




/*
// registers a handler on the root path, "/"
app.get("/", (req, res) => {
  res.send("Hello!");
});

// adding routes
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
*/


