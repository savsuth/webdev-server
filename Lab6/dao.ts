import model from "./model";
import { v4 as uuidv4 } from "uuid";
export default function TodosDao() {
  const findAllTodos = () => model.find();
  const findTodosByCompleted = (completed) => model.find({ completed });
  const findTodoById = (todoId) => model.findById(todoId);
  const createTodo = (todo) => {
    const newTodo = { ...todo, _id: uuidv4() };
    return model.create(newTodo);
  };
  const updateTodo = (todoId, todo) =>
    model.updateOne({ _id: todoId }, { $set: todo });
  const deleteTodo = (todoId) => model.deleteOne({ _id: todoId });
  return {
    findAllTodos, findTodosByCompleted, findTodoById, createTodo, updateTodo,
    deleteTodo,
  };
}
