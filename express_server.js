// Creating web server with express
const express = require("express");
// Replacing the cookie-parser express middleware with the cookie-session middleware
const cookieSession = require("cookie-session");
//bcryptjs package to convert(hashing) the passwords provided by users before we store them on our server
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;  // default port 8080

// telling the Express app to use EJS as its templating engine
app.set("view engine", "ejs");
app.use(cookieSession({
  name: "session",
  keys: ["key1"]
}));
// The body-parser library will convert the request body from a Buffer into string that we can read.
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  lueomu: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "r03s4t"
  }
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user1@example.com",
    password: "$2a$10$fQBExdS/g/qGxu9a50uipeETLC3ymQ0CWal4r/2EXsHL0G6DXRDRm"  // user1
  },
  r03s4t: {
    id: "r03s4t",
    email: "user2@example.com",
    password: "$2a$10$l8pWSkjSWKyZPaJ8HvZBPuCsgUM/EZsUPVppofqq38ZUTcyF9RIha"  // user2
  }
};

// generate a random short URL ID (random string)
function generateRandomString() {
  const randomStr = Math.random().toString(32).substring(2, 8);
  return randomStr;
};

function getUserByEmail(email) {
  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return null;
};

// function returns the URLs where the userID is equal to the id of the currently logged-in user
function urlsForUser(id) {
  let result = {};
  for (const key in urlDatabase) {
    if(urlDatabase[key].userID === id) {
      result[key] = urlDatabase[key];
    }
  }
  return result;
};

// add a route for "/urls" and pass URL data to template using res.render()
// display the logged in user email in the header using cookie parser
// extract the cookie value & look up user object in users objects using userid cookie value and send it to header
app.get("/urls", (req, res) => {
  if(!req.session.user_id) {
    return res.status(403).send('Login or register first to see URLs');
  }
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id)
  };
  res.render("urls_index", templateVars);
});

// GET route to render the urls_new.ejs template in the browser, to present the form to the user
// extract the cookie value & look up user object in users objects using userid cookie value and send it to header
app.get("/urls/new", (req, res) => {
  // redirects to /login if the user is not logged in
  if(!req.session.user_id) {
    return res.redirect("/login");
  }
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_new", templateVars);
});

// add a POST route to receive the form submission of new URL (receive the input value to the server)
app.post("/urls", (req, res) => {
  // If the user is not logged in, POST /urls responds with an HTML message
  if(!req.session.user_id) {
    return res.send('Only logged in users can shorten URL');
  }
  const shortURLid = generateRandomString();
  const reqLongURL = req.body.longURL;
  // save new short URL id and long URL to database(object) 
  urlDatabase[shortURLid] = {
    longURL: reqLongURL,
    userID: req.session.user_id
  }
  // redirect to '/urls/:id'
  res.redirect(`/urls/${shortURLid}`);
});

// redirect short URLs to the appropriate longURL
app.get("/u/:id", (req, res) => {
  // if the :id is not exists in the urlDatabase responds with error message
  if(!urlDatabase[req.params.id]) {
    return res.status(403).send('403: id does not exists');
  }
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

// POST route removes the URL using Javascript's delete operator
app.post("/urls/:id/delete", (req, res) => {
  // only the owner of the URL can delete the link.
  if(!urlDatabase[req.params.id]) {
    return res.status(403).send('403: id does not exists');
  }
  if(!req.session.user_id) {
    return res.status(403).send('Login first to delete URL');
  }
  if(urlDatabase[req.params.id].userID !== req.session.user_id) {
    return res.status(403).send('URL does not own by this user');
  }
  const URLid = req.params.id;
  delete urlDatabase[URLid];
  res.redirect("/urls");
});

// POST route updates the value of the stored long URL based on the new value
app.post("/urls/:id", (req, res) => {
  // only the owner of the URL can edit the link.
  if(!urlDatabase[req.params.id]) {
    return res.status(403).send('403: id does not exists');
  }
  if(!req.session.user_id) {
    return res.status(403).send('Login first to edit URL');
  }
  if(urlDatabase[req.params.id].userID !== req.session.user_id) {
    return res.status(403).send('URL does not own by this user');
  }
  const URLid = req.params.id;
  const reqNewURL = req.body.newURL;
  // edit long URL of that short URL id to the database(object) 
  urlDatabase[URLid].longURL = reqNewURL;
  res.redirect("/urls");
});

// render information about a single URL
// use the 'id' from the route parameter to lookup it's associated longURL from the urlDatabase
// extract the cookie value & look up user object in users objects using userid cookie value and send it to header
app.get("/urls/:id", (req, res) => {
  if(!req.session.user_id) {
    return res.status(403).send('Login first to see URLs');
  }
  // returns a error message to the user if they do not own the URL.
  if(urlDatabase[req.params.id].userID !== req.session.user_id) {
    return res.status(403).send('URL does not belongs to this user');
  }
  const templateVars = {
    user: users[req.session.user_id],
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL
  };
  res.render("urls_show", templateVars);
});

// POST route set a cookie named 'user_id' to the logged in user's id
app.post("/login", (req, res) => {
  if (!req.body.email) {
    return res.status(400).send('400: Empty email field');
  } else if (!req.body.password) {
    return res.status(400).send('400: Empty password field');
  }
  // look up email & password (submitted via form) in users obj
  const userExists = getUserByEmail(req.body.email);
  if(!userExists) {
    return res.status(403).send('403: Incorrect email');
  } else {
    // use bcrypt when comparing passwords
    const comparePassword = bcrypt.compareSync(req.body.password, userExists.password);
    if(!comparePassword) {
      return res.status(403).send('403: Incorrect password');
    } 
  }
  // set the user_id on session
  req.session.user_id = userExists.id;
  res.redirect("/urls");
});

// clears the user_id cookie and redirects the user back to the /login page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// GET route for /register which renders the urls_register template
app.get("/register", (req, res) => {
  // redirects to /urls if the user is logged in
  if(req.session.user_id) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_register", templateVars);
});

// POST route for /register: adds new user obj to global users obj, set user_id cookie and redirect users to /urls page
app.post("/register", (req, res) => {
  if (!req.body.email) {
    return res.status(400).send('400: Empty email field');
  } else if (!req.body.password) {
    return res.status(400).send('400: Empty password field');
  }
  // check if user already exists or not 
  const userExists = getUserByEmail(req.body.email);
  if (userExists) {
    return res.status(400).send('400: User already exists');
  }
  // if email & password fields are not empty & user already not exists then register user & set cookie 
  const userID = generateRandomString();
  // use bcrypt to hash and save password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: hashedPassword
  };
  // set the user_id on session
  req.session.user_id = userID;
  return res.redirect("/urls");
});

// GET /login route that responds with login form template
app.get("/login", (req, res) => {
  // redirects to /urls if the user is logged in
  if(req.session.user_id) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


