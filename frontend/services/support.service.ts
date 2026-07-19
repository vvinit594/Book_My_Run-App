import { Platform } from "react-native";
import { API_BASE_URL, API_ORIGIN } from "../constants/api";
import {
  SupportTicket,
  SupportTicketPriority,
} from "../types/financials";
import { ApiError, apiRequest, getAccessToken } from "./apiClient";

function mapError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function resolveUploadUrl(fileUrl: string): string {
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }
  return `${API_ORIGIN}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
}

export async function createSupportTicket(input: {
  type: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  eventName?: string;
}): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const ticket = await apiRequest<SupportTicket>(
      "/support/tickets",
      {
        method: "POST",
        body: JSON.stringify({
          type: input.type,
          subject: input.subject,
          description: input.description,
          priority: input.priority,
          eventName: input.eventName || undefined,
        }),
      },
      true
    );
    return { success: true, ticket };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to create support ticket"),
    };
  }
}

export async function listSupportTickets(): Promise<{
  success: boolean;
  tickets: SupportTicket[];
  error?: string;
}> {
  try {
    const tickets = await apiRequest<SupportTicket[]>(
      "/support/tickets",
      { method: "GET" },
      true
    );
    return { success: true, tickets };
  } catch (error) {
    return {
      success: false,
      tickets: [],
      error: mapError(error, "Failed to load support tickets"),
    };
  }
}

export async function getSupportTicket(
  id: string
): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const ticket = await apiRequest<SupportTicket>(
      `/support/tickets/${id}`,
      { method: "GET" },
      true
    );
    return { success: true, ticket };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to load ticket details"),
    };
  }
}

export async function uploadTicketAttachments(
  ticketId: string,
  assets: { uri: string; name: string; type: string }[]
): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    if (assets.length === 0) {
      return { success: true };
    }

    const token = await getAccessToken();
    const formData = new FormData();

    for (const asset of assets) {
      if (Platform.OS === "web") {
        const blobRes = await fetch(asset.uri);
        const blob = await blobRes.blob();
        formData.append("files", blob, asset.name);
      } else {
        formData.append("files", {
          uri: asset.uri,
          name: asset.name,
          type: asset.type,
        } as unknown as Blob);
      }
    }

    const response = await fetch(
      `${API_BASE_URL}/support/tickets/${ticketId}/attachments`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    );

    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new ApiError(
        payload.message || "Upload failed",
        response.status,
        payload.code
      );
    }

    return { success: true, ticket: payload.data as SupportTicket };
  } catch (error) {
    return {
      success: false,
      error: mapError(error, "Failed to upload attachments"),
    };
  }
}
