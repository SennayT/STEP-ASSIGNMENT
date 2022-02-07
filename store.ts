import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "./features/todos/TodosSlice";
import filterReducer from "./features/filters/filterSlice";
const store = configureStore({
  reducer: {
    todos: todosReducer,
    filters: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
