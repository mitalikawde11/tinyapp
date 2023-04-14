// return the user by looking up email address in database
function getUserByEmail(email, usersDB) {
  for (const key in usersDB) {
    if (usersDB[key].email === email) {
      return usersDB[key];
    }
  }
  return;
};


module.exports = { getUserByEmail };