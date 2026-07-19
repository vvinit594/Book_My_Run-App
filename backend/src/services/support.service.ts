import { Prisma, SupportTicketPriority, SupportTicketStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { formatTicketNumber } from "../utils/ticketNumber";

export type CreateTicketInput = {
  type: string;
  subject: string;
  description: string;
  priority?: SupportTicketPriority;
  eventName?: string;
};

type UploadedFile = {
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  size?: number;
};

type TicketWithAttachments = Prisma.SupportTicketGetPayload<{
  include: { attachments: true };
}>;

function mapTicket(ticket: TicketWithAttachments) {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    type: ticket.type,
    subject: ticket.subject,
    description: ticket.description,
    priority: ticket.priority,
    eventName: ticket.eventName,
    status: ticket.status,
    attachments: ticket.attachments.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      mimeType: file.mimeType,
      size: file.size,
      createdAt: file.createdAt,
    })),
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

async function nextTicketNumber(): Promise<string> {
  const counter = await prisma.$transaction(async (tx) => {
    const existing = await tx.supportTicketCounter.findUnique({
      where: { id: 1 },
    });
    if (!existing) {
      return tx.supportTicketCounter.create({
        data: { id: 1, lastNumber: 1 },
      });
    }
    return tx.supportTicketCounter.update({
      where: { id: 1 },
      data: { lastNumber: { increment: 1 } },
    });
  });

  return formatTicketNumber(counter.lastNumber);
}

async function getOwnedTicket(userId: string, ticketId: string) {
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: ticketId, userId },
    include: { attachments: { orderBy: { createdAt: "asc" } } },
  });
  if (!ticket) {
    throw new AppError("Support ticket not found", 404, "TICKET_NOT_FOUND");
  }
  return ticket;
}

export const supportService = {
  async createTicket(userId: string, input: CreateTicketInput) {
    const ticketNumber = await nextTicketNumber();
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        type: input.type.trim(),
        subject: input.subject.trim(),
        description: input.description.trim(),
        priority: input.priority || SupportTicketPriority.medium,
        eventName: input.eventName?.trim() || null,
        status: SupportTicketStatus.open,
      },
      include: { attachments: true },
    });
    return mapTicket(ticket);
  },

  async listTickets(userId: string) {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      include: { attachments: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return tickets.map(mapTicket);
  },

  async getTicket(userId: string, ticketId: string) {
    return mapTicket(await getOwnedTicket(userId, ticketId));
  },

  async addAttachments(
    userId: string,
    ticketId: string,
    files: UploadedFile[]
  ) {
    const ticket = await getOwnedTicket(userId, ticketId);
    if (ticket.attachments.length + files.length > 5) {
      throw new AppError(
        "Maximum 5 attachments allowed per ticket",
        400,
        "ATTACHMENT_LIMIT"
      );
    }

    await prisma.supportTicketAttachment.createMany({
      data: files.map((file) => ({
        ticketId,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        mimeType: file.mimeType || null,
        size: file.size ?? null,
      })),
    });

    return mapTicket(await getOwnedTicket(userId, ticketId));
  },
};
