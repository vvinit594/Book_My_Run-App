import {
  BankAccountType,
  GstStatus,
  OrganizationType,
} from "@prisma/client";
import prisma from "../config/prisma";
import {
  OrganizerProfileInput,
  organizerRepository,
} from "../repositories/organizer.repository";
import { AppError } from "../utils/AppError";
import {
  isValidAadhaar,
  isValidEmail,
  isValidPan,
  validateGstAgainstPan,
} from "../utils/indiaIds";
import { financialsService } from "./financials.service";

export type OrganizerProfileBody = {
  logoUri?: string | null;
  logoUrl?: string | null;
  organizerName: string;
  aboutOrganizer?: string;
  websiteUrl?: string;
  organizationType?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  permanentAddress?: string;
  billingAddressSameAsPermanent?: boolean;
  billingAddress?: string;
  primaryUserName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  backupPhone?: string;
  supportEmail?: string;
  emailNotificationForRegistration?: boolean;
  gstStatus?: string;
  gstNumber?: string;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branchName?: string;
    accountType?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  completed?: boolean;
};

function asEnum<T extends string>(
  value: string | undefined | null,
  allowed: readonly T[]
): T | null {
  if (!value) return null;
  return allowed.includes(value as T) ? (value as T) : null;
}

function mapBodyToInput(body: OrganizerProfileBody): OrganizerProfileInput {
  if (!body.organizerName?.trim()) {
    throw new AppError("Organizer name is required", 400, "VALIDATION_ERROR");
  }

  const organizationType = asEnum(body.organizationType, [
    "individual",
    "organization",
  ] as const) as OrganizationType | null;

  const gstStatus = asEnum(body.gstStatus, [
    "registered",
    "unregistered",
  ] as const) as GstStatus | null;

  const bankAccountType = asEnum(body.bankDetails?.accountType, [
    "savings",
    "current",
  ] as const) as BankAccountType | null;

  const panNumber = body.panNumber?.trim().toUpperCase() || null;
  if (!panNumber || !isValidPan(panNumber)) {
    throw new AppError("Enter a valid PAN Card Number", 400, "INVALID_PAN");
  }

  const supportEmail = body.supportEmail?.trim().toLowerCase() || "";
  if (!supportEmail || !isValidEmail(supportEmail)) {
    throw new AppError(
      "Support Email ID is required",
      400,
      "INVALID_SUPPORT_EMAIL"
    );
  }

  let aadhaarNumber: string | null = null;
  if (organizationType === "individual") {
    const aadhaar = body.aadhaarNumber?.replace(/\D/g, "") || "";
    if (!isValidAadhaar(aadhaar)) {
      throw new AppError(
        "Enter a valid 12-digit Aadhaar Card Number",
        400,
        "INVALID_AADHAAR"
      );
    }
    aadhaarNumber = aadhaar;
  }

  const gstNumber = body.gstNumber?.trim().toUpperCase() || null;
  if (gstStatus === "registered") {
    const gstCheck = validateGstAgainstPan(gstNumber || "", panNumber);
    if (!gstCheck.valid) {
      throw new AppError(
        gstCheck.message || "Invalid GST Number",
        400,
        "INVALID_GST"
      );
    }
  }

  return {
    logoUrl: body.logoUrl ?? body.logoUri ?? null,
    organizerName: body.organizerName.trim(),
    aboutOrganizer: body.aboutOrganizer?.trim() || null,
    websiteUrl: body.websiteUrl?.trim() || null,
    organizationType,
    panNumber,
    aadhaarNumber,
    permanentAddress: body.permanentAddress?.trim() || null,
    billingAddressSameAsPermanent: body.billingAddressSameAsPermanent ?? true,
    billingAddress: body.billingAddress?.trim() || null,
    primaryUserName: body.primaryUserName?.trim() || null,
    backupPhone: body.backupPhone?.replace(/\D/g, "").slice(-10) || null,
    supportEmail,
    emailNotificationForRegistration:
      body.emailNotificationForRegistration ?? true,
    gstStatus,
    gstNumber: gstStatus === "registered" ? gstNumber : null,
    bankAccountHolderName: body.bankDetails?.accountHolderName?.trim() || null,
    bankAccountNumber: body.bankDetails?.accountNumber?.trim() || null,
    bankIfscCode: body.bankDetails?.ifscCode?.trim().toUpperCase() || null,
    bankName: body.bankDetails?.bankName?.trim() || null,
    bankBranchName: body.bankDetails?.branchName?.trim() || null,
    bankAccountType,
    instagram: body.socialMedia?.instagram?.trim() || null,
    facebook: body.socialMedia?.facebook?.trim() || null,
    twitter: body.socialMedia?.twitter?.trim() || null,
    linkedin: body.socialMedia?.linkedin?.trim() || null,
    youtube: body.socialMedia?.youtube?.trim() || null,
    isProfileCompleted: body.completed !== false,
  };
}

