-- CreateTable
CREATE TABLE "User" (
    "UserID" SERIAL NOT NULL,
    "Username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "UserID" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overallScore" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "svasTotal" INTEGER NOT NULL,
    "rawInput" JSONB NOT NULL,
    "rawResult" JSONB NOT NULL,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("UserID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");
