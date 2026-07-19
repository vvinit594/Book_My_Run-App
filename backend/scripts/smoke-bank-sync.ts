import { prisma } from "../src/config/prisma";
import { financialsService } from "../src/services/financials.service";
import { signAccessToken } from "../src/utils/jwt";

async function main() {
  const profile = await prisma.organizerProfile.findFirst({
    where: {
      bankAccountNumber: { not: null },
      bankName: { not: null },
    },
    orderBy: { updatedAt: "desc" },
  });
  if (!profile) {
    console.log("NO_PROFILE_WITH_BANK");
    process.exit(1);
  }

  // Wipe bank accounts so migrate-from-profile path is exercised
  await prisma.organizerBankEventLink.deleteMany({
    where: { bankAccount: { userId: profile.userId } },
  });
  await prisma.organizerBankAccount.deleteMany({
    where: { userId: profile.userId },
  });

  const listed = await financialsService.listBankAccounts(profile.userId);
  console.log(
    "migrated",
    listed.length,
    listed[0]?.bankName,
    listed[0]?.maskedAccountNumber
  );

  const primary = await financialsService.getPrimaryBankAccount(profile.userId);
  if (!primary || primary.accountNumber !== profile.bankAccountNumber) {
    throw new Error("Primary bank did not match OrganizerProfile bank fields");
  }

  const updated = await financialsService.upsertPrimaryBankAccount(
    profile.userId,
    {
      accountHolderName: primary.accountHolderName,
      accountNumber: primary.accountNumber,
      ifscCode: primary.ifscCode,
      bankName: primary.bankName,
      branchName: primary.branchName || undefined,
      accountType: primary.accountType || undefined,
    }
  );
  const again = await financialsService.listBankAccounts(profile.userId);
  if (again.length !== 1) {
    throw new Error(`Expected 1 bank account after upsert, got ${again.length}`);
  }
  console.log("upsertKeptSingle", again.length, updated.id);

  const token = signAccessToken({ userId: profile.userId, role: "ORGANIZER" });
  const res = await fetch("http://localhost:5000/api/financials/bank-accounts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success || !json.data?.length) {
    throw new Error("API list empty after migrate");
  }
  console.log("apiCount", json.data.length, json.data[0].bankName);
  console.log("SYNC_OK");
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
