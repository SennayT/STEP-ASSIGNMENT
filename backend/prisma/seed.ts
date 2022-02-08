import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const todos: Prisma.TodoCreateInput[] = [
  {
    text: "Feed the cat",
    completed: false,
    color: "red",
  },
  {
    text: "Feed the dod",
    completed: true,
    color: "green",
  },
  {
    text: "Study for STEP exam",
    completed: true,
    color: "blue",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const todo of todos) {
    const res = await prisma.todo.create({
      data: todo,
    });
    console.log(`Created todo with id ${res.id}`);
  }
  console.log(`Seeding finished.`);
}
