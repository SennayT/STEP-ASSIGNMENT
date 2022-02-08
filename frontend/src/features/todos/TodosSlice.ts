import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { stat } from "fs";
import TodoService, { TodoLocal, TodoRemote } from "../../service/TodoService";
import { RootState } from "../../store";
import { StatusFilters } from "../filters/filterSlice";

export interface Todo {
  id: number;
  completed: boolean;
  text: string;
  color?: string;
}

type TodoEntity = { [id: number]: Todo };

const todosAdapter = createEntityAdapter<Todo>({
  selectId: (todo) => todo.id,
});
const initialState = todosAdapter.getInitialState({
  status: "idle",
});

const todoService: TodoService = new TodoRemote();

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const todos = await todoService.getAllTodos();
  console.log(todos);
  return todos;
});

export const saveNewTodo = createAsyncThunk(
  "todos/saveNewTodo",
  async (text: string) => {
    const todo = await todoService.addTodoFromText(text);
    return todo;
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number) => {
    await todoService.deleteTodo(id);
    return id;
  }
);

export const changeColor = createAsyncThunk(
  "todos/changeColor",
  async ({ id, color }: { id: number; color: string }) => {
    const todo = await todoService.getTodo(id);
    const newTodo: Todo = {
      ...todo,
      color,
    };

    return await todoService.updateTodo(id, newTodo);
  }
);

export const toggleTodo = createAsyncThunk(
  "todos/toggle",
  async (id: number) => {
    let todo = await todoService.getTodo(id);
    todo = {
      ...todo,
      completed: !todo.completed,
    };

    todo = await todoService.updateTodo(id, todo);
    return todo;
  }
);
