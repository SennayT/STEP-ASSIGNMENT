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


const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todoToggled(state, action: PayloadAction<number>) {
      const todoId = action.payload;
      const todo = state.entities[todoId];
      if (todo?.completed) todo.completed = !todo.completed;
    },
    todoColorSelected: {
      reducer(state, action: PayloadAction<{ todoId: number; color: string }>) {
        const { todoId, color } = action.payload;
        const todo = state.entities[todoId];
        if (todo?.color) {
          todo.color = color;
        }
      },
      prepare(todoId: number, color: string) {
        return {
          payload: { todoId, color },
        };
      },
    },
    //todoDeleted: todosAdapter.removeOne,
    allTodosCompleted(state) {
      Object.values(state.entities).forEach((todo) => {
        todo!!.completed = true;
        // if (todo) todo.completed = true;
      });
    },
    completedTodosCleared(state) {
      const completedTodoIds = Object.values(state.entities)
        .filter((todo) => todo?.completed)
        .map((todo) => (todo ? todo.id : -1));

      if (completedTodoIds) todosAdapter.removeMany(state, completedTodoIds);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        // const newEntities: TodoEntity = {};
        // action.payload.forEach((todo) => {
        //   newEntities[todo.id] = todo;
        // });
        // state.entities = newEntities;
        todosAdapter.setAll(state, action.payload);
        state.status = "idle";
      })
      .addCase(saveNewTodo.fulfilled, (state, action) => {
        const todo = action.payload;
        // state.entities[todo.id] = todo;
        todosAdapter.addOne(state, todo);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        todosAdapter.removeOne(state, action.payload);
      })
      .addCase(changeColor.fulfilled, (state, action) => {
        todosAdapter.setOne(state, action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        todosAdapter.setOne(state, action.payload);
      });
  },
});

export const {
  allTodosCompleted,
  todoToggled,
  completedTodosCleared,
  todoColorSelected,
  // todoDeleted,
} = todosSlice.actions;

export default todosSlice.reducer;

export const { selectAll: selectTodos, selectById: selectTodoById } =
  todosAdapter.getSelectors<RootState>((s) => s.todos);

export const selectTodoIds = createSelector(selectTodos, (todos) =>
  todos.map((todo) => todo.id)
);
