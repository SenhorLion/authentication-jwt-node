const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const cors = require('cors');

const PORT = process.env.PORT || 8888;
const TOKEN_SECRET = 'secret_token_key'; //just for PoC, otherwise must be in .env or private variable!

const jwtCheck = expressjwt({
  secret: TOKEN_SECRET,
});

const users = [
  { id: 1, username: 'admin', password: 'admin' },
  { id: 2, username: 'guest', password: 'guest' },
];

const app = express();

app.use(bodyParser.json());
app.use(cors());

/** ROUTING */
// get: status
app.get('/status', (req, res) => {
  const localTime = new Date().toLocaleTimeString();

  res.status(200).send(`Server time : ${localTime}`);
});

app.get('/secure', jwtCheck, (req, res) => {
  res.status(200).send('Secure resource, you should be logged in to see this');
});

// post: login
app.post('/login', (req, res) => {
  // we need a username and password to login
  if (!req.body.username || !req.body.password) {
    res.status(400).send('You must supply a username and password to login');
    return;
  }

  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    res.status(400).send('User not found');
    return;
  }
  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username,
    },
    TOKEN_SECRET,
    {
      expiresIn: '3 hours',
    }
  );
  res.status(200).send({ access_token: token });
});

// unhandled routes: send 404
app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
