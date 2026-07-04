import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  AddressSection,
  BankDetailsModal,
  OrganizerLogoUploader,
  ProfileDropdown,
  ProfileFooter,
  ProfileInput,
  ProfileTextArea,
  ProfileToggle,
  SectionCard,
  SocialMediaInputs,
} from "../../components/organizer/profile";
import {
  GST_STATUS_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
} from "../../constants/organizer";
import Colors from "../../constants/colors";
import { FontSize, Spacing } from "../../constants/spacing";
import {
  BankDetails,
  EMPTY_ORGANIZER_PROFILE,
  GstStatus,
  OrganizationType,
  OrganizerProfile,
  OrganizerProfileErrors,
  SocialMediaLinks,
} from "../../types/organizer";
import { saveOrganizerProfile } from "../../utils/organizerProfileStorage";
import { validateOrganizerProfile } from "../../utils/organizerProfileValidation";

export default function OrganizerProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<OrganizerProfile>({
    ...EMPTY_ORGANIZER_PROFILE,
    bankDetails: { ...EMPTY_ORGANIZER_PROFILE.bankDetails },
    socialMedia: { ...EMPTY_ORGANIZER_PROFILE.socialMedia },
  });
  const [errors, setErrors] = useState<OrganizerProfileErrors>({});
  const [saving, setSaving] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);

  const updateProfile = useCallback(
    <K extends keyof OrganizerProfile>(key: K, value: OrganizerProfile[K]) => {
      setProfile((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  const updateSocialMedia = useCallback(
    (key: keyof SocialMediaLinks, value: string) => {
      setProfile((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [key]: value },
      }));
    },
    []
  );

  const handleBankSave = (details: BankDetails) => {
    updateProfile("bankDetails", details);
    setBankModalVisible(false);
  };

  const handleCompleteProfile = async () => {
    const validationErrors = validateOrganizerProfile(profile);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Alert.alert(
        "Incomplete Profile",
        "Please fill all required fields correctly before continuing."
      );
      return;
    }

    setSaving(true);
    try {
      const payload: OrganizerProfile = {
        ...profile,
        organizerName: profile.organizerName.trim(),
        panNumber: profile.panNumber.trim().toUpperCase(),
        permanentAddress: profile.permanentAddress.trim(),
        billingAddress: profile.billingAddressSameAsPermanent
          ? profile.permanentAddress.trim()
          : profile.billingAddress.trim(),
        primaryUserName: profile.primaryUserName.trim(),
        primaryEmail: profile.primaryEmail.trim().toLowerCase(),
        primaryPhone: profile.primaryPhone.trim(),
        backupPhone: profile.backupPhone.trim(),
        supportEmail: profile.supportEmail.trim().toLowerCase(),
        websiteUrl: profile.websiteUrl.trim(),
        gstNumber: profile.gstNumber.trim().toUpperCase(),
      };

      await saveOrganizerProfile(payload);
      router.replace("/organizer/dashboard");
    } catch {
      Alert.alert(
        "Save Failed",
        "Unable to save organizer profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const hasBankDetails = Boolean(profile.bankDetails.accountHolderName);

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
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Organizer Profile</Text>
          <Text style={styles.headerSubtitle}>
            Complete your profile to start listing events
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SectionCard title="Basic Organizer Information">
            <OrganizerLogoUploader
              logoUri={profile.logoUri}
              onLogoChange={(uri) => updateProfile("logoUri", uri)}
            />
            <ProfileInput
              label="Organizer Name"
              value={profile.organizerName}
              onChangeText={(text) => updateProfile("organizerName", text)}
              placeholder="Enter organizer name"
              required
              error={errors.organizerName}
            />
            <ProfileTextArea
              label="About Organizer"
              value={profile.aboutOrganizer}
              onChangeText={(text) => updateProfile("aboutOrganizer", text)}
              placeholder="Tell participants about your organization"
            />
            <ProfileInput
              label="Website URL"
              value={profile.websiteUrl}
              onChangeText={(text) => updateProfile("websiteUrl", text)}
              placeholder="https://..."
              autoCapitalize="none"
              keyboardType="url"
              error={errors.websiteUrl}
            />
          </SectionCard>

          <SectionCard title="Registration & Identity">
            <ProfileToggle<OrganizationType>
              label="Organization Type"
              value={profile.organizationType}
              onChange={(value) => updateProfile("organizationType", value)}
              options={ORGANIZATION_TYPE_OPTIONS}
              required
              error={errors.organizationType}
            />
            <ProfileInput
              label="PAN Card Number"
              value={profile.panNumber}
              onChangeText={(text) =>
                updateProfile("panNumber", text.toUpperCase())
              }
              placeholder="e.g. AAFCF1120L"
              autoCapitalize="characters"
              maxLength={10}
              required
              error={errors.panNumber}
            />
            <AddressSection
              permanentAddress={profile.permanentAddress}
              billingAddress={profile.billingAddress}
              billingAddressSameAsPermanent={
                profile.billingAddressSameAsPermanent
              }
              onPermanentAddressChange={(text) =>
                updateProfile("permanentAddress", text)
              }
              onBillingAddressChange={(text) =>
                updateProfile("billingAddress", text)
              }
              onBillingSameToggle={() =>
                updateProfile(
                  "billingAddressSameAsPermanent",
                  !profile.billingAddressSameAsPermanent
                )
              }
              permanentAddressError={errors.permanentAddress}
              billingAddressError={errors.billingAddress}
            />
          </SectionCard>

          <SectionCard title="User Details">
            <ProfileInput
              label="Primary User Name"
              value={profile.primaryUserName}
              onChangeText={(text) => updateProfile("primaryUserName", text)}
              placeholder="Enter primary contact name"
              required
              error={errors.primaryUserName}
            />
            <ProfileInput
              label="Primary Email ID"
              value={profile.primaryEmail}
              onChangeText={(text) => updateProfile("primaryEmail", text)}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              required
              verified
              error={errors.primaryEmail}
            />
            <ProfileInput
              label="Primary Phone Number"
              value={profile.primaryPhone}
              onChangeText={(text) => updateProfile("primaryPhone", text)}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              required
              verified
              error={errors.primaryPhone}
            />
            <ProfileInput
              label="Backup Phone Number"
              value={profile.backupPhone}
              onChangeText={(text) => updateProfile("backupPhone", text)}
              placeholder="Optional backup number"
              keyboardType="phone-pad"
              maxLength={10}
              showInfoIcon
              error={errors.backupPhone}
            />
            <ProfileInput
              label="Support Email ID"
              value={profile.supportEmail}
              onChangeText={(text) => updateProfile("supportEmail", text)}
              placeholder="support@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              showInfoIcon
              error={errors.supportEmail}
            />
          </SectionCard>

          <SectionCard
            title="Notification Preference"
            infoText="Choose whether you want an email for every registration."
          >
            <ProfileToggle<boolean>
              label="Email Notification for Every Registration"
              value={profile.emailNotificationForRegistration}
              onChange={(value) =>
                updateProfile("emailNotificationForRegistration", value)
              }
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
            />
          </SectionCard>

          <SectionCard title="GST & Banking Details">
            <ProfileDropdown<GstStatus>
              label="GST Status"
              value={profile.gstStatus}
              options={GST_STATUS_OPTIONS}
              onSelect={(value) => updateProfile("gstStatus", value)}
              placeholder="Select GST status"
              required
              error={errors.gstStatus}
            />
            {profile.gstStatus === "registered" ? (
              <ProfileInput
                label="GST Number"
                value={profile.gstNumber}
                onChangeText={(text) =>
                  updateProfile("gstNumber", text.toUpperCase())
                }
                placeholder="e.g. 27AAFCF1120L1ZU"
                autoCapitalize="characters"
                maxLength={15}
                required
                error={errors.gstNumber}
              />
            ) : null}

            <TouchableOpacity
              style={styles.bankButton}
              onPress={() => setBankModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="business-outline" size={18} color={Colors.primary} />
              <Text style={styles.bankButtonText}>
                {hasBankDetails
                  ? "Edit Bank Account"
                  : "+ Add / Edit Bank Account"}
              </Text>
            </TouchableOpacity>

            {hasBankDetails ? (
              <View style={styles.bankSummary}>
                <Text style={styles.bankSummaryTitle}>
                  {profile.bankDetails.bankName}
                </Text>
                <Text style={styles.bankSummaryText}>
                  {profile.bankDetails.accountHolderName} • ****
                  {profile.bankDetails.accountNumber.slice(-4)}
                </Text>
              </View>
            ) : null}
          </SectionCard>

          <SectionCard title="Social Media Links">
            <SocialMediaInputs
              values={profile.socialMedia}
              onChange={updateSocialMedia}
            />
          </SectionCard>
        </ScrollView>

        <ProfileFooter onComplete={handleCompleteProfile} loading={saving} />
      </KeyboardAvoidingView>

      <BankDetailsModal
        visible={bankModalVisible}
        initialValues={profile.bankDetails}
        onClose={() => setBankModalVisible(false)}
        onSave={handleBankSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  flex: {
    flex: 1,
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
  headerTextWrap: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  bankButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    minHeight: 48,
    marginTop: Spacing.sm,
  },
  bankButtonText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  bankSummary: {
    marginTop: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: Spacing.md,
  },
  bankSummaryTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  bankSummaryText: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
