// generate a random short URL ID (random string)
function generateRandomString() {
  const randomStr = Math.random().toString(32).substring(2, 8);
  return randomStr;
};

// return the user by looking up email address in database
function getUserByEmail(email, usersDB) {
  for (const key in usersDB) {
    if (usersDB[key].email === email) {
      return usersDB[key];
    }
  }
  return;
};

// function returns the URLs where the userID is equal to the id of the currently logged-in user
function urlsForUser(id, urlDB) {
  let result = {};
  for (const key in urlDB) {
    if (urlDB[key].userID === id) {
      result[key] = urlDB[key];
    }
  }
  return result;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser };