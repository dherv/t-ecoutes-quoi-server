-- CreateTable
CREATE TABLE "Friend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "friendAId" INTEGER NOT NULL,
    "friendBId" INTEGER NOT NULL,
    FOREIGN KEY ("friendAId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("friendBId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Friend.friendAId_friendBId_unique" ON "Friend"("friendAId", "friendBId");
