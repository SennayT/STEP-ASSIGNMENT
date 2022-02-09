import express from "express";
import { TodoService, TodoServiceImpl } from "../service/TodoService";
import cors from "cors";
const app = express();
app.use(cors());

app.use(express.json());

const todoService: TodoService = new TodoServiceImpl();

app.get("/api/todos", async (req, res) => {
  const todos = await todoService.getAllTodos();
  return res.json(todos);
});

app.get("/api/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const todo = await todoService.getTodo(id);
    return res.json(todo);
  } catch (err) {
    return res.status(404).json({ error: err });
  }
});

app.post("/api/todos", async (req, res) => {
  const { text, completed, color } = req.body;
  const todo = await todoService.addTodo({
    text,
    color,
    completed,
  });

  return res.json(todo);
});
app.patch("/api/todos", async (req, res) => {
  const { text, completed, color } = req.body;
  const todo = await todoService.addTodo({
    text,
  });

  return res.json(todo);
});
