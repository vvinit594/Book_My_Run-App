import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { Spacing, FontSize, BorderRadius } from "../../constants/spacing";
import { FAQSection, FAQ } from "../../types";

interface EventFAQsProps {
  faqs: FAQSection[];
}

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <Pressable style={styles.faqItem} onPress={onToggle}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.textSecondary}
        />
      </View>
      {isOpen && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
    </Pressable>
  );
}

export default function EventFAQs({ faqs }: EventFAQsProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const handleToggle = (faqId: string) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>FAQs</Text>

      {faqs.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionLabel}>{section.title}</Text>
          
          {section.questions.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openFaqId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: Spacing.md,
    textTransform: "uppercase",
  },
  faqItem: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  faqQuestion: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  faqAnswer: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    lineHeight: 20,
  },
});
