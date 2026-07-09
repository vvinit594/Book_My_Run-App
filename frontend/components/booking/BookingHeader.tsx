import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "../../constants/colors";
import { Spacing } from "../../constants/spacing";

interface BookingHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({
  title,
  currentStep,
  totalSteps,
  onBack,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.stepsRow}>
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <React.Fragment key={stepNumber}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCompleted,
                    isCurrent && styles.stepCurrent,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={14} color={Colors.textWhite} />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        isCurrent && styles.stepNumberCurrent,
                      ]}
                    >
                      {stepNumber}
                    </Text>
                  )}
                </View>
                {stepNumber < totalSteps && (
                  <View
                    style={[
                      styles.stepLine,
                      (isCompleted || isCurrent) && styles.stepLineActive,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
        <View style={styles.stepLabels}>
          <Text style={styles.stepLabel}>Tickets</Text>
          <Text style={styles.stepLabel}>Details</Text>
          <Text style={styles.stepLabel}>Review</Text>
          <Text style={styles.stepLabel}>Payment</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  stepNumberCurrent: {
    color: Colors.textWhite,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
    maxWidth: 60,
  },
  stepLineActive: {
    backgroundColor: Colors.success,
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  stepLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});

export default BookingHeader;
