import { Prisma, Todo, PrismaClient } from "@prisma/client";

type TodoInput = Prisma.TodoCreateInput;

export interface TodoService {
  getAllTodos(): Promise<Todo[]>;
  getTodo(id: number): Promise<Todo>;
  addTodo(todo: TodoInput): Promise<Todo>;
  addTodoFromText(text: string): Promise<Todo>;
  updateTodo(id: number, newInfo: TodoInput): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
}

export class TodoServiceImpl implements TodoService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  updateTodo(id: number, newInfo: Prisma.TodoCreateInput): Promise<Todo> {
    return new Promise(async (resolve, reject) => {
      const todo = await this.prisma.todo.update({
        where: {
          id,
        },
        data: {
          ...newInfo,
        },
      });
      resolve(todo);
    });
  }
  deleteTodo(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getTodo(id: number): Promise<Todo> {
    return new Promise<Todo>(async (resolve, reject) => {
      const todo = await this.prisma.todo.findUnique({
        where: {
          id,
        },
      });
      if (todo === null) {
        reject(`Todo with id ${id} not found`);
      } else {
        resolve(todo);
      }
    });
  }

  addTodo(todo: Prisma.TodoCreateInput): Promise<Todo> {
    return new Promise(async (resolve, reject) => {
      const newTodo = await this.prisma.todo.create({
        data: {
          completed: todo.completed,
          color: todo.color,
          text: todo.text,
        },
      });
      resolve(newTodo);
    });
  }

  addTodoFromText(text: string): Promise<Todo> {
    return new Promise(async (resolve, reject) => {
      const todo = await this.prisma.todo.create({
        data: {
          text,
        },
      });
      resolve(todo);
    });
  }

  getAllTodos(): Promise<Todo[]> {
    return new Promise<Todo[]>(async (resolve, reject) => {
      const res = await this.prisma.todo.findMany();
      resolve(res);
    });
  }
}
