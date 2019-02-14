const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const cors = require('cors');

const { TOKEN_SECRET } = require('./config');

const PORT = process.env.PORT || 3000;

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
