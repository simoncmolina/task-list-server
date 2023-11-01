const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const app = express();

const secret = process.env.SECRET_KEY
const users = [
  { id: 1, username: 'Pedro', password: '12345' },
  { id: 2, username: 'Juan', password: '1234567' },
  { id: 3, username: 'Ana', password: '04568' },
];

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Bienvenido a la api de ADA Cars");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if(!user || user.password !== password) {
    return res.status(401).json({
      error: 'Invalid autentication'
    });
  }
  const token = jwt.sign({ id: user.id, username: user.username}, process.env.SECRET_KEY, {expiresIn: '1h'});
  res.json({ token });
});
function authentication(req, res, next) {
    const token = req.header('Authorization');

    if(!token) {
      return res.status(401).json({ 
        error: 'There isnt token'
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: 'Invalid token'
        });
      }
      req.user = user;
      next();
    })
  }



app.get('/protected', authentication, (req, res) => {
  res.json({
    message: 'Accesible'
  });

function authentication(req, res, next) {
    const token = req.header('Authorization');

    if(!token) {
      return res.status(401).json({ 
        error: 'There isnt token'
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: 'Invalid token'
        });
      }
      req.user = user;
      next();
    })
  }

})
app.listen(3000, () => {
  console.log('Server running');
});
