import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BankAccountCard from "../../components/profile/BankAccountCard";
import LinkEventModal from "../../components/profile/LinkEventModal";
import { BankDetailsModal } from "../../components/organizer/profile";
import Colors from "../../constants/colors";
import { BorderRadius, FontSize, Spacing } from "../../constants/spacing";
import * as financialsService from "../../services/financials.service";
import { BankAccount } from "../../types/financials";
import { BankDetails, EMPTY_BANK_DETAILS } from "../../types/organizer";

type ModalMode = "add" | "edit";

export default function FinancialsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [linkTarget, setLinkTarget] = useState<BankAccount | null>(null);
  const [linking, setLinking] = useState(false);

  const loadAccounts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const result = await financialsService.getBankAccounts();
    if (result.success) {
      setAccounts(result.accounts);
    } else {
      Alert.alert("Error", result.error || "Failed to load bank accounts");
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAccounts();
    }, [loadAccounts])
  );

  const openAdd = () => {
    setModalMode("add");
    setEditingAccount(null);
    setBankModalVisible(true);
  };

  const openEdit = (account: BankAccount) => {
    setModalMode("edit");
    setEditingAccount(account);
    setBankModalVisible(true);
  };

  const handleBankSave = async (details: BankDetails) => {
    const result =
      modalMode === "edit" && editingAccount
        ? await financialsService.updateBankAccount(editingAccount.id, details)
        : await financialsService.addBankAccount(details);

    if (!result.success) {
      Alert.alert("Error", result.error || "Unable to save bank account");
      return;
    }

    setBankModalVisible(false);
    setEditingAccount(null);
    await loadAccounts(true);
  };

  const handleDelete = (account: BankAccount) => {
    Alert.alert(
      "Delete Bank Account",
      `Remove ${account.bankName} ending in ${account.maskedAccountNumber.slice(-4)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void (async () => {
              const result = await financialsService.deleteBankAccount(account.id);
              if (!result.success) {
                Alert.alert("Error", result.error || "Delete failed");
                return;
              }
              await loadAccounts(true);
            })();
          },
        },
      ]
    );
  };

  const handleSetDefault = async (account: BankAccount) => {
    const result = await financialsService.setDefaultBank(account.id);
    if (!result.success) {
      Alert.alert("Error", result.error || "Failed to set default");
      return;
    }
    await loadAccounts(true);
  };

  const handleLinkEvent = async (eventName: string) => {
    if (!linkTarget) return;
    setLinking(true);
    const result = await financialsService.linkEventToBank(
      linkTarget.id,
      eventName
    );
    setLinking(false);
    if (!result.success) {
      Alert.alert("Error", result.error || "Failed to link event");
      return;
    }
    setLinkTarget(null);
    await loadAccounts(true);
  };

  const bankInitialValues: BankDetails = editingAccount
    ? {
        accountHolderName: editingAccount.accountHolderName,
        accountNumber: editingAccount.accountNumber,
        confirmAccountNumber: editingAccount.accountNumber,
        ifscCode: editingAccount.ifscCode,
        bankName: editingAccount.bankName,
        branchName: editingAccount.branchName || "",
        accountType: editingAccount.accountType || "",
      }
    : { ...EMPTY_BANK_DETAILS };

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
        <Text style={styles.headerTitle}>Financials</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.body, isWide ? styles.bodyWide : null]}>
        {isWide ? (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarActive}>Manage Account</Text>
            <Text style={styles.sidebarItem}>Payouts</Text>
            <Text style={styles.sidebarItem}>Transactions</Text>
            <Text style={styles.sidebarItem}>Invoices</Text>
          </View>
        ) : null}

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void loadAccounts(true);
              }}
              tintColor={Colors.primary}
            />
          }
        >
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Bank Accounts with Associated Events</Text>
            <TouchableOpacity style={styles.addBtn} onPress={openAdd} activeOpacity={0.85}>
              <Text style={styles.addBtnText}>+ ADD BANK ACCOUNT</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={styles.muted}>Loading bank accounts…</Text>
          ) : accounts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="wallet-outline" size={36} color={Colors.primary} />
              <Text style={styles.emptyTitle}>No bank accounts yet</Text>
              <Text style={styles.muted}>
                Add a payout bank account to manage event earnings.
              </Text>
            </View>
          ) : (
            accounts.map((account) => (
              <BankAccountCard
                key={account.id}
                account={account}
                onLinkEvent={setLinkTarget}
                onEdit={openEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))
          )}
        </ScrollView>
      </View>

      <BankDetailsModal
        visible={bankModalVisible}
        initialValues={bankInitialValues}
        onClose={() => {
          setBankModalVisible(false);
          setEditingAccount(null);
        }}
        onSave={handleBankSave}
      />

      <LinkEventModal
        visible={Boolean(linkTarget)}
        onClose={() => setLinkTarget(null)}
        onSubmit={handleLinkEvent}
        loading={linking}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
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
  headerSpacer: {
    width: 40,
  },
  body: {
    flex: 1,
  },
  bodyWide: {
    flexDirection: "row",
  },
  sidebar: {
    width: 220,
    backgroundColor: Colors.backgroundSecondary,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  sidebarActive: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: FontSize.md,
  },
  sidebarItem: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentInner: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    maxWidth: 960,
    width: "100%",
    alignSelf: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    flexWrap: "wrap",
  },
  pageTitle: {
    flex: 1,
    minWidth: 200,
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  addBtnText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: FontSize.sm,
  },
  muted: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: "center",
  },
  emptyCard: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardBackground,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
});
