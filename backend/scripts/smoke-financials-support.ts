import { prisma } from "../src/config/prisma";
import { signAccessToken } from "../src/utils/jwt";

const BASE = "http://localhost:5000/api";

async function req(
  path: string,
  token: string,
  init: RequestInit = {}
) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(`${path} -> ${res.status} ${json.message || "fail"}`);
  }
  return json.data;
}

async function main() {
  const u = await prisma.user.findFirst({ orderBy: { createdAt: "desc" } });
  if (!u) throw new Error("NO_USER");
  const token = signAccessToken({ userId: u.id, role: u.role });

  const banks = await req("/financials/bank-accounts", token);
  console.log("banks", banks.length);

  const added = await req("/financials/bank-accounts", token, {
    method: "POST",
    body: JSON.stringify({
      accountHolderName: "Vinit Test",
      accountNumber: "123456789012",
      ifscCode: "HDFC0001234",
      bankName: "HDFC BANK",
      branchName: "MG Road",
      accountType: "savings",
    }),
  });
  console.log("added", added.maskedAccountNumber, "default", added.isDefault);

  const linked = await req(
    `/financials/bank-accounts/${added.id}/link-event`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ eventName: "Timed Trial Run" }),
    }
  );
  console.log("linked", linked.linkedEvents[0].eventName);

  let blocked = false;
  try {
    await req(`/financials/bank-accounts/${added.id}`, token, {
      method: "DELETE",
    });
  } catch {
    blocked = true;
  }
  console.log("deleteBlocked", blocked);

  await req(
    `/financials/bank-accounts/${added.id}/link-event/${linked.linkedEvents[0].id}`,
    token,
    { method: "DELETE" }
  );

  const deleted = await req(`/financials/bank-accounts/${added.id}`, token, {
    method: "DELETE",
  });
  console.log("deleted", deleted.deleted);

  const ticket = await req("/support/tickets", token, {
    method: "POST",
    body: JSON.stringify({
      type: "general",
      subject: "Test ticket",
      description: "Smoke test query",
      priority: "high",
    }),
  });
  console.log("ticket", ticket.ticketNumber, ticket.status);

  const list = await req("/support/tickets", token);
  console.log("tickets", list.length);

  console.log("SMOKE_OK");
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
