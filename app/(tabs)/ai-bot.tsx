import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickActions = [
  { id: "1", label: "Find Marathons", icon: "search-outline" as const },
  { id: "2", label: "Training Tips", icon: "fitness-outline" as const },
  { id: "3", label: "Registration Help", icon: "help-circle-outline" as const },
  { id: "4", label: "What to Pack", icon: "bag-outline" as const },
];

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hello! 👋 I'm your BookMyRun AI assistant. I can help you with:\n\n🏃 Finding running events near you\n📋 Registration queries\n🎽 Training tips & preparation\n❓ Any questions about marathons\n\nHow can I assist you today?",
    isUser: false,
    timestamp: new Date(),
  },
];

export default function AIBotScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText.trim()),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("marathon") || lowerInput.includes("event") || lowerInput.includes("race")) {
      return "🏃 Great! I can help you find running events. Currently, we have several exciting events:\n\n• Tata Mumbai Marathon 2026 - Jan 18\n• Mumbai Women's 10K - Mar 18\n• Bengaluru Night Run - Apr 5\n\nWould you like more details about any of these events?";
    }

    if (lowerInput.includes("training") || lowerInput.includes("prepare") || lowerInput.includes("tips")) {
      return "📋 Here are some training tips:\n\n1. **Start Slow**: Gradually increase your weekly mileage\n2. **Rest Days**: Include 2-3 rest days per week\n3. **Cross-Training**: Try cycling or swimming\n4. **Nutrition**: Eat balanced meals with carbs & protein\n5. **Hydration**: Drink 8-10 glasses of water daily\n\nWant specific training plans for a particular distance?";
    }

    if (lowerInput.includes("register") || lowerInput.includes("book") || lowerInput.includes("sign up")) {
      return "📝 To register for an event:\n\n1. Browse events on the Home tab\n2. Select your preferred event\n3. Choose your race category (5K, 10K, Half, Full)\n4. Fill in participant details\n5. Complete payment\n\nYou'll receive a confirmation email with your BIB number! Need help with a specific event?";
    }

    if (lowerInput.includes("pack") || lowerInput.includes("bring") || lowerInput.includes("kit")) {
      return "🎽 Essential Race Day Kit:\n\n✅ Running shoes (broken in!)\n✅ Comfortable running attire\n✅ Energy gels/snacks\n✅ Water bottle\n✅ Sunscreen & cap\n✅ ID proof & registration confirmation\n✅ Safety pins for BIB\n✅ Vaseline (anti-chafing)\n\nAnything else you'd like to know?";
    }

    return "Thanks for your message! 🙂 I'm still learning and improving. Currently, I can help you with:\n\n• Finding running events\n• Training tips\n• Registration guidance\n• Race day preparation\n\nFeel free to ask about any of these topics!";
  };

  const handleQuickAction = (label: string) => {
    setInputText(label);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.botAvatar}>
            <Ionicons name="fitness" size={24} color={Colors.textWhite} />
          </View>
          <View>
            <Text style={styles.headerTitle}>RunBot AI</Text>
            <Text style={styles.headerSubtitle}>Your running assistant</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.isUser ? styles.userBubble : styles.botBubble,
              ]}
            >
              {!message.isUser && (
                <View style={styles.botIconSmall}>
                  <Ionicons name="fitness" size={14} color={Colors.primary} />
                </View>
              )}
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userText : styles.botText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          ))}

          {/* Quick Actions */}
          {messages.length === 1 && (
            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionButton}
                    onPress={() => handleQuickAction(action.label)}
                  >
                    <Ionicons
                      name={action.icon}
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.quickActionText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me anything about running..."
              placeholderTextColor={Colors.textLight}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim().length === 0 && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={inputText.trim().length === 0}
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  inputText.trim().length > 0
                    ? Colors.textWhite
                    : Colors.textLight
                }
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>
            AI responses are for guidance only. Verify race details on official pages.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.backgroundSecondary,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  botIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: Colors.textWhite,
  },
  botText: {
    color: Colors.textPrimary,
  },
  quickActionsContainer: {
    marginTop: 8,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.primary,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 8,
  },
});
