-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "DatasetStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('THEME', 'PAIN_POINT', 'FEATURE_REQUEST', 'POSITIVE_SIGNAL', 'RECOMMENDATION');

-- CreateEnum
CREATE TYPE "InsightPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'MIXED');

-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DatasetStatus" NOT NULL DEFAULT 'UPLOADED',
    "originalFileName" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" DECIMAL(3,2),
    "source" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sentimentStats" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "type" "InsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "InsightPriority" NOT NULL DEFAULT 'MEDIUM',
    "frequency" INTEGER,
    "sentiment" "Sentiment",
    "evidence" JSONB,
    "recommendation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dataset_status_idx" ON "Dataset"("status");

-- CreateIndex
CREATE INDEX "Dataset_createdAt_idx" ON "Dataset"("createdAt");

-- CreateIndex
CREATE INDEX "Review_datasetId_idx" ON "Review"("datasetId");

-- CreateIndex
CREATE INDEX "Analysis_datasetId_idx" ON "Analysis"("datasetId");

-- CreateIndex
CREATE INDEX "Analysis_status_idx" ON "Analysis"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Report_analysisId_key" ON "Report"("analysisId");

-- CreateIndex
CREATE INDEX "Insight_reportId_type_idx" ON "Insight"("reportId", "type");

-- CreateIndex
CREATE INDEX "Insight_priority_idx" ON "Insight"("priority");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
