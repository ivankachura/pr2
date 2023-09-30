const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Массив для хранения задач
const tasks = [];
// Массив для хранения информации о запросах к API
const apiRequests = [];

// Middleware для записи информации о запросах к API
app.use((req, res, next) => {
  const { method, url, body } = req;
  const date = new Date().toLocaleString();
  
  // Записываем информацию о запросе в массив
  apiRequests.push({ method, url, body, date });
  next();
});

// Роут для получения списка задач
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Роут для создания новой задачи
app.post('/api/tasks', (req, res) => {
  const { text, assignee } = req.body;
  const newTask = { text, assignee };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Роут для обновления задачи
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, assignee } = req.body;
  const taskIndex = tasks.findIndex((task, index) => index === Number(id));
  if (taskIndex !== -1) {
    tasks[taskIndex] = { text, assignee };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Задача не найдена' });
  }
});

// Роут для удаления задачи
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((task, index) => index === Number(id));
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Задача не найдена' });
  }
});

// Роут для получения списка запросов к API
app.get('/api/requests', (req, res) => {
  res.json(apiRequests);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
