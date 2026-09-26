const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory "database"
let todos = [
  { id: 1, task: 'Learn Express routing', completed: false },
  { id: 2, task: 'Build a CRUD API', completed: true },
  { id: 3, task: 'Submit assignment', completed: false },
];
let nextId = 4;

// Helper: find a todo by id, or undefined if not found
function findTodoById(id) {
  return todos.find((todo) => todo.id === id);
}

// --- Routes ---

// GET /todos - list all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET /todos/active - bonus: only todos where completed is false
// NOTE: this must be declared BEFORE /todos/:id, otherwise Express
// would treat "active" as an :id value and this route would never run.
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((todo) => !todo.completed);
  res.json(activeTodos);
});

// GET /todos/:id - single read
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id must be a number' });
  }

  const todo = findTodoById(id);

  if (!todo) {
    return res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  res.json(todo);
});

// POST /todos - create a new todo (task is required)
app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: '"task" field is required' });
  }

  const newTodo = {
    id: nextId++,
    task: task.trim(),
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /todos/:id - full update (task + completed)
app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = findTodoById(id);

  if (!todo) {
    return res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  const { task, completed } = req.body;

  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({ error: '"task" field is required' });
  }

  todo.task = task.trim();
  todo.completed = typeof completed === 'boolean' ? completed : todo.completed;

  res.json(todo);
});

// PATCH /todos/:id - partial update (e.g. just toggle completed)
app.patch('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = findTodoById(id);

  if (!todo) {
    return res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  const { task, completed } = req.body;

  if (task !== undefined) {
    if (typeof task !== 'string' || task.trim() === '') {
      return res.status(400).json({ error: '"task" must be a non-empty string' });
    }
    todo.task = task.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: '"completed" must be a boolean' });
    }
    todo.completed = completed;
  }

  res.json(todo);
});

// DELETE /todos/:id - remove a todo
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  const [deleted] = todos.splice(index, 1);
  res.json({ message: 'Todo deleted', todo: deleted });
});

app.listen(PORT, () => {
  console.log(`Todo API running on http://localhost:${PORT}`);
});