import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";
import { ParticipantDetails } from "../../types";
import BookingHeader from "../../components/booking/BookingHeader";
import FormInput, { FormSelect, FormCheckbox } from "../../components/booking/FormInput";
import FormSection from "../../components/booking/FormSection";

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const tShirtOptions = [
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
];

const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const initialParticipant: ParticipantDetails = {
  basic: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  personal: {
    gender: "Male",
    dateOfBirth: "",
    tShirtSize: "M",
    bloodGroup: "O+",
  },
  emergency: {
    name: "",
    phone: "",
    relationship: "",
  },
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  },
  waiverAccepted: false,
  newsletterOptIn: true,
};

export default function ParticipantDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const quantity = parseInt(params.quantity as string) || 1;

  const [currentParticipant, setCurrentParticipant] = useState(0);
  const [participants, setParticipants] = useState<ParticipantDetails[]>(
    Array.from({ length: quantity }, () => ({ ...initialParticipant }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateParticipant = (
    section: keyof ParticipantDetails,
    field: string,
    value: any
  ) => {
    const updated = [...participants];
    if (section === "waiverAccepted" || section === "newsletterOptIn") {
      updated[currentParticipant] = {
        ...updated[currentParticipant],
        [section]: value,
      };
    } else {
      updated[currentParticipant] = {
        ...updated[currentParticipant],
        [section]: {
          ...(updated[currentParticipant][section] as object),
          [field]: value,
        },
      };
    }
    setParticipants(updated);
    // Clear error when field is updated
    setErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
  };

  const validateParticipant = (): boolean => {
    const p = participants[currentParticipant];
    const newErrors: Record<string, string> = {};

    // Basic details validation
    if (!p.basic.firstName.trim()) newErrors["basic.firstName"] = "First name is required";
    if (!p.basic.lastName.trim()) newErrors["basic.lastName"] = "Last name is required";
    if (!p.basic.email.trim()) newErrors["basic.email"] = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(p.basic.email))
      newErrors["basic.email"] = "Invalid email format";
    if (!p.basic.phone.trim()) newErrors["basic.phone"] = "Phone is required";
    else if (!/^\d{10}$/.test(p.basic.phone))
      newErrors["basic.phone"] = "Invalid phone number";

    // Personal details
    if (!p.personal.dateOfBirth.trim())
      newErrors["personal.dateOfBirth"] = "Date of birth is required";

    // Emergency contact
    if (!p.emergency.name.trim())
      newErrors["emergency.name"] = "Emergency contact name is required";
    if (!p.emergency.phone.trim())
      newErrors["emergency.phone"] = "Emergency contact phone is required";

    // Address
    if (!p.address.addressLine1.trim())
      newErrors["address.addressLine1"] = "Address is required";
    if (!p.address.city.trim()) newErrors["address.city"] = "City is required";
    if (!p.address.state.trim()) newErrors["address.state"] = "State is required";
    if (!p.address.pincode.trim())
      newErrors["address.pincode"] = "Pincode is required";

    // Waiver
    if (!p.waiverAccepted)
      newErrors["waiver"] = "You must accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateParticipant()) {
      Alert.alert("Please Fill Required Fields", "Some required fields are missing or invalid.");
      return;
    }

    if (currentParticipant < quantity - 1) {
      setCurrentParticipant(currentParticipant + 1);
      setErrors({});
    } else {
      // All participants filled, move to review
      router.push({
        pathname: "/booking/review-summary",
        params: {
          ...params,
          participants: JSON.stringify(participants),
        },
      });
    }
  };

  const handlePrevious = () => {
    if (currentParticipant > 0) {
      setCurrentParticipant(currentParticipant - 1);
      setErrors({});
    }
  };

  const p = participants[currentParticipant];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <BookingHeader title="Participant Details" currentStep={2} totalSteps={4} />

      {/* Participant Tab Selector */}
      {quantity > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {Array.from({ length: quantity }, (_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                currentParticipant === index && styles.tabActive,
              ]}
              onPress={() => {
                setCurrentParticipant(index);
                setErrors({});
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  currentParticipant === index && styles.tabTextActive,
                ]}
              >
                Participant {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details */}
        <FormSection title="Basic Details" icon="person-outline">
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <FormInput
                label="First Name"
                value={p.basic.firstName}
                onChangeText={(text) => updateParticipant("basic", "firstName", text)}
                placeholder="Enter first name"
                required
                error={errors["basic.firstName"]}
              />
            </View>
            <View style={styles.halfWidth}>
              <FormInput
                label="Last Name"
                value={p.basic.lastName}
                onChangeText={(text) => updateParticipant("basic", "lastName", text)}
                placeholder="Enter last name"
                required
                error={errors["basic.lastName"]}
              />
            </View>
          </View>
          <FormInput
            label="Email Address"
            value={p.basic.email}
            onChangeText={(text) => updateParticipant("basic", "email", text)}
            placeholder="email@example.com"
            keyboardType="email-address"
            required
            error={errors["basic.email"]}
          />
          <FormInput
            label="Phone Number"
            value={p.basic.phone}
            onChangeText={(text) => updateParticipant("basic", "phone", text)}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            required
            error={errors["basic.phone"]}
          />
        </FormSection>

        {/* Personal Details */}
        <FormSection title="Personal Details" icon="body-outline">
          <FormSelect
            label="Gender"
            value={p.personal.gender}
            options={genderOptions}
            onSelect={(value) => updateParticipant("personal", "gender", value)}
            required
          />
          <FormInput
            label="Date of Birth"
            value={p.personal.dateOfBirth}
            onChangeText={(text) => updateParticipant("personal", "dateOfBirth", text)}
            placeholder="DD/MM/YYYY"
            required
            error={errors["personal.dateOfBirth"]}
          />
          <FormSelect
            label="T-Shirt Size"
            value={p.personal.tShirtSize}
            options={tShirtOptions}
            onSelect={(value) => updateParticipant("personal", "tShirtSize", value)}
            required
          />
          <FormSelect
            label="Blood Group"
            value={p.personal.bloodGroup}
            options={bloodGroupOptions}
            onSelect={(value) => updateParticipant("personal", "bloodGroup", value)}
            required
          />
        </FormSection>

        {/* Emergency Contact */}
        <FormSection title="Emergency Contact" icon="call-outline">
          <FormInput
            label="Contact Name"
            value={p.emergency.name}
            onChangeText={(text) => updateParticipant("emergency", "name", text)}
            placeholder="Enter emergency contact name"
            required
            error={errors["emergency.name"]}
          />
          <FormInput
            label="Contact Phone"
            value={p.emergency.phone}
            onChangeText={(text) => updateParticipant("emergency", "phone", text)}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            required
            error={errors["emergency.phone"]}
          />
          <FormInput
            label="Relationship"
            value={p.emergency.relationship}
            onChangeText={(text) => updateParticipant("emergency", "relationship", text)}
            placeholder="e.g., Spouse, Parent, Friend"
          />
        </FormSection>

        {/* Address */}
        <FormSection title="Address Details" icon="home-outline">
          <FormInput
            label="Address Line 1"
            value={p.address.addressLine1}
            onChangeText={(text) => updateParticipant("address", "addressLine1", text)}
            placeholder="Street address"
            required
            error={errors["address.addressLine1"]}
          />
          <FormInput
            label="Address Line 2"
            value={p.address.addressLine2 || ""}
            onChangeText={(text) => updateParticipant("address", "addressLine2", text)}
            placeholder="Apartment, suite, etc. (optional)"
          />
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <FormInput
                label="City"
                value={p.address.city}
                onChangeText={(text) => updateParticipant("address", "city", text)}
                placeholder="City"
                required
                error={errors["address.city"]}
              />
            </View>
            <View style={styles.halfWidth}>
              <FormInput
                label="State"
                value={p.address.state}
                onChangeText={(text) => updateParticipant("address", "state", text)}
                placeholder="State"
                required
                error={errors["address.state"]}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <FormInput
                label="Pincode"
                value={p.address.pincode}
                onChangeText={(text) => updateParticipant("address", "pincode", text)}
                placeholder="6-digit pincode"
                keyboardType="numeric"
                maxLength={6}
                required
                error={errors["address.pincode"]}
              />
            </View>
            <View style={styles.halfWidth}>
              <FormInput
                label="Country"
                value={p.address.country}
                onChangeText={(text) => updateParticipant("address", "country", text)}
                placeholder="Country"
                editable={false}
              />
            </View>
          </View>
        </FormSection>

        {/* Waiver & Terms */}
        <FormSection title="Waiver & Terms" icon="document-text-outline">
          <FormCheckbox
            label="I have read and agree to the terms and conditions, privacy policy, and medical waiver. I understand the risks involved in participating in this running event."
            checked={p.waiverAccepted}
            onToggle={() =>
              updateParticipant("waiverAccepted", "", !p.waiverAccepted)
            }
            required
          />
          {errors["waiver"] && (
            <Text style={styles.errorText}>{errors["waiver"]}</Text>
          )}
          <FormCheckbox
            label="I would like to receive updates and offers about future running events."
            checked={p.newsletterOptIn}
            onToggle={() =>
              updateParticipant("newsletterOptIn", "", !p.newsletterOptIn)
            }
          />
        </FormSection>

        {/* Spacer for bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        {currentParticipant > 0 && (
          <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
            <Ionicons name="arrow-back" size={18} color={Colors.primary} />
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.nextButton,
            currentParticipant === 0 && { flex: 1 },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentParticipant < quantity - 1
              ? `Next Participant (${currentParticipant + 2}/${quantity})`
              : "Review & Continue"}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabsContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    marginRight: Spacing.sm,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textWhite,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  halfWidth: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  previousButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: Spacing.xs,
  },
  previousButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textWhite,
  },
});
