import { OrganizerProfile } from "../types/organizer";
import { ApiError, apiRequest } from "./apiClient";

type OrganizerProfileApiResponse = {
  isProfileCompleted: boolean;
  profile: (OrganizerProfile & { logoUrl?: string | null }) | null;
};

function mapError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function toApiPayload(profile: OrganizerProfile) {
  return {
    logoUri: profile.logoUri,
    organizerName: profile.organizerName,
    aboutOrganizer: profile.aboutOrganizer,
    websiteUrl: profile.websiteUrl,
    organizationType: profile.organizationType || undefined,
    panNumber: profile.panNumber,
    aadhaarNumber: profile.aadhaarNumber,
    permanentAddress: profile.permanentAddress,
    billingAddressSameAsPermanent: profile.billingAddressSameAsPermanent,
    billingAddress: profile.billingAddress,
    primaryUserName: profile.primaryUserName,
    // primaryEmail / primaryPhone live on User — do not duplicate into OrganizerProfile
    backupPhone: profile.backupPhone,
    supportEmail: profile.supportEmail,
    emailNotificationForRegistration: profile.emailNotificationForRegistration,
    gstStatus: profile.gstStatus || undefined,
    gstNumber: profile.gstNumber,
    bankDetails: {
      accountHolderName: profile.bankDetails.accountHolderName,
      accountNumber: profile.bankDetails.accountNumber,
      ifscCode: profile.bankDetails.ifscCode,
      bankName: profile.bankDetails.bankName,
      branchName: profile.bankDetails.branchName,
      accountType: profile.bankDetails.accountType || undefined,
    },
    socialMedia: profile.socialMedia,
    completed: true,
  };
}

function fromApiProfile(
  profile: NonNullable<OrganizerProfileApiResponse["profile"]>
): OrganizerProfile {
  return {
    logoUri: profile.logoUri ?? profile.logoUrl ?? null,
    organizerName: profile.organizerName ?? "",
    aboutOrganizer: profile.aboutOrganizer ?? "",
    websiteUrl: profile.websiteUrl ?? "",
    organizationType: profile.organizationType || "",
    panNumber: profile.panNumber ?? "",
    aadhaarNumber: profile.aadhaarNumber ?? "",
    permanentAddress: profile.permanentAddress ?? "",
    billingAddressSameAsPermanent: profile.billingAddressSameAsPermanent ?? true,
    billingAddress: profile.billingAddress ?? "",
    primaryUserName: profile.primaryUserName ?? "",
    primaryEmail: profile.primaryEmail ?? "",
    primaryPhone: profile.primaryPhone ?? "",
    backupPhone: profile.backupPhone ?? "",
    supportEmail: profile.supportEmail ?? "",
    emailNotificationForRegistration:
      profile.emailNotificationForRegistration ?? true,
    gstStatus: profile.gstStatus || "",
    gstNumber: profile.gstNumber ?? "",
    bankDetails: {
      accountHolderName: profile.bankDetails?.accountHolderName ?? "",
      accountNumber: profile.bankDetails?.accountNumber ?? "",
      confirmAccountNumber: profile.bankDetails?.accountNumber ?? "",
      ifscCode: profile.bankDetails?.ifscCode ?? "",
      bankName: profile.bankDetails?.bankName ?? "",
      branchName: profile.bankDetails?.branchName ?? "",
      accountType: (profile.bankDetails?.accountType as "" | "savings" | "current") || "",
    },
    socialMedia: {
      instagram: profile.socialMedia?.instagram ?? "",
      facebook: profile.socialMedia?.facebook ?? "",
      twitter: profile.socialMedia?.twitter ?? "",
      linkedin: profile.socialMedia?.linkedin ?? "",
      youtube: profile.socialMedia?.youtube ?? "",
    },
    completed: Boolean(
      (profile as { isProfileCompleted?: boolean }).isProfileCompleted ??
        profile.completed
    ),
    completedAt: profile.completedAt,
  };
}

export async function getOrganizerProfile(): Promise<{
  success: boolean;
  isProfileCompleted: boolean;
  profile: OrganizerProfile | null;
  error?: string;
}> {
  try {
    const data = await apiRequest<OrganizerProfileApiResponse>(
      "/organizer/profile",
      { method: "GET" },
      true
    );
    return {
      success: true,
      isProfileCompleted: data.isProfileCompleted,
      profile: data.profile ? fromApiProfile(data.profile) : null,
    };
  } catch (error) {
    return {
      success: false,
      isProfileCompleted: false,
      profile: null,
      error: mapError(error, "Failed to load organizer profile"),
    };
  }
}

export async function saveOrganizerProfile(
  profile: OrganizerProfile
): Promise<{ success: boolean; profile?: OrganizerProfile; error?: string }> {
  try {
    const data = await apiRequest<
      OrganizerProfile & { logoUrl?: string | null; isProfileCompleted?: boolean }
    >(
      "/organizer/profile",
      {
        method: "POST",
        body: JSON.stringify(toApiPayload(profile)),
      },
      true
    );
    return {
      success: true,
      profile: fromApiProfile(data as NonNullable<OrganizerProfileApiResponse["profile"]>),
    };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to save organizer profile"),
    };
  }
}

export async function updateOrganizerProfile(
  profile: OrganizerProfile
): Promise<{ success: boolean; profile?: OrganizerProfile; error?: string }> {
  try {
    const data = await apiRequest<
      OrganizerProfile & { logoUrl?: string | null; isProfileCompleted?: boolean }
    >(
      "/organizer/profile",
      {
        method: "PUT",
        body: JSON.stringify(toApiPayload(profile)),
      },
      true
    );
    return {
      success: true,
      profile: fromApiProfile(data as NonNullable<OrganizerProfileApiResponse["profile"]>),
    };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to update organizer profile"),
    };
  }
}
