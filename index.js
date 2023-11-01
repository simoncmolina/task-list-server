const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

const secret = process.env.SECRET_KEY
const users = [
  { id: 1, username: 'Pedro', password: '12345' },
  { id: 2, username: 'Juan', password: '1234567' },
  { id: 3, username: 'Ana', password: '04568' },
];

app.use(express.json());
app.use(bodyParser.json());

const tasks = [];

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

app.post('/taskslist', (req, res) => {
    const { description } = req.body;
    if(!description) {
        return res.status(400).json({
            error:'Description is mandatory'
        });
    }

    const newTask = {
        id: tasks.length + 1,
        description,
        completed: false,
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});
app.get('/taskslist', (req, res) => {
    res.status(200).json(tasks);
});

app.get('/taskslist/completed', (req, res) => {
    const completedTasks = tasks.filter(task => task.completed);
    res.status(200).json(completedTasks);
});

app.get('/taskslist/incomplete', (req, res) => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    res.status(200).json(incompleteTasks);
});

app.get('/taskslist/:tId', (req, res) => {
    const tId = parseInt(req.params.tId);
    const task = tasks.find(task => task.id === tId);

    if(!task) {
        return res.status(404).json({
            error:'Task not found'
        });
    }
    res.status(200).json(task);
});

app.put('/taskslist/:tId', (req, res) => {
    const tId = parseInt(req.params.tId);
    const task = tasks.find(task => task.id === tId);
    
    if(!task) {
        return res.status(404).json({
            error:'Task not found'
        });
    }
    const { description, completed } = req.body;
    if(description){
        task.description = description;
    }
    if(completed !== undefined){
        task.completed = completed;
    }
    res.status(200).json(task);
    
});

app.delete('/taskslist/:tId', (req, res) => {
    const tId = parseInt(req.params.tId);
    const taskIndex = tasks.findIndex(task => task.id === tId);

    if(taskIndex === -1){
        return res.status(404).json({
            error: 'task not found'
        });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});
app.listen(3000, () => {
  console.log('Server running');
});
