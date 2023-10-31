const session = require('express-session');

const sessionMiddleware = session({
  secret: 'meupaupenispicapiroca',
  resave: false,
  saveUninitialized: false,
});

module.exports = sessionMiddleware;