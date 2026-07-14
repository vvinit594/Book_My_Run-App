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

export type OrganizerProfileBody = {
  logoUri?: string | null;
  logoUrl?: string | null;
  organizerName: string;
  aboutOrganizer?: string;
  websiteUrl?: string;
  organizationType?: string;
  panNumber?: string;
  permanentAddress?: string;
  billingAddressSameAsPermanent?: boolean;
  billingAddress?: string;
  primaryUserName?: string;
  /** Ignored — contact comes from authenticated User */
  primaryEmail?: string;
  /** Ignored — contact comes from authenticated User */
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

  return {
    logoUrl: body.logoUrl ?? body.logoUri ?? null,
    organizerName: body.organizerName.trim(),
    aboutOrganizer: body.aboutOrganizer?.trim() || null,
    websiteUrl: body.websiteUrl?.trim() || null,
    organizationType,
    panNumber: body.panNumber?.trim().toUpperCase() || null,
    permanentAddress: body.permanentAddress?.trim() || null,
    billingAddressSameAsPermanent: body.billingAddressSameAsPermanent ?? true,
    billingAddress: body.billingAddress?.trim() || null,
    primaryUserName: body.primaryUserName?.trim() || null,
    backupPhone: body.backupPhone?.replace(/\D/g, "").slice(-10) || null,
    supportEmail: body.supportEmail?.trim().toLowerCase() || null,
    emailNotificationForRegistration:
      body.emailNotificationForRegistration ?? true,
    gstStatus,
    gstNumber: body.gstNumber?.trim().toUpperCase() || null,
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

    return {
      isProfileCompleted: profile.isProfileCompleted,
      profile: organizerRepository.toPublic(profile, authUser),
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
    return organizerRepository.toPublic(profile, authUser);
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
