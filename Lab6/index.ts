import mongoose from "mongoose";
import TodosDao from "./dao";
export default function Lab6(app) {
  const dao = TodosDao();
  const status = (req, res) => {
    // A readyState of 1 means the connection to the database is open.
    res.json({
      mongo: mongoose.connection.readyState === 1,
      database: mongoose.connection.name,
    });
  };
  const findAllTodos = async (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const todos = await dao.findTodosByCompleted(completed === "true");
      res.json(todos);
      return;
    }
    const todos = await dao.findAllTodos();
    res.json(todos);
  };
  const findTodoById = async (req, res) => {
    const todo = await dao.findTodoById(req.params.id);
    res.json(todo);
  };
  const createTodo = async (req, res) => {
    const todo = await dao.createTodo(req.body);
    res.json(todo);
  };
  const updateTodo = async (req, res) => {
    const status = await dao.updateTodo(req.params.id, req.body);
    res.json(status);
  };
  const deleteTodo = async (req, res) => {
    const status = await dao.deleteTodo(req.params.id);
    res.json(status);
  };
  app.get("/lab6/status", status);
  app.get("/lab6/todos", findAllTodos);
  app.get("/lab6/todos/:id", findTodoById);
  app.post("/lab6/todos", createTodo);
  app.put("/lab6/todos/:id", updateTodo);
  app.delete("/lab6/todos/:id", deleteTodo);
}
