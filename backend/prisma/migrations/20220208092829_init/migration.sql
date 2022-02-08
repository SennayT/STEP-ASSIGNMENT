-- CreateTable
CREATE TABLE "Todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT NOT NULL,
    "color" TEXT
);
