import {
  BankAccountType,
  BankVerificationStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export type BankAccountInput = {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  accountType?: BankAccountType;
  isDefault?: boolean;
};

function maskAccountNumber(accountNumber: string): string {
  const digits = accountNumber.replace(/\s/g, "");
  if (digits.length <= 4) return "*".repeat(digits.length || 4);
  return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
}

function mapBankAccount(
  account: Prisma.OrganizerBankAccountGetPayload<{
    include: { linkedEvents: true };
  }>
) {
  return {
    id: account.id,
    accountHolderName: account.accountHolderName,
    accountNumber: account.accountNumber,
    maskedAccountNumber: maskAccountNumber(account.accountNumber),
    ifscCode: account.ifscCode,
    bankName: account.bankName,
    branchName: account.branchName,
    accountType: account.accountType,
    isDefault: account.isDefault,
    verificationStatus: account.verificationStatus,
    linkedEvents: account.linkedEvents.map((link) => ({
      id: link.id,
      eventId: link.eventId,
      eventName: link.eventName,
    })),
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

const includeLinks = { linkedEvents: true } as const;

async function getOwnedAccount(userId: string, accountId: string) {
  const account = await prisma.organizerBankAccount.findFirst({
    where: { id: accountId, userId },
    include: includeLinks,
  });
  if (!account) {
    throw new AppError("Bank account not found", 404, "BANK_NOT_FOUND");
  }
  return account;
}

/** Keep OrganizerProfile bank columns mirrored for any legacy readers. */
async function mirrorBankToProfile(
  userId: string,
  input: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName?: string | null;
    accountType?: BankAccountType | null;
  }
) {
  await prisma.organizerProfile.updateMany({
    where: { userId },
    data: {
      bankAccountHolderName: input.accountHolderName,
      bankAccountNumber: input.accountNumber,
      bankIfscCode: input.ifscCode,
      bankName: input.bankName,
      bankBranchName: input.branchName ?? null,
      bankAccountType: input.accountType ?? null,
    },
  });
}

/**
 * One-time bridge: Organizer Profile used to store bank fields inline.
 * Move them into OrganizerBankAccount (single source of truth) when empty.
 */
async function migrateLegacyBankFromProfile(userId: string) {
  const existingCount = await prisma.organizerBankAccount.count({
    where: { userId },
  });
  if (existingCount > 0) return;

  const profile = await prisma.organizerProfile.findUnique({
    where: { userId },
  });
  if (
    !profile?.bankAccountNumber?.trim() ||
    !profile.bankName?.trim() ||
    !profile.bankAccountHolderName?.trim() ||
    !profile.bankIfscCode?.trim()
  ) {
    return;
  }

  await prisma.organizerBankAccount.create({
    data: {
      userId,
      accountHolderName: profile.bankAccountHolderName.trim(),
      accountNumber: profile.bankAccountNumber.trim(),
      ifscCode: profile.bankIfscCode.trim().toUpperCase(),
      bankName: profile.bankName.trim(),
      branchName: profile.bankBranchName?.trim() || null,
      accountType: profile.bankAccountType,
      isDefault: true,
      verificationStatus: BankVerificationStatus.pending,
    },
  });
}

export const financialsService = {
  async listBankAccounts(userId: string) {
    await migrateLegacyBankFromProfile(userId);
    const accounts = await prisma.organizerBankAccount.findMany({
      where: { userId },
      include: includeLinks,
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return accounts.map(mapBankAccount);
  },

  async getPrimaryBankAccount(userId: string) {
    const accounts = await this.listBankAccounts(userId);
    return accounts.find((account) => account.isDefault) || accounts[0] || null;
  },

  /** Upsert the organizer's primary/default bank account (used by Organizer Profile). */
  async upsertPrimaryBankAccount(userId: string, input: BankAccountInput) {
    await migrateLegacyBankFromProfile(userId);

    const existing = await prisma.organizerBankAccount.findFirst({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });

    if (existing) {
      return this.updateBankAccount(userId, existing.id, input);
    }

    return this.addBankAccount(userId, { ...input, isDefault: true });
  },

  async addBankAccount(userId: string, input: BankAccountInput) {
    const existingCount = await prisma.organizerBankAccount.count({
      where: { userId },
    });
    const makeDefault = input.isDefault === true || existingCount === 0;

    const account = await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.organizerBankAccount.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.organizerBankAccount.create({
        data: {
          userId,
          accountHolderName: input.accountHolderName.trim(),
          accountNumber: input.accountNumber.trim(),
          ifscCode: input.ifscCode.trim().toUpperCase(),
          bankName: input.bankName.trim(),
          branchName: input.branchName?.trim() || null,
          accountType: input.accountType,
          isDefault: makeDefault,
          verificationStatus: BankVerificationStatus.pending,
        },
        include: includeLinks,
      });
    });

    if (account.isDefault) {
      await mirrorBankToProfile(userId, account);
    }

    return mapBankAccount(account);
  },

  async updateBankAccount(
    userId: string,
    accountId: string,
    input: Partial<BankAccountInput>
  ) {
    await getOwnedAccount(userId, accountId);

    const account = await prisma.organizerBankAccount.update({
      where: { id: accountId },
      data: {
        ...(input.accountHolderName !== undefined
          ? { accountHolderName: input.accountHolderName.trim() }
          : {}),
        ...(input.accountNumber !== undefined
          ? { accountNumber: input.accountNumber.trim() }
          : {}),
        ...(input.ifscCode !== undefined
          ? { ifscCode: input.ifscCode.trim().toUpperCase() }
          : {}),
        ...(input.bankName !== undefined
          ? { bankName: input.bankName.trim() }
          : {}),
        ...(input.branchName !== undefined
          ? { branchName: input.branchName.trim() || null }
          : {}),
        ...(input.accountType !== undefined
          ? { accountType: input.accountType }
          : {}),
      },
      include: includeLinks,
    });

    if (account.isDefault) {
      await mirrorBankToProfile(userId, account);
    }

    return mapBankAccount(account);
  },

  async deleteBankAccount(userId: string, accountId: string) {
    const account = await getOwnedAccount(userId, accountId);
    if (account.linkedEvents.length > 0) {
      throw new AppError(
        "Cannot delete a bank account with linked events. Unlink events first.",
        400,
        "BANK_HAS_EVENTS"
      );
    }

    await prisma.organizerBankAccount.delete({ where: { id: accountId } });

    if (account.isDefault) {
      const next = await prisma.organizerBankAccount.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });
      if (next) {
        await prisma.organizerBankAccount.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return { deleted: true };
  },

  async setDefaultBank(userId: string, accountId: string) {
    await getOwnedAccount(userId, accountId);

    const account = await prisma.$transaction(async (tx) => {
      await tx.organizerBankAccount.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
      return tx.organizerBankAccount.update({
        where: { id: accountId },
        data: { isDefault: true },
        include: includeLinks,
      });
    });

    await mirrorBankToProfile(userId, account);
    return mapBankAccount(account);
  },

  async linkEvent(
    userId: string,
    accountId: string,
    input: { eventName: string; eventId?: string }
  ) {
    await getOwnedAccount(userId, accountId);
    const eventName = input.eventName.trim();
    if (!eventName) {
      throw new AppError("Event name is required", 400, "EVENT_REQUIRED");
    }

    try {
      await prisma.organizerBankEventLink.create({
        data: {
          bankAccountId: accountId,
          eventName,
          eventId: input.eventId?.trim() || null,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "This event is already linked to the bank account",
          409,
          "EVENT_ALREADY_LINKED"
        );
      }
      throw error;
    }

    return mapBankAccount(await getOwnedAccount(userId, accountId));
  },

  async unlinkEvent(userId: string, accountId: string, linkId: string) {
    await getOwnedAccount(userId, accountId);
    const link = await prisma.organizerBankEventLink.findFirst({
      where: { id: linkId, bankAccountId: accountId },
    });
    if (!link) {
      throw new AppError("Linked event not found", 404, "LINK_NOT_FOUND");
    }
    await prisma.organizerBankEventLink.delete({ where: { id: linkId } });
    return mapBankAccount(await getOwnedAccount(userId, accountId));
  },
};
