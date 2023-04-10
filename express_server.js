// Creating web server with express
const express = require("express");
// 'cookie-parser' helps to read the 'values' from the cookie
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;  // default port 8080

// telling the Express app to use EJS as its templating engine
app.set("view engine", "ejs");
app.use(cookieParser());
// The body-parser library will convert the request body from a Buffer into string that we can read.
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// generate a random short URL ID (random string)
function generateRandomString() {
  const randomStr = Math.random().toString(32).substring(2, 8);
  return randomStr;
};


// add a route for "/urls" and pass URL data to template using res.render()
// display the logged in username in the header using cookie parser
// extract the cookie value & set it to 'username' and send it to header
app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],   
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});

// GET route to render the urls_new.ejs template in the browser, to present the form to the user
// extract the cookie value & set it to 'username' and send it to header
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

// add a POST route to receive the form submission of new URL (receive the input value to the server)
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

// POST route removes the URL using Javascript's delete operator
app.post("/urls/:id/delete", (req, res) => {
  const URLid = req.params.id;
  delete urlDatabase[URLid];
  res.redirect("/urls");
});

// POST route updates the value of the stored long URL based on the new value
app.post("/urls/:id", (req, res) => {
  const URLid = req.params.id;
  const reqNewURL = req.body.newURL;
  // edit long URL of that short URL id to the database(object) 
  urlDatabase[URLid] = reqNewURL;
  res.redirect("/urls");
});

// render information about a single URL
// use the 'id' from the route parameter to lookup it's associated longURL from the urlDatabase
// extract the cookie value & set it to 'username' and send it to header
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    id: req.params.id, 
    longURL: urlDatabase[req.params.id] 
  };
  res.render("urls_show", templateVars);
});

// POST route set a cookie named 'username' to the value submitted in the request body via the login form
app.post("/login", (req, res) => {
  const value = req.body.username;
  res.cookie('username', value);
  res.redirect("/urls");
});

// clears the username cookie and redirects the user back to the /urls page
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


