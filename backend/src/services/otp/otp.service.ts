import { OtpPurpose } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { getOtpProvider } from "./otpProvider";

const OTP_TTL_MINUTES = 10;

export class OtpService {
  async sendSignupOtps(input: { email: string; phone: string }) {
    const provider = getOtpProvider();

    await prisma.otpVerification.updateMany({
      where: {
        purpose: OtpPurpose.SIGNUP,
        isVerified: false,
        OR: [{ email: input.email }, { phone: input.phone }],
      },
      data: { expiresAt: new Date() },
    });

    const emailResult = await provider.sendOtp({
      channel: "email",
      destination: input.email,
      purpose: OtpPurpose.SIGNUP,
    });

    const phoneResult = await provider.sendOtp({
      channel: "sms",
      destination: input.phone,
      purpose: OtpPurpose.SIGNUP,
    });

    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await prisma.otpVerification.createMany({
      data: [
        {
          email: input.email,
          phone: input.phone,
          otpCode: emailResult.otpCode,
          purpose: OtpPurpose.SIGNUP,
          channel: "email",
          expiresAt,
        },
        {
          email: input.email,
          phone: input.phone,
          otpCode: phoneResult.otpCode,
          purpose: OtpPurpose.SIGNUP,
          channel: "sms",
          expiresAt,
        },
      ],
    });

    return {
      email: input.email,
      phone: input.phone,
      expiresInMinutes: OTP_TTL_MINUTES,
    };
  }

  async verifySignupOtps(input: {
    email: string;
    phone: string;
    emailOtp: string;
    mobileOtp: string;
  }) {
    const now = new Date();

    const emailRecord = await prisma.otpVerification.findFirst({
      where: {
        email: input.email,
        phone: input.phone,
        purpose: OtpPurpose.SIGNUP,
        channel: "email",
        isVerified: false,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    const smsRecord = await prisma.otpVerification.findFirst({
      where: {
        email: input.email,
        phone: input.phone,
        purpose: OtpPurpose.SIGNUP,
        channel: "sms",
        isVerified: false,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!emailRecord || !smsRecord) {
      throw new AppError(
        "OTP expired or not found. Please request a new OTP.",
        400,
        "OTP_NOT_FOUND"
      );
    }

    if (
      emailRecord.otpCode !== input.emailOtp ||
      smsRecord.otpCode !== input.mobileOtp
    ) {
      throw new AppError("Invalid OTP", 400, "INVALID_OTP");
    }

    await prisma.otpVerification.updateMany({
      where: {
        id: { in: [emailRecord.id, smsRecord.id] },
      },
      data: { isVerified: true },
    });

    return { verified: true };
  }

  async assertSignupOtpsVerified(email: string, phone: string) {
    const emailRecord = await prisma.otpVerification.findFirst({
      where: {
        email,
        phone,
        purpose: OtpPurpose.SIGNUP,
        channel: "email",
        isVerified: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const smsRecord = await prisma.otpVerification.findFirst({
      where: {
        email,
        phone,
        purpose: OtpPurpose.SIGNUP,
        channel: "sms",
        isVerified: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!emailRecord || !smsRecord) {
      throw new AppError(
        "OTP verification required before creating a password",
        400,
        "OTP_NOT_VERIFIED"
      );
    }

    const verifiedAt = Math.max(
      emailRecord.createdAt.getTime(),
      smsRecord.createdAt.getTime()
    );
    const maxAgeMs = 30 * 60 * 1000;
    if (Date.now() - verifiedAt > maxAgeMs) {
      throw new AppError(
        "OTP verification expired. Please signup again.",
        400,
        "OTP_VERIFICATION_EXPIRED"
      );
    }
  }
}

export const otpService = new OtpService();
