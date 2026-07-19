import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  ProfileDropdown,
  ProfileInput,
  ProfileTextArea,
  PrimaryButton,
} from "../../components/organizer/profile";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";
import * as supportService from "../../services/support.service";
import {
  SUPPORT_PRIORITIES,
  SUPPORT_STATUS_LABELS,
  SUPPORT_TICKET_TYPES,
  SupportTicket,
  SupportTicketPriority,
} from "../../types/financials";

type LocalAsset = {
  uri: string;
  name: string;
  type: string;
};

export default function SupportScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [type, setType] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<SupportTicketPriority | "">("medium");
  const [eventName, setEventName] = useState("");
  const [assets, setAssets] = useState<LocalAsset[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadTickets = useCallback(async () => {
    const result = await supportService.listSupportTickets();
    if (result.success) setTickets(result.tickets);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadTickets();
    }, [loadTickets])
  );

  const pickImages = async () => {
    if (assets.length >= 5) {
      Alert.alert("Limit reached", "You can upload a maximum of 5 images.");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo library access to upload screenshots.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - assets.length,
    });

    if (result.canceled) return;

    const next = result.assets.map((asset, index) => ({
      uri: asset.uri,
      name: asset.fileName || `screenshot-${Date.now()}-${index}.jpg`,
      type: asset.mimeType || "image/jpeg",
    }));

    setAssets((prev) => [...prev, ...next].slice(0, 5));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!type) next.type = "Ticket type is required";
    if (!subject.trim()) next.subject = "Subject is required";
    if (!description.trim()) next.description = "Description is required";
    if (!priority) next.priority = "Priority is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setType("");
    setSubject("");
    setDescription("");
    setPriority("medium");
    setEventName("");
    setAssets([]);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const created = await supportService.createSupportTicket({
        type,
        subject: subject.trim(),
        description: description.trim(),
        priority: priority as SupportTicketPriority,
        eventName: eventName.trim() || undefined,
      });

      if (!created.success || !created.ticket) {
        throw new Error(created.error || "Failed to create ticket");
      }

      if (assets.length > 0) {
        const upload = await supportService.uploadTicketAttachments(
          created.ticket.id,
          assets
        );
        if (!upload.success) {
          Alert.alert(
            "Ticket Created",
            `${created.ticket.ticketNumber} was created, but attachments failed: ${upload.error}`
          );
          resetForm();
          await loadTickets();
          return;
        }
      }

      Alert.alert(
        "Ticket Submitted",
        `Your ticket ${created.ticket.ticketNumber} has been submitted.`
      );
      resetForm();
      await loadTickets();
      setShowHistory(true);
    } catch (error) {
      Alert.alert(
        "Submit Failed",
        error instanceof Error ? error.message : "Unable to submit ticket"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Raise a Support Ticket</Text>
        <TouchableOpacity
          onPress={() => setShowHistory((v) => !v)}
          style={styles.historyBtn}
          hitSlop={8}
        >
          <Ionicons
            name={showHistory ? "create-outline" : "list-outline"}
            size={22}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          isWide ? styles.contentWide : null,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {showHistory ? (
          <View>
            <Text style={styles.sectionTitle}>Your Tickets</Text>
            {tickets.length === 0 ? (
              <Text style={styles.muted}>No tickets submitted yet.</Text>
            ) : (
              tickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketCard}>
                  <View style={styles.ticketTop}>
                    <Text style={styles.ticketNumber}>{ticket.ticketNumber}</Text>
                    <Text style={styles.ticketStatus}>
                      {SUPPORT_STATUS_LABELS[ticket.status]}
                    </Text>
                  </View>
                  <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                  <Text style={styles.ticketMeta}>
                    {ticket.type} · {ticket.priority}
                    {ticket.eventName ? ` · ${ticket.eventName}` : ""}
                  </Text>
                  {ticket.attachments.length > 0 ? (
                    <Text style={styles.ticketMeta}>
                      {ticket.attachments.length} attachment
                      {ticket.attachments.length > 1 ? "s" : ""}
                    </Text>
                  ) : null}
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.form}>
            <ProfileDropdown
              label="Type"
              required
              value={type}
              options={[...SUPPORT_TICKET_TYPES]}
              onSelect={setType}
              placeholder="Select"
              error={errors.type}
            />

            <ProfileInput
              label="Subject"
              required
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief summary of your issue"
              error={errors.subject}
            />

            <ProfileDropdown
              label="Priority"
              required
              value={priority}
              options={[...SUPPORT_PRIORITIES]}
              onSelect={(value) => setPriority(value)}
              error={errors.priority}
            />

            <ProfileInput
              label="Event (optional)"
              value={eventName}
              onChangeText={setEventName}
              placeholder="Related event name"
            />

            <ProfileTextArea
              label="Query"
              required
              value={description}
              onChangeText={setDescription}
              placeholder="Enter your query or issue"
              error={errors.description}
            />

            <Text style={styles.uploadLabel}>
              Upload Picture or Screenshot (Max 5):
            </Text>
            <TouchableOpacity
              style={styles.dropzone}
              onPress={pickImages}
              activeOpacity={0.85}
            >
              <Ionicons name="cloud-upload-outline" size={28} color={Colors.textSecondary} />
              <Text style={styles.dropzoneText}>
                Drop files here or click to upload.
              </Text>
            </TouchableOpacity>

            {assets.length > 0 ? (
              <View style={styles.previewRow}>
                {assets.map((asset) => (
                  <View key={asset.uri} style={styles.previewItem}>
                    <Image source={{ uri: asset.uri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removePreview}
                      onPress={() =>
                        setAssets((prev) => prev.filter((item) => item.uri !== asset.uri))
                      }
                    >
                      <Ionicons name="close-circle" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : null}

            <PrimaryButton
              title="Submit Ticket"
              onPress={handleSubmit}
              loading={submitting}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  historyBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  contentWide: {
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  form: {
    gap: Spacing.md,
  },
  uploadLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  dropzone: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    marginBottom: Spacing.md,
  },
  dropzoneText: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
  },
  previewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  previewItem: {
    width: 72,
    height: 72,
  },
  previewImage: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.border,
  },
  removePreview: {
    position: "absolute",
    top: -6,
    right: -6,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  muted: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  ticketCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.cardBackground,
  },
  ticketTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  ticketNumber: {
    fontWeight: "700",
    color: Colors.primary,
    fontSize: FontSize.sm,
  },
  ticketStatus: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  ticketSubject: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  ticketMeta: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    textTransform: "capitalize",
  },
});
