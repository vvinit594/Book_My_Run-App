import { OtpPurpose } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { isValidEmail, isValidPhone } from "../utils/indiaIds";
import { otpService } from "./otp/otp.service";

export class UserContactService {
  async requestEmailUpdate(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    const meta = await otpService.sendOtpForDestination({
      userId,
      email: user.email,
      purpose: OtpPurpose.EMAIL_UPDATE_CURRENT,
      channel: "email",
    });

    return {
      destination: user.email,
      ...meta,
    };
  }

  async verifyCurrentEmail(userId: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    await otpService.verifyOtpForDestination({
      userId,
      email: user.email,
      purpose: OtpPurpose.EMAIL_UPDATE_CURRENT,
      channel: "email",
      otp,
    });

    return { verified: true };
  }

  async sendNewEmailOtp(userId: string, newEmailRaw: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    await otpService.assertRecentVerified({
      userId,
      purpose: OtpPurpose.EMAIL_UPDATE_CURRENT,
      channel: "email",
      email: user.email,
    });

    const newEmail = newEmailRaw.trim().toLowerCase();
    if (!isValidEmail(newEmail)) {
      throw new AppError("Enter a valid email address", 400, "INVALID_EMAIL");
    }

    if (newEmail === user.email) {
      throw new AppError(
        "New email must be different from your current email",
        400,
        "EMAIL_UNCHANGED"
      );
    }

    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing) {
      throw new AppError(
        "An account with this email already exists",
        409,
        "EMAIL_EXISTS"
      );
    }

    const meta = await otpService.sendOtpForDestination({
      userId,
      email: newEmail,
      purpose: OtpPurpose.EMAIL_UPDATE_NEW,
      channel: "email",
    });

    return { destination: newEmail, ...meta };
  }

  async verifyNewEmail(userId: string, newEmailRaw: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    await otpService.assertRecentVerified({
      userId,
      purpose: OtpPurpose.EMAIL_UPDATE_CURRENT,
      channel: "email",
      email: user.email,
    });

    const newEmail = newEmailRaw.trim().toLowerCase();
    if (!isValidEmail(newEmail)) {
      throw new AppError("Enter a valid email address", 400, "INVALID_EMAIL");
    }

    await otpService.verifyOtpForDestination({
      userId,
      email: newEmail,
      purpose: OtpPurpose.EMAIL_UPDATE_NEW,
      channel: "email",
      otp,
    });

    const existing = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existing && existing.id !== userId) {
      throw new AppError(
        "An account with this email already exists",
        409,
        "EMAIL_EXISTS"
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
      },
    });

    return {
      user: {
        id: updated.id,
        name: updated.name ?? updated.email.split("@")[0],
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        avatar: updated.avatarUrl ?? undefined,
        isVerified: updated.isVerified,
      },
    };
  }

  async requestPhoneUpdate(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    const meta = await otpService.sendOtpForDestination({
      userId,
      phone: user.phone,
      purpose: OtpPurpose.PHONE_UPDATE_CURRENT,
      channel: "sms",
    });

    return {
      destination: user.phone,
      ...meta,
    };
  }

  async verifyCurrentPhone(userId: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    await otpService.verifyOtpForDestination({
      userId,
      phone: user.phone,
      purpose: OtpPurpose.PHONE_UPDATE_CURRENT,
      channel: "sms",
      otp,
    });

    return { verified: true };
  }

  async sendNewPhoneOtp(userId: string, newPhoneRaw: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    await otpService.assertRecentVerified({
      userId,
      purpose: OtpPurpose.PHONE_UPDATE_CURRENT,
      channel: "sms",
      phone: user.phone,
    });

    const newPhone = newPhoneRaw.replace(/\D/g, "").slice(-10);
    if (!isValidPhone(newPhone)) {
      throw new AppError(
        "Enter a valid 10-digit mobile number",
        400,
        "INVALID_PHONE"
      );
    }

    if (newPhone === user.phone) {
      throw new AppError(
        "New phone must be different from your current phone",
        400,
        "PHONE_UNCHANGED"
      );
    }

    const existing = await prisma.user.findUnique({ where: { phone: newPhone } });
    if (existing) {
      throw new AppError(
        "An account with this phone already exists",
        409,
        "PHONE_EXISTS"
      );
    }

    const meta = await otpService.sendOtpForDestination({
      userId,
      phone: newPhone,
      purpose: OtpPurpose.PHONE_UPDATE_NEW,
      channel: "sms",
    });

    return { destination: newPhone, ...meta };
  }

  async verifyNewPhone(userId: string, newPhoneRaw: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    await otpService.assertRecentVerified({
      userId,
      purpose: OtpPurpose.PHONE_UPDATE_CURRENT,
      channel: "sms",
      phone: user.phone,
    });

    const newPhone = newPhoneRaw.replace(/\D/g, "").slice(-10);
    if (!isValidPhone(newPhone)) {
      throw new AppError(
        "Enter a valid 10-digit mobile number",
        400,
        "INVALID_PHONE"
      );
    }

    await otpService.verifyOtpForDestination({
      userId,
      phone: newPhone,
      purpose: OtpPurpose.PHONE_UPDATE_NEW,
      channel: "sms",
      otp,
    });

    const existing = await prisma.user.findUnique({ where: { phone: newPhone } });
    if (existing && existing.id !== userId) {
      throw new AppError(
        "An account with this phone already exists",
        409,
        "PHONE_EXISTS"
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { phone: newPhone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
      },
    });

    return {
      user: {
        id: updated.id,
        name: updated.name ?? updated.email.split("@")[0],
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        avatar: updated.avatarUrl ?? undefined,
        isVerified: updated.isVerified,
      },
    };
  }
}

export const userContactService = new UserContactService();
