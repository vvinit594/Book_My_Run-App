import { BankAccount } from "../types/financials";
import { BankDetails } from "../types/organizer";
import { ApiError, apiRequest } from "./apiClient";

function mapError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function getBankAccounts(): Promise<{
  success: boolean;
  accounts: BankAccount[];
  error?: string;
}> {
  try {
    const accounts = await apiRequest<BankAccount[]>(
      "/financials/bank-accounts",
      { method: "GET" },
      true
    );
    return { success: true, accounts };
  } catch (error) {
    return {
      success: false,
      accounts: [],
      error: mapError(error, "Failed to load bank accounts"),
    };
  }
}

/** Upsert primary bank account — same record Organizer Profile edits. */
export async function upsertPrimaryBankAccount(
  details: BankDetails
): Promise<{ success: boolean; account?: BankAccount; error?: string }> {
  const listed = await getBankAccounts();
  if (!listed.success) {
    return { success: false, error: listed.error };
  }

  const primary =
    listed.accounts.find((account) => account.isDefault) || listed.accounts[0];

  if (primary) {
    return updateBankAccount(primary.id, details);
  }

  return addBankAccount(details, true);
}

export async function addBankAccount(
  details: BankDetails,
  isDefault?: boolean
): Promise<{ success: boolean; account?: BankAccount; error?: string }> {
  try {
    const account = await apiRequest<BankAccount>(
      "/financials/bank-accounts",
      {
        method: "POST",
        body: JSON.stringify({
          accountHolderName: details.accountHolderName,
          accountNumber: details.accountNumber,
          ifscCode: details.ifscCode,
          bankName: details.bankName,
          branchName: details.branchName || undefined,
          accountType: details.accountType || undefined,
          isDefault,
        }),
      },
      true
    );
    return { success: true, account };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to add bank account"),
    };
  }
}

export async function updateBankAccount(
  id: string,
  details: BankDetails
): Promise<{ success: boolean; account?: BankAccount; error?: string }> {
  try {
    const account = await apiRequest<BankAccount>(
      `/financials/bank-accounts/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          accountHolderName: details.accountHolderName,
          accountNumber: details.accountNumber,
          ifscCode: details.ifscCode,
          bankName: details.bankName,
          branchName: details.branchName || undefined,
          accountType: details.accountType || undefined,
        }),
      },
      true
    );
    return { success: true, account };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to update bank account"),
    };
  }
}

export async function deleteBankAccount(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest(`/financials/bank-accounts/${id}`, { method: "DELETE" }, true);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to delete bank account"),
    };
  }
}

export async function setDefaultBank(
  id: string
): Promise<{ success: boolean; account?: BankAccount; error?: string }> {
  try {
    const account = await apiRequest<BankAccount>(
      `/financials/bank-accounts/${id}/default`,
      { method: "POST" },
      true
    );
    return { success: true, account };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to set default bank"),
    };
  }
}

export async function linkEventToBank(
  id: string,
  eventName: string,
  eventId?: string
): Promise<{ success: boolean; account?: BankAccount; error?: string }> {
  try {
    const account = await apiRequest<BankAccount>(
      `/financials/bank-accounts/${id}/link-event`,
      {
        method: "POST",
        body: JSON.stringify({ eventName, eventId }),
      },
      true
    );
    return { success: true, account };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to link event"),
    };
  }
}

export async function unlinkEventFromBank(
  id: string,
  linkId: string
): Promise<{ success: boolean; account?: BankAccount; error?: string }> {
  try {
    const account = await apiRequest<BankAccount>(
      `/financials/bank-accounts/${id}/link-event/${linkId}`,
      { method: "DELETE" },
      true
    );
    return { success: true, account };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to unlink event"),
    };
  }
}
