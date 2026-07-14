import { User, UserRole } from "@prisma/client";
import prisma from "../config/prisma";

export type UserWithOrganizer = User & {
  organizerProfile: {
    id: string;
    isProfileCompleted: boolean;
    organizerName: string;
    completedAt: Date | null;
  } | null;
};

const organizerSelect = {
  id: true,
  isProfileCompleted: true,
  organizerName: true,
  completedAt: true,
} as const;

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findByPhone(phone: string) {
    return prisma.user.findUnique({ where: { phone } });
  }

  findByEmailOrPhone(email: string, phone: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { organizerProfile: { select: organizerSelect } },
    });
  }

  findByIdentifier(identifier: string) {
    const normalized = identifier.trim().toLowerCase();
    const digits = identifier.replace(/\D/g, "").slice(-10);

    return prisma.user.findFirst({
      where: {
        OR: [
          { email: normalized },
          ...(digits.length === 10 ? [{ phone: digits }] : []),
        ],
      },
      include: { organizerProfile: { select: organizerSelect } },
    });
  }

  createUser(data: {
    email: string;
    phone: string;
    passwordHash: string;
    name?: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        name: data.name,
        isVerified: true,
        role: UserRole.USER,
      },
      include: { organizerProfile: { select: organizerSelect } },
    });
  }
}

export const userRepository = new UserRepository();
