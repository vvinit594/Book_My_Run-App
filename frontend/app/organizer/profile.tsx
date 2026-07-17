import React, { useCallback, useEffect, useState } from "react";
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
  ContactUpdateModal,
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
  isValidPan,
  ORGANIZATION_TYPE_OPTIONS,
  validateGstAgainstPan,
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
import { useAuth } from "../../store/authStore";

export default function OrganizerProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<OrganizerProfile>({
    ...EMPTY_ORGANIZER_PROFILE,
    bankDetails: { ...EMPTY_ORGANIZER_PROFILE.bankDetails },
    socialMedia: { ...EMPTY_ORGANIZER_PROFILE.socialMedia },
  });
  const [errors, setErrors] = useState<OrganizerProfileErrors>({});
  const [saving, setSaving] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [emailUpdateVisible, setEmailUpdateVisible] = useState(false);
  const [phoneUpdateVisible, setPhoneUpdateVisible] = useState(false);

  // Keep verified contact fields sourced from authenticated User (auth/me).
  useEffect(() => {
    let mounted = true;

    void (async () => {
      await refreshUser();
      if (!mounted) return;
    })();

    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;

    setProfile((prev) => ({
      ...prev,
      primaryEmail: user.email,
      primaryPhone: user.phone,
      primaryUserName: prev.primaryUserName || user.name || "",
    }));
  }, [user]);

  const updateProfile = useCallback(
    <K extends keyof OrganizerProfile>(key: K, value: OrganizerProfile[K]) => {
      if (key === "primaryEmail" || key === "primaryPhone") {
        return;
      }

      setProfile((prev) => {
        const next = { ...prev, [key]: value };

        if (key === "organizationType" && value !== "individual") {
          next.aadhaarNumber = "";
        }

        if (key === "panNumber") {
          const pan = String(value).toUpperCase();
          next.panNumber = pan;
          if (next.gstStatus === "registered" && next.gstNumber) {
            const gstCheck = validateGstAgainstPan(next.gstNumber, pan);
            setErrors((prevErrors) => ({
              ...prevErrors,
              panNumber: undefined,
              gstNumber: gstCheck.valid ? undefined : gstCheck.message,
            }));
            return next;
          }
        }

        if (key === "gstNumber") {
          const gst = String(value).toUpperCase();
          next.gstNumber = gst;
          const gstCheck = validateGstAgainstPan(gst, next.panNumber);
          setErrors((prevErrors) => ({
            ...prevErrors,
            gstNumber: gst ? (gstCheck.valid ? undefined : gstCheck.message) : undefined,
          }));
          return next;
        }

        return next;
      });

      if (key !== "panNumber" && key !== "gstNumber") {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
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
    if (!user?.email || !user?.phone) {
      Alert.alert(
        "Session Required",
        "Please log in again to complete your organizer profile."
      );
      return;
    }

    const profileToValidate: OrganizerProfile = {
      ...profile,
      primaryEmail: user.email,
      primaryPhone: user.phone,
    };

    const validationErrors = validateOrganizerProfile(profileToValidate);
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
      await saveOrganizerProfile(profileToValidate);
      await refreshUser();
      router.replace("/organizer/dashboard");
    } catch (error) {
      Alert.alert(
        "Save Failed",
        error instanceof Error
          ? error.message
          : "Unable to save organizer profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const hasBankDetails = Boolean(profile.bankDetails.accountHolderName);
  const verifiedEmail = user?.email ?? profile.primaryEmail;
  const verifiedPhone = user?.phone ?? profile.primaryPhone;
  const panIsValid = isValidPan(profile.panNumber);

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
            {profile.organizationType === "individual" ? (
              <ProfileInput
                label="Aadhaar Card Number"
                value={profile.aadhaarNumber}
                onChangeText={(text) =>
                  updateProfile("aadhaarNumber", text.replace(/\D/g, ""))
                }
                placeholder="Enter Aadhaar"
                keyboardType="number-pad"
                maxLength={12}
                required
                error={errors.aadhaarNumber}
              />
            ) : null}
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
              value={verifiedEmail}
              onChangeText={() => undefined}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              required
              verified
              editable={false}
              onUpdatePress={() => setEmailUpdateVisible(true)}
              error={errors.primaryEmail}
            />
            <ProfileInput
              label="Primary Phone Number"
              value={verifiedPhone}
              onChangeText={() => undefined}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              required
              verified
              editable={false}
              onUpdatePress={() => setPhoneUpdateVisible(true)}
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
              required
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
                onChangeText={(text) => {
                  if (!panIsValid) return;
                  updateProfile("gstNumber", text.toUpperCase());
                }}
                placeholder="e.g. 27AAFCF1120L1ZU"
                autoCapitalize="characters"
                maxLength={15}
                required
                editable={panIsValid}
                helperText={
                  panIsValid
                    ? undefined
                    : "Please enter your PAN Card Number first."
                }
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

      <ContactUpdateModal
        visible={emailUpdateVisible}
        type="email"
        currentValue={verifiedEmail}
        onClose={() => setEmailUpdateVisible(false)}
        onSuccess={refreshUser}
      />

      <ContactUpdateModal
        visible={phoneUpdateVisible}
        type="phone"
        currentValue={verifiedPhone}
        onClose={() => setPhoneUpdateVisible(false)}
        onSuccess={refreshUser}
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
