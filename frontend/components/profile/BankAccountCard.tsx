import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";
import { BankAccount } from "../../types/financials";

interface BankAccountCardProps {
  account: BankAccount;
  onLinkEvent: (account: BankAccount) => void;
  onEdit: (account: BankAccount) => void;
  onDelete: (account: BankAccount) => void;
  onSetDefault: (account: BankAccount) => void;
}

export default function BankAccountCard({
  account,
  onLinkEvent,
  onEdit,
  onDelete,
  onSetDefault,
}: BankAccountCardProps) {
  const canDelete = account.linkedEvents.length === 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.bankInfo}>
          <View style={styles.iconWrap}>
            <Ionicons name="business" size={20} color={Colors.primary} />
          </View>
          <View style={styles.bankText}>
            <View style={styles.nameRow}>
              <Text style={styles.bankName} numberOfLines={1}>
                {account.bankName}
              </Text>
              {account.isDefault ? (
                <View style={styles.defaultBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.holderName} numberOfLines={1}>
              {account.accountHolderName}
            </Text>
            <Text style={styles.accountNumber}>
              {account.maskedAccountNumber}
            </Text>
            {account.ifscCode ? (
              <Text style={styles.meta}>IFSC {account.ifscCode}</Text>
            ) : null}
            {account.verificationStatus ? (
              <Text style={styles.meta}>
                Verification: {account.verificationStatus}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => onLinkEvent(account)}
          activeOpacity={0.85}
        >
          <Text style={styles.linkBtnText}>+ LINK EVENT</Text>
        </TouchableOpacity>
      </View>

      {account.linkedEvents.length > 0 ? (
        <View style={styles.tags}>
          {account.linkedEvents.map((event) => (
            <View key={event.id} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>
                {event.eventName.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyEvents}>No events linked yet</Text>
      )}

      <View style={styles.actions}>
        {!account.isDefault ? (
          <TouchableOpacity onPress={() => onSetDefault(account)}>
            <Text style={styles.actionText}>Set Default</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={() => onEdit(account)}>
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!canDelete) {
                Alert.alert(
                  "Cannot Delete",
                  "Unlink all events before deleting this bank account."
                );
                return;
              }
              onDelete(account);
            }}
          >
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  bankInfo: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    minWidth: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: "#FFE8EE",
    alignItems: "center",
    justifyContent: "center",
  },
  bankText: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  bankName: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  defaultText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.success,
  },
  holderName: {
    marginTop: 2,
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  accountNumber: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  meta: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textTransform: "capitalize",
  },
  linkBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  linkBtnText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: "700",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  tag: {
    backgroundColor: "#FFE8EE",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    maxWidth: "100%",
  },
  tagText: {
    color: Colors.primaryDark,
    fontSize: FontSize.xs,
    fontWeight: "700",
  },
  emptyEvents: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  actions: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightActions: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  actionText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  deleteText: {
    color: Colors.error,
  },
});
