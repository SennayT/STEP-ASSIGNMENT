import { Todo } from "../features/todos/TodosSlice";
import axios from "axios";

interface TodoService {
  getAllTodos(): Promise<Todo[]>;
  getTodo(id: number): Promise<Todo>;
  addTodo(todo: Todo): Promise<Todo>;
  addTodoFromText(text: string): Promise<Todo>;
  updateTodo(id: number, newInfo: Todo): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
}

export class TodoRemote implements TodoService {
  url = "http://localhost:4000/api/todos";
  addTodo(todo: Todo): Promise<Todo> {
    return new Promise<Todo>(async (resolve, reject) => {
      try {
        const { data } = await axios.post<Todo>(this.url, {
          ...todo,
        });

        resolve(data);
      } catch (err) {
        reject(err);
      }
    });

    // return Promise.resolve(undefined);
  }

  addTodoFromText(text: string): Promise<Todo> {
    return new Promise<Todo>(async (resolve, reject) => {
      try {
        const { data } = await axios.post<Todo>(this.url, {
          completed: false,
          text,
          color: " ",
        });
        console.log("inside add todo");
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  deleteTodo(id: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await axios.delete(`${this.url}/${id}`);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  getAllTodos(): Promise<Todo[]> {
    return axios.get(this.url);
    return new Promise<Todo[]>(async (resolve, reject) => {
      try {
        const { data } = await axios.get<Todo[]>(this.url);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  getTodo(id: number): Promise<Todo> {
    return axios.get(`${this.url}/${id}`);
    return new Promise<Todo>(async (resolve, reject) => {
      try {
        const { data } = await axios.get<Todo>(`${this.url}/${id}`);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  updateTodo(id: number, newInfo: Todo): Promise<Todo> {
    return axios.put(`${this.url}/${id}`, {
      ...newInfo,
    });
    return new Promise<Todo>(async (resolve, reject) => {
      try {
        const { data } = await axios.put<Todo>(`${this.url}/${id}`, {
          completed: newInfo.completed,
          text: newInfo.text,
          color: newInfo.color,
        });

        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export class TodoLocal implements TodoService {
  todoList: Todo[];

  constructor() {
    this.todoList = [
      { id: 0, text: "Learn React", completed: true },
      { id: 1, text: "Learn Redux", completed: false, color: "purple" },
      { id: 2, text: "Build something fun!", completed: false, color: "blue" },
    ];
  }

  getAllTodos(): Promise<Todo[]> {
    return new Promise<Todo[]>((resolve, reject) => {
      resolve([...this.todoList]);
    });
  }
  getTodo(id: number): Promise<Todo> {
    return new Promise<Todo>((resolve, reject) => {
      const todo = this.todoList.find((todo) => todo.id === id);
      if (todo === undefined) {
        reject(`Todo with id ${id} not found`);
        return;
      }
      resolve({ ...todo });
    });
  }
  addTodo(todo: Todo): Promise<Todo> {
    return new Promise<Todo>((resolve, reject) => {
      const id = this.nextTodoId();
      const newTodo: Todo = {
        ...todo,
        id,
      };
      this.todoList.push(newTodo);
      resolve({ ...newTodo });
    });
  }
  addTodoFromText(text: string): Promise<Todo> {
    return new Promise((resolve, reject) => {
      const id = this.nextTodoId();
      const newTodo: Todo = {
        id,
        text,
        completed: false,
      };
      this.todoList.push(newTodo);
      resolve({ ...newTodo });
    });
  }
  updateTodo(id: number, newInfo: Todo): Promise<Todo> {
    return new Promise<Todo>((resolve, reject) => {
      const newTodo = {
        ...newInfo,
        id,
      };

      const oldTodo = this.todoList.find((todo) => todo.id === id);

      if (oldTodo === undefined) {
        reject(`Todo with id ${id} not found`);
        return;
      }

      const index = this.todoList.indexOf(oldTodo);
      this.todoList[index] = newTodo;

      resolve({ ...newTodo });
    });
  }
  deleteTodo(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.todoList = this.todoList.filter((todo) => todo.id !== id);
      console.log(`todo with id ${id} deleted`);
      resolve();
    });
  }

  nextTodoId() {
    const maxId = this.todoList.reduce(
      (maxId, todo) => Math.max(todo.id, maxId),
      -1
    );
    return maxId + 1;
  }
}

export default TodoService;
