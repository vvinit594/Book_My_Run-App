-- CreateEnum
CREATE TYPE "BankVerificationStatus" AS ENUM ('pending', 'verified', 'failed');

-- CreateEnum
CREATE TYPE "SupportTicketPriority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('open', 'in_progress', 'waiting_for_organizer', 'resolved', 'closed');

-- CreateTable
CREATE TABLE "OrganizerBankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "branchName" TEXT,
    "accountType" "BankAccountType",
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "BankVerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizerBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizerBankEventLink" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "eventId" TEXT,
    "eventName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizerBankEventLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "SupportTicketPriority" NOT NULL DEFAULT 'medium',
    "eventName" TEXT,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicketAttachment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportTicketAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicketCounter" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SupportTicketCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizerBankAccount_userId_idx" ON "OrganizerBankAccount"("userId");

-- CreateIndex
CREATE INDEX "OrganizerBankEventLink_bankAccountId_idx" ON "OrganizerBankEventLink"("bankAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizerBankEventLink_bankAccountId_eventName_key" ON "OrganizerBankEventLink"("bankAccountId", "eventName");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber");

-- CreateIndex
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "SupportTicketAttachment_ticketId_idx" ON "SupportTicketAttachment"("ticketId");

-- AddForeignKey
ALTER TABLE "OrganizerBankAccount" ADD CONSTRAINT "OrganizerBankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizerBankEventLink" ADD CONSTRAINT "OrganizerBankEventLink_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "OrganizerBankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicketAttachment" ADD CONSTRAINT "SupportTicketAttachment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
