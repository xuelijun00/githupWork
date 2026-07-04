-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchNo" TEXT NOT NULL,
    "sourceUnit" TEXT NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "sampleCount" INTEGER NOT NULL,
    "currentResponsible" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "samples" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionNo" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "preservationCondition" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentResponsible" TEXT NOT NULL,
    "abnormalReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "samples_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sampleId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actionTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remark" TEXT,
    CONSTRAINT "records_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "samples" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "records_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "batches_batchNo_key" ON "batches"("batchNo");
