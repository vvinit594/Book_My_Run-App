import prisma from "../config/prisma";
import { UserWithOrganizer, userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { comparePassword, hashPassword } from "../utils/password";
import { signAccessToken } from "../utils/jwt";
import { otpService } from "./otp/otp.service";

function toPublicUser(user: UserWithOrganizer) {
  return {
    id: user.id,
    name: user.name ?? user.email.split("@")[0],
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatarUrl ?? undefined,
    isVerified: user.isVerified,
    organizerProfile: user.organizerProfile
      ? {
          id: user.organizerProfile.id,
          organizerName: user.organizerProfile.organizerName,
          isProfileCompleted: user.organizerProfile.isProfileCompleted,
          completedAt: user.organizerProfile.completedAt,
        }
      : {
          isProfileCompleted: false,
        },
  };
}

export class AuthService {
  async signup(input: { email: string; phone: string }) {
    const email = input.email.trim().toLowerCase();
    const phone = input.phone.replace(/\D/g, "").slice(-10);

    const existing = await userRepository.findByEmailOrPhone(email, phone);
    if (existing?.passwordHash && existing.isVerified) {
      throw new AppError(
        "An account with this email or mobile already exists. Please login.",
        409,
        "USER_EXISTS"
      );
    }

    const otpMeta = await otpService.sendSignupOtps({ email, phone });
    return otpMeta;
  }

  async verifyOtp(input: {
    email: string;
    phone: string;
    emailOtp: string;
    mobileOtp: string;
  }) {
    const email = input.email.trim().toLowerCase();
    const phone = input.phone.replace(/\D/g, "").slice(-10);

    await otpService.verifySignupOtps({
      email,
      phone,
      emailOtp: input.emailOtp.trim(),
      mobileOtp: input.mobileOtp.trim(),
    });

    return { verified: true, email, phone };
  }

  async createPassword(input: {
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) {
    const email = input.email.trim().toLowerCase();
    const phone = input.phone.replace(/\D/g, "").slice(-10);

    if (input.password !== input.confirmPassword) {
      throw new AppError("Passwords do not match", 400, "PASSWORD_MISMATCH");
    }

    await otpService.assertSignupOtpsVerified(email, phone);

    const existing = await userRepository.findByEmailOrPhone(email, phone);
    if (existing?.passwordHash && existing.isVerified) {
      throw new AppError(
        "An account with this email or mobile already exists. Please login.",
        409,
        "USER_EXISTS"
      );
    }

    const passwordHash = await hashPassword(input.password);
    const name = email.split("@")[0];

    let user: UserWithOrganizer;
    if (existing) {
      user = await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          isVerified: true,
          name: existing.name ?? name,
          email,
          phone,
        },
        include: {
          organizerProfile: {
            select: {
              id: true,
              isProfileCompleted: true,
              organizerName: true,
              completedAt: true,
            },
          },
        },
      });
    } else {
      user = await userRepository.createUser({
        email,
        phone,
        passwordHash,
        name,
      });
    }

    const token = signAccessToken({ userId: user.id, role: user.role });
    return {
      token,
      user: toPublicUser(user),
    };
  }

  async login(input: { identifier: string; password: string }) {
    const user = await userRepository.findByIdentifier(input.identifier);
    if (!user || !user.passwordHash) {
      throw new AppError("Invalid email/mobile or password", 401, "INVALID_CREDENTIALS");
    }

    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) {
      throw new AppError("Invalid email/mobile or password", 401, "INVALID_CREDENTIALS");
    }

    if (!user.isVerified) {
      throw new AppError("Please complete signup verification", 403, "NOT_VERIFIED");
    }

    const token = signAccessToken({ userId: user.id, role: user.role });
    return {
      token,
      user: toPublicUser(user),
    };
  }

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    return toPublicUser(user);
  }

  async logout() {
    // Stateless JWT — client discards token. Hook for refresh-token revoke later.
    return { loggedOut: true };
  }
}

export const authService = new AuthService();
