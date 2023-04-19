// users database constants
const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user1@example.com",
    password: "$2a$10$m30yz61ic8ngJ6fhC2fBfuaHbWTaU0jyKz506vx2AR2Rc1nY7FXVS"  // purpleMonkey
  },
  r03s4t: {
    id: "r03s4t",
    email: "user2@example.com",
    password: "$2a$10$6fZAmt/391lL4vDk/LEbY.Oyr7ADCPx97SMBSuFA02VMjN6jHG8Eq"  // pink_moon
  }
};

// URLs database constants
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

module.exports = { users, urlDatabase };