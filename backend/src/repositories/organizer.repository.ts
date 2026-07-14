import {
  BankAccountType,
  GstStatus,
  OrganizationType,
  OrganizerProfile,
  Prisma,
  UserRole,
} from "@prisma/client";
import prisma from "../config/prisma";

export type OrganizerProfileInput = {
  logoUrl?: string | null;
  organizerName: string;
  aboutOrganizer?: string | null;
  websiteUrl?: string | null;
  organizationType?: OrganizationType | null;
  panNumber?: string | null;
  permanentAddress?: string | null;
  billingAddressSameAsPermanent?: boolean;
  billingAddress?: string | null;
  primaryUserName?: string | null;
  backupPhone?: string | null;
  supportEmail?: string | null;
  emailNotificationForRegistration?: boolean;
  gstStatus?: GstStatus | null;
  gstNumber?: string | null;
  bankAccountHolderName?: string | null;
  bankAccountNumber?: string | null;
  bankIfscCode?: string | null;
  bankName?: string | null;
  bankBranchName?: string | null;
  bankAccountType?: BankAccountType | null;
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  isProfileCompleted?: boolean;
};

export class OrganizerRepository {
  findByUserId(userId: string) {
    return prisma.organizerProfile.findUnique({ where: { userId } });
  }

  async upsertProfile(userId: string, data: OrganizerProfileInput) {
    const completed = data.isProfileCompleted ?? true;
    const payload: Prisma.OrganizerProfileUncheckedCreateInput = {
      userId,
      logoUrl: data.logoUrl ?? null,
      organizerName: data.organizerName,
      aboutOrganizer: data.aboutOrganizer ?? null,
      websiteUrl: data.websiteUrl ?? null,
      organizationType: data.organizationType ?? null,
      panNumber: data.panNumber ?? null,
      permanentAddress: data.permanentAddress ?? null,
      billingAddressSameAsPermanent: data.billingAddressSameAsPermanent ?? true,
      billingAddress: data.billingAddress ?? null,
      primaryUserName: data.primaryUserName ?? null,
      // Auth contact lives on User — never duplicate into OrganizerProfile
      primaryEmail: null,
      primaryPhone: null,
      backupPhone: data.backupPhone ?? null,
      supportEmail: data.supportEmail ?? null,
      emailNotificationForRegistration:
        data.emailNotificationForRegistration ?? true,
      gstStatus: data.gstStatus ?? null,
      gstNumber: data.gstNumber ?? null,
      bankAccountHolderName: data.bankAccountHolderName ?? null,
      bankAccountNumber: data.bankAccountNumber ?? null,
      bankIfscCode: data.bankIfscCode ?? null,
      bankName: data.bankName ?? null,
      bankBranchName: data.bankBranchName ?? null,
      bankAccountType: data.bankAccountType ?? null,
      instagram: data.instagram ?? null,
      facebook: data.facebook ?? null,
      twitter: data.twitter ?? null,
      linkedin: data.linkedin ?? null,
      youtube: data.youtube ?? null,
      isProfileCompleted: completed,
      completedAt: completed ? new Date() : null,
    };

    const { userId: _userId, ...updateData } = payload;

    const profile = await prisma.$transaction(async (tx) => {
      const saved = await tx.organizerProfile.upsert({
        where: { userId },
        create: payload,
        update: updateData,
      });

      if (completed) {
        await tx.user.update({
          where: { id: userId },
          data: { role: UserRole.ORGANIZER },
        });
      }

      return saved;
    });

    return profile;
  }

  toPublic(
    profile: OrganizerProfile,
    authUser?: { email: string; phone: string } | null
  ) {
    return {
      id: profile.id,
      logoUrl: profile.logoUrl,
      organizerName: profile.organizerName,
      aboutOrganizer: profile.aboutOrganizer,
      websiteUrl: profile.websiteUrl,
      organizationType: profile.organizationType,
      panNumber: profile.panNumber,
      permanentAddress: profile.permanentAddress,
      billingAddressSameAsPermanent: profile.billingAddressSameAsPermanent,
      billingAddress: profile.billingAddress,
      primaryUserName: profile.primaryUserName,
      // Always surface verified auth contact from User
      primaryEmail: authUser?.email ?? null,
      primaryPhone: authUser?.phone ?? null,
      primaryEmailVerified: Boolean(authUser?.email),
      primaryPhoneVerified: Boolean(authUser?.phone),
      backupPhone: profile.backupPhone,
      supportEmail: profile.supportEmail,
      emailNotificationForRegistration:
        profile.emailNotificationForRegistration,
      gstStatus: profile.gstStatus,
      gstNumber: profile.gstNumber,
      bankDetails: {
        accountHolderName: profile.bankAccountHolderName ?? "",
        accountNumber: profile.bankAccountNumber ?? "",
        ifscCode: profile.bankIfscCode ?? "",
        bankName: profile.bankName ?? "",
        branchName: profile.bankBranchName ?? "",
        accountType: profile.bankAccountType ?? "",
      },
      socialMedia: {
        instagram: profile.instagram ?? "",
        facebook: profile.facebook ?? "",
        twitter: profile.twitter ?? "",
        linkedin: profile.linkedin ?? "",
        youtube: profile.youtube ?? "",
      },
      isProfileCompleted: profile.isProfileCompleted,
      completedAt: profile.completedAt,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}

export const organizerRepository = new OrganizerRepository();