async function getAuthContact(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, phone: true, name: true, isVerified: true },
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return user;
}

function applyPrimaryBankDetails<T extends { bankDetails: Record<string, unknown> }>(
  publicProfile: T,
  bank: Awaited<ReturnType<typeof financialsService.getPrimaryBankAccount>>
): T {
  if (!bank) return publicProfile;
  return {
    ...publicProfile,
    bankDetails: {
      accountHolderName: bank.accountHolderName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode,
      bankName: bank.bankName,
      branchName: bank.branchName ?? "",
      accountType: bank.accountType ?? "",
    },
  };
}

export class OrganizerService {
  async getProfile(userId: string) {
    const authUser = await getAuthContact(userId);
    const profile = await organizerRepository.findByUserId(userId);

    if (!profile) {
      return {
        isProfileCompleted: false,
        profile: null,
        authContact: {
          email: authUser.email,
          phone: authUser.phone,
          name: authUser.name,
          isVerified: authUser.isVerified,
        },
      };
    }

    const primaryBank = await financialsService.getPrimaryBankAccount(userId);

    return {
      isProfileCompleted: profile.isProfileCompleted,
      profile: applyPrimaryBankDetails(
        organizerRepository.toPublic(profile, authUser),
        primaryBank
      ),
      authContact: {
        email: authUser.email,
        phone: authUser.phone,
        name: authUser.name,
        isVerified: authUser.isVerified,
      },
    };
  }

  async createOrUpdateProfile(userId: string, body: OrganizerProfileBody) {
    const authUser = await getAuthContact(userId);
    const input = mapBodyToInput(body);
    const profile = await organizerRepository.upsertProfile(userId, input);

    // OrganizerBankAccount is the source of truth — upsert primary from profile form.
    const bank = body.bankDetails;
    if (
      bank?.accountHolderName?.trim() &&
      bank.accountNumber?.trim() &&
      bank.ifscCode?.trim() &&
      bank.bankName?.trim()
    ) {
      const accountType = asEnum(bank.accountType, [
        "savings",
        "current",
      ] as const);
      await financialsService.upsertPrimaryBankAccount(userId, {
        accountHolderName: bank.accountHolderName,
        accountNumber: bank.accountNumber,
        ifscCode: bank.ifscCode,
        bankName: bank.bankName,
        branchName: bank.branchName,
        ...(accountType ? { accountType } : {}),
        isDefault: true,
      });
    }

    const primaryBank = await financialsService.getPrimaryBankAccount(userId);
    return applyPrimaryBankDetails(
      organizerRepository.toPublic(profile, authUser),
      primaryBank
    );
  }

  async updateProfile(userId: string, body: OrganizerProfileBody) {
    const existing = await organizerRepository.findByUserId(userId);
    if (!existing) {
      throw new AppError(
        "Organizer profile not found. Create a profile first.",
        404,
        "PROFILE_NOT_FOUND"
      );
    }
    return this.createOrUpdateProfile(userId, body);
  }
}

export const organizerService = new OrganizerService();
