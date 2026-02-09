import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Platform,
  Alert,
  Dimensions,
  Linking,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import Colors from "../../../constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Types
interface Participant {
  rank: number;
  bibNumber: string;
  name: string;
  time: string;
  pace: string;
  category: string;
  ageGroup: string;
  gender: "M" | "F";
  city: string;
}

interface SplitData {
  interval: string;
  chipTime: string;
  chipPace: string;
  speed: string;
  speedDiffVsSplit: string;
  speedDiffVsAvg: string;
}

// Segments for the tabbed sections
const SEGMENTS = ["Details", "Split Details", "Comparison", "Share"] as const;
type SegmentType = typeof SEGMENTS[number];

// Generate mock split data based on category
const generateSplitData = (category: string, finishTime: string): SplitData[] => {
  const splits: SplitData[] = [];
  let totalSeconds = 0;
  
  // Parse finish time to seconds
  const timeParts = finishTime.split(":").map(Number);
  if (timeParts.length === 3) {
    totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
  } else if (timeParts.length === 2) {
    totalSeconds = timeParts[0] * 60 + timeParts[1];
  }

  // Define split points based on category
  let splitPoints: number[] = [];
  let totalDistance = 5;
  
  switch (category) {
    case "Full Marathon":
      totalDistance = 42.195;
      splitPoints = [5, 10, 15, 20, 25, 30, 35, 40, 42.195];
      break;
    case "Half Marathon":
      totalDistance = 21.0975;
      splitPoints = [5, 10, 15, 20, 21.0975];
      break;
    case "10K":
      totalDistance = 10;
      splitPoints = [2.5, 5, 7.5, 10];
      break;
    case "5K":
      totalDistance = 5;
      splitPoints = [1.6, 2.5, 4.1, 5];
      break;
    default:
      totalDistance = 5;
      splitPoints = [1.6, 2.5, 4.1, 5];
  }

  const avgPaceSeconds = totalSeconds / totalDistance;
  let prevTime = 0;
  let prevSpeed = 0;

  splitPoints.forEach((distance, index) => {
    // Add some variation to make it realistic
    const variation = (Math.random() - 0.5) * 0.3;
    const segmentDistance = index === 0 ? distance : distance - splitPoints[index - 1];
    const segmentTime = avgPaceSeconds * segmentDistance * (1 + variation);
    const cumulativeTime = index === 0 ? segmentTime : prevTime + segmentTime;
    
    const hours = Math.floor(cumulativeTime / 3600);
    const mins = Math.floor((cumulativeTime % 3600) / 60);
    const secs = Math.floor(cumulativeTime % 60);
    const chipTime = hours > 0 
      ? `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
      : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    const paceMinutes = segmentTime / segmentDistance / 60;
    const paceMin = Math.floor(paceMinutes);
    const paceSec = Math.floor((paceMinutes - paceMin) * 60);
    const chipPace = `${paceMin}:${paceSec.toString().padStart(2, "0")} min/km`;

    const speed = (segmentDistance / (segmentTime / 3600)).toFixed(1);
    const speedNum = parseFloat(speed);
    const avgSpeed = (totalDistance / (totalSeconds / 3600)).toFixed(1);
    const avgSpeedNum = parseFloat(avgSpeed);

    // Calculate differences
    let speedDiffVsSplit = "-";
    if (index > 0) {
      const diff = speedNum - prevSpeed;
      speedDiffVsSplit = diff >= 0 ? `+${diff.toFixed(1)} km/h` : `${diff.toFixed(1)} km/h`;
    }

    const speedDiffVsAvg = speedNum - avgSpeedNum >= 0 
      ? `+${(speedNum - avgSpeedNum).toFixed(1)} km/h` 
      : `${(speedNum - avgSpeedNum).toFixed(1)} km/h`;

    const intervalLabel = distance >= totalDistance 
      ? "Full Course" 
      : `Split @ ${distance.toFixed(1)} Km`;

    splits.push({
      interval: intervalLabel,
      chipTime,
      chipPace,
      speed: `${speed} km/h`,
      speedDiffVsSplit,
      speedDiffVsAvg,
    });

    prevTime = cumulativeTime;
    prevSpeed = speedNum;
  });

  return splits;
};

// Mock data for comparison
const mockAllParticipants: Participant[] = [];
const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Karan", "Neha", "Arjun", "Pooja", "Rohan", "Divya", "Jigar", "Sunny"];
const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Panchal", "Nandoliya", "Gupta", "Verma"];

for (let i = 1; i <= 20; i++) {
  mockAllParticipants.push({
    rank: i,
    bibNumber: `${5000 + i}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    time: `${18 + i}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`,
    pace: `${3 + Math.floor(i / 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")} /km`,
    category: "5K",
    ageGroup: ["18-29", "30-39", "40-49"][i % 3],
    gender: i % 3 === 0 ? "F" : "M",
    city: ["Mumbai", "Delhi", "Pune"][i % 3],
  });
}

// Avatar Component
const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 80 }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.avatarInner, { width: size - 8, height: size - 8, borderRadius: (size - 8) / 2 }]}>
        <Text style={[styles.avatarText, { fontSize: size / 3 }]}>{initials}</Text>
      </View>
    </View>
  );
};

// Segment Button Component
const SegmentButton: React.FC<{
  segment: SegmentType;
  isActive: boolean;
  onPress: () => void;
}> = ({ segment, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.segmentButtonText, isActive && styles.segmentButtonTextActive]}>
      {segment}
    </Text>
  </TouchableOpacity>
);

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
  icon?: string;
}> = ({ title, value, subtitle, color = Colors.primary, icon }) => (
  <View style={styles.statCard}>
    <View style={[styles.statCardHeader, { backgroundColor: color }]}>
      {icon && <Ionicons name={icon as any} size={16} color={Colors.textWhite} style={{ marginRight: 6 }} />}
      <Text style={styles.statCardTitle}>{title}</Text>
    </View>
    <View style={styles.statCardBody}>
      <Text style={styles.statCardValue}>{value}</Text>
      {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);

// Rank Card Component
const RankCard: React.FC<{
  title: string;
  rank: number;
  total: number;
}> = ({ title, rank, total }) => (
  <View style={styles.rankItem}>
    <Text style={styles.rankLabel}>{title}</Text>
    <Text style={styles.rankValue}>{rank}</Text>
    <Text style={styles.rankTotal}>OF {total}</Text>
  </View>
);

export default function RunnerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    runnerId?: string;
    runnerData?: string;
    eventName?: string;
    eventDate?: string;
    eventYear?: string;
  }>();

  // Parse runner data
  const runner: Participant = useMemo(() => {
    if (params.runnerData) {
      try {
        return JSON.parse(params.runnerData);
      } catch {
        return {
          rank: 1,
          bibNumber: params.runnerId || "5009",
          name: "Unknown Runner",
          time: "00:00",
          pace: "0:00 /km",
          category: "5K",
          ageGroup: "18-29",
          gender: "M",
          city: "Mumbai",
        };
      }
    }
    return {
      rank: 1,
      bibNumber: params.runnerId || "5009",
      name: "Unknown Runner",
      time: "00:00",
      pace: "0:00 /km",
      category: "5K",
      ageGroup: "18-29",
      gender: "M",
      city: "Mumbai",
    };
  }, [params.runnerData, params.runnerId]);

  const [activeSegment, setActiveSegment] = useState<SegmentType>("Details");
  const [compareQuery, setCompareQuery] = useState("");
  const [comparedRunner, setComparedRunner] = useState<Participant | null>(null);

  // Calculate additional timing data
  const timingData = useMemo(() => {
    // Parse time to calculate more metrics
    const timeParts = runner.time.split(":").map(Number);
    let totalSeconds = 0;
    if (timeParts.length === 3) {
      totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    } else if (timeParts.length === 2) {
      totalSeconds = timeParts[0] * 60 + timeParts[1];
    }

    // Get distance based on category
    let distance = 5;
    switch (runner.category) {
      case "Full Marathon": distance = 42.195; break;
      case "Half Marathon": distance = 21.0975; break;
      case "10K": distance = 10; break;
      case "5K": distance = 5; break;
    }

    // Calculate speed
    const speedKmh = (distance / (totalSeconds / 3600)).toFixed(1);

    // Gun time is typically a few seconds more than chip time
    const gunTimeSeconds = totalSeconds + Math.floor(Math.random() * 10) + 5;
    const gunHours = Math.floor(gunTimeSeconds / 3600);
    const gunMins = Math.floor((gunTimeSeconds % 3600) / 60);
    const gunSecs = Math.floor(gunTimeSeconds % 60);
    const gunTime = gunHours > 0 
      ? `${gunHours}:${gunMins.toString().padStart(2, "0")}:${gunSecs.toString().padStart(2, "0")}`
      : `${gunMins}:${gunSecs.toString().padStart(2, "0")}`;

    return {
      finishTime: runner.time,
      chipTime: runner.time,
      gunTime,
      chipPace: runner.pace,
      avgSpeed: `${speedKmh} km/h`,
      distance: `${distance} Km`,
    };
  }, [runner]);

  // Generate split data
  const splitData = useMemo(() => {
    return generateSplitData(runner.category, runner.time);
  }, [runner.category, runner.time]);

  // Calculate rank data
  const rankData = useMemo(() => {
    // Mock total participants based on runner rank
    const totalOverall = Math.max(runner.rank + Math.floor(Math.random() * 20) + 5, 14);
    const totalGender = Math.max(runner.rank + Math.floor(Math.random() * 10), 13);
    return {
      overall: { rank: runner.rank, total: totalOverall },
      gender: { rank: runner.rank, total: totalGender },
    };
  }, [runner.rank]);

  // Handle comparison search
  const handleCompare = () => {
    if (!compareQuery.trim()) {
      Alert.alert("Enter BIB or Name", "Please enter a BIB number or runner name to compare.");
      return;
    }

    const query = compareQuery.toLowerCase().trim();
    const found = mockAllParticipants.find(
      (p) => 
        p.bibNumber.toLowerCase() === query ||
        p.name.toLowerCase().includes(query)
    );

    if (found) {
      setComparedRunner(found);
    } else {
      Alert.alert("Not Found", "No runner found with that BIB number or name.");
    }
  };

  // Show toast message
  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("", message);
    }
  };

  // Copy link to clipboard
  const copyLinkToClipboard = async () => {
    const shareUrl = `https://bookmyrun.com/result/${params.eventName?.replace(/\s+/g, '-').toLowerCase() || 'race'}/${runner.bibNumber}`;
    await Clipboard.setStringAsync(shareUrl);
    showToast("Link copied to clipboard!");
  };

  // Handle Instagram share
  const handleInstagramShare = async () => {
    try {
      // Check if Instagram is installed
      const instagramUrl = "instagram://app";
      const canOpenInstagram = await Linking.canOpenURL(instagramUrl);

      if (!canOpenInstagram) {
        showToast("Instagram app not installed on this device.");
        return;
      }

      // Since direct Instagram sharing requires native modules for image generation,
      // we'll use the Stories share URL scheme which works on both platforms
      // For a full implementation, you'd use react-native-share or expo-sharing with image
      
      // Create share content
      const shareMessage = `🏃 Race Result - ${runner.name}\n\n` +
        `🎫 BIB: ${runner.bibNumber}\n` +
        `📍 Event: ${params.eventName || "Marathon Event"}\n` +
        `🏅 Distance: ${runner.category}\n` +
        `⏱️ Finish Time: ${timingData.finishTime}\n` +
        `📊 Pace: ${timingData.chipPace}\n` +
        `🥇 Overall Rank: ${rankData.overall.rank} of ${rankData.overall.total}\n\n` +
        `#BookMyRun #Running #Marathon #${runner.category.replace(/\s+/g, '')} #RaceResult`;

      // Try to open Instagram with share intent
      // Note: Full Instagram Stories sharing requires native image generation
      // For now, we'll use the native share sheet which includes Instagram
      const shareResult = await Share.share({
        message: shareMessage,
        title: `${runner.name} - Race Result`,
      });

      if (shareResult.action === Share.dismissedAction) {
        // User dismissed share - no action needed
      }
    } catch (error) {
      console.error("Instagram share error:", error);
      // Fallback to copy link
      await copyLinkToClipboard();
      showToast("Unable to share on Instagram. Link copied instead.");
    }
  };

  // Handle share functionality
  const handleShare = async (platform?: string) => {
    const shareMessage = `🏃 Race Result - ${runner.name}\n\n` +
      `🎫 BIB: ${runner.bibNumber}\n` +
      `📍 Event: ${params.eventName || "Marathon Event"}\n` +
      `🏅 Distance: ${runner.category}\n` +
      `⏱️ Finish Time: ${timingData.finishTime}\n` +
      `📊 Pace: ${timingData.chipPace}\n` +
      `🥇 Overall Rank: ${rankData.overall.rank} of ${rankData.overall.total}\n\n` +
      `Check out more at BookMyRun.com`;

    try {
      if (platform === "copy") {
        await copyLinkToClipboard();
        return;
      }

      if (platform === "instagram") {
        await handleInstagramShare();
        return;
      }

      await Share.share({
        message: shareMessage,
        title: `${runner.name} - Race Result`,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  // Handle downloads (mock)
  const handleDownload = (type: "certificate" | "badge") => {
    Alert.alert(
      `Download ${type === "certificate" ? "Certificate" : "Badge"}`,
      `Your ${type} will be downloaded shortly.`,
      [{ text: "OK" }]
    );
  };

  // Render Details Section
  const renderDetails = () => (
    <View style={styles.sectionContent}>
      {/* Timing Summary */}
      <View style={styles.timingSection}>
        <View style={[styles.sectionHeader, { backgroundColor: Colors.primary }]}>
          <Text style={styles.sectionHeaderText}>Timings</Text>
        </View>
        <View style={styles.timingGrid}>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>Finish Time</Text>
            <Text style={styles.timingValue}>{timingData.finishTime}</Text>
          </View>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>Chip Pace (min/km)</Text>
            <Text style={styles.timingValue}>{timingData.chipPace.replace(" /km", "")}</Text>
          </View>
        </View>
      </View>

      {/* Overall Rank Section */}
      <View style={styles.rankSection}>
        <View style={[styles.sectionHeader, { backgroundColor: "#FF9500" }]}>
          <Text style={styles.sectionHeaderText}>Overall Rank</Text>
        </View>
        <View style={styles.rankGrid}>
          <RankCard title="Overall" rank={rankData.overall.rank} total={rankData.overall.total} />
          <View style={styles.rankDivider} />
          <RankCard title="Gender" rank={rankData.gender.rank} total={rankData.gender.total} />
        </View>
      </View>

      {/* Gun Time / Chip Time Badges */}
      <View style={styles.timeBadgesRow}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeBadgeLabel}>Gun Time - </Text>
          <Text style={styles.timeBadgeValue}>{timingData.gunTime}</Text>
        </View>
        <View style={[styles.timeBadge, styles.timeBadgeChip]}>
          <Text style={styles.timeBadgeLabel}>Chip Time - </Text>
          <Text style={styles.timeBadgeValue}>{timingData.chipTime}</Text>
        </View>
      </View>
    </View>
  );

  // Render Split Details Section
  const renderSplitDetails = () => (
    <View style={styles.sectionContent}>
      <View style={[styles.sectionHeader, { backgroundColor: Colors.primary }]}>
        <Text style={styles.sectionHeaderText}>Split Details</Text>
      </View>
      
      {/* Table with Sticky Interval Column */}
      <View style={styles.splitTableContainer}>
        {/* Fixed Interval Column */}
        <View style={styles.splitFixedColumn}>
          {/* Header */}
          <View style={styles.splitFixedHeaderCell}>
            <Text style={styles.splitHeaderText}>Interval</Text>
          </View>
          {/* Rows */}
          {splitData.map((split, index) => (
            <View 
              key={index} 
              style={[
                styles.splitFixedRowCell,
                index % 2 === 1 && styles.splitTableRowAlt
              ]}
            >
              <Text style={styles.splitIntervalText}>{split.interval}</Text>
            </View>
          ))}
        </View>

        {/* Scrollable Data Columns */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.splitScrollContainer}
          contentContainerStyle={styles.splitScrollContent}
        >
          <View style={styles.splitScrollableColumns}>
            {/* Header Row */}
            <View style={styles.splitScrollHeader}>
              <View style={styles.splitScrollHeaderCell}>
                <Text style={styles.splitHeaderText}>Chip Time</Text>
              </View>
              <View style={styles.splitScrollHeaderCell}>
                <Text style={styles.splitHeaderText}>Chip Pace{"\n"}(min/km)</Text>
              </View>
              <View style={styles.splitScrollHeaderCell}>
                <Text style={styles.splitHeaderText}>Speed</Text>
              </View>
              <View style={styles.splitScrollHeaderCellWide}>
                <Text style={styles.splitHeaderText}>Speed Difference</Text>
                <View style={styles.splitSubHeader}>
                  <Text style={styles.splitSubHeaderText}>vs Each Split</Text>
                  <Text style={styles.splitSubHeaderText}>vs Avg. Speed</Text>
                </View>
              </View>
            </View>

            {/* Data Rows */}
            {splitData.map((split, index) => (
              <View 
                key={index} 
                style={[
                  styles.splitScrollRow,
                  index % 2 === 1 && styles.splitTableRowAlt
                ]}
              >
                <View style={styles.splitScrollCell}>
                  <Text style={styles.splitCellText}>{split.chipTime}</Text>
                </View>
                <View style={styles.splitScrollCell}>
                  <Text style={styles.splitCellText}>{split.chipPace}</Text>
                </View>
                <View style={styles.splitScrollCell}>
                  <Text style={styles.splitCellText}>{split.speed}</Text>
                </View>
                <View style={styles.splitScrollCellWide}>
                  <View style={styles.splitDiffContainer}>
                    <Text style={[
                      styles.splitDiffText,
                      split.speedDiffVsSplit.startsWith("+") ? styles.diffPositive : 
                      split.speedDiffVsSplit.startsWith("-") ? styles.diffNegative : {}
                    ]}>
                      {split.speedDiffVsSplit}
                    </Text>
                    <Text style={[
                      styles.splitDiffText,
                      split.speedDiffVsAvg.startsWith("+") ? styles.diffPositive : 
                      split.speedDiffVsAvg.startsWith("-") ? styles.diffNegative : {}
                    ]}>
                      {split.speedDiffVsAvg}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Scroll Hint */}
      <View style={styles.scrollHint}>
        <Ionicons name="swap-horizontal" size={14} color={Colors.textLight} />
        <Text style={styles.scrollHintText}>Swipe to see more columns</Text>
      </View>

      {/* Full Course Summary */}
      <View style={styles.fullCourseSummary}>
        <Text style={styles.fullCourseLabel}>Full Course:</Text>
        <View style={styles.fullCourseBadges}>
          <View style={[styles.timeBadge, { backgroundColor: "#FF9500" }]}>
            <Text style={styles.timeBadgeLabel}>Gun Time - </Text>
            <Text style={styles.timeBadgeValue}>{timingData.gunTime}</Text>
          </View>
          <View style={[styles.timeBadge, styles.timeBadgeChip]}>
            <Text style={styles.timeBadgeLabel}>Chip Time - </Text>
            <Text style={styles.timeBadgeValue}>{timingData.chipTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render Comparison Section
  const renderComparison = () => (
    <View style={styles.sectionContent}>
      <View style={[styles.sectionHeader, { backgroundColor: "#C6E74D" }]}>
        <Text style={[styles.sectionHeaderText, { color: Colors.textPrimary }]}>
          Compare Timings With Other Peers
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.compareInputContainer}>
        <View style={styles.compareSearchBox}>
          <Text style={styles.compareInputLabel}>Enter BIB Number / Name</Text>
          <TextInput
            style={styles.compareInput}
            placeholder="e.g., 5010 or Jigar"
            placeholderTextColor={Colors.textLight}
            value={compareQuery}
            onChangeText={setCompareQuery}
            returnKeyType="search"
            onSubmitEditing={handleCompare}
          />
        </View>
        <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
          <Text style={styles.compareButtonText}>Compare</Text>
        </TouchableOpacity>
      </View>

      {/* Comparison Results */}
      {comparedRunner && (
        <View style={styles.comparisonResults}>
          <View style={styles.comparisonHeader}>
            <View style={[styles.comparisonColumn, styles.comparisonColumnLabel]}>
              <View style={[styles.comparisonHeaderCell, { backgroundColor: Colors.primary }]}>
                <Text style={styles.comparisonHeaderText}>Details</Text>
              </View>
            </View>
            <View style={styles.comparisonColumn}>
              <View style={[styles.comparisonHeaderCell, { backgroundColor: Colors.primary }]}>
                <Text style={styles.comparisonHeaderText}>Your Data</Text>
              </View>
            </View>
            <View style={styles.comparisonColumn}>
              <View style={[styles.comparisonHeaderCell, { backgroundColor: "#C6E74D" }]}>
                <Text style={[styles.comparisonHeaderText, { color: Colors.textPrimary }]}>Compared Data</Text>
              </View>
            </View>
          </View>

          {/* Comparison Rows */}
          {[
            { label: "Runners Name", yours: runner.name, theirs: comparedRunner.name },
            { label: "Race Category", yours: runner.category, theirs: comparedRunner.category },
            { label: "BIB No", yours: runner.bibNumber, theirs: comparedRunner.bibNumber },
            { label: "Chip Pace (Min/Km)", yours: runner.pace, theirs: comparedRunner.pace },
            { label: "Gun Time", yours: timingData.gunTime, theirs: comparedRunner.time },
            { label: "Overall Rank", yours: `${rankData.overall.rank} of ${rankData.overall.total}`, theirs: `${comparedRunner.rank} of ${rankData.overall.total}` },
            { label: "Gender Rank", yours: `${rankData.gender.rank} of ${rankData.gender.total}`, theirs: `${comparedRunner.rank + 2} of ${rankData.gender.total}` },
          ].map((row, index) => (
            <View key={index} style={styles.comparisonRow}>
              <View style={[styles.comparisonColumn, styles.comparisonColumnLabel]}>
                <Text style={styles.comparisonLabelText}>{row.label}</Text>
              </View>
              <View style={styles.comparisonColumn}>
                <Text style={styles.comparisonValueText}>{row.yours}</Text>
              </View>
              <View style={styles.comparisonColumn}>
                <Text style={styles.comparisonValueText}>{row.theirs}</Text>
              </View>
            </View>
          ))}

          {/* Split Comparison */}
          <View style={styles.splitComparisonSection}>
            <View style={styles.splitComparisonHeader}>
              <View style={[styles.splitCompColumn, { flex: 1.5 }]}>
                <View style={[styles.comparisonHeaderCell, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.comparisonHeaderText}>Interval</Text>
                </View>
              </View>
              <View style={styles.splitCompColumn}>
                <View style={[styles.comparisonHeaderCell, { backgroundColor: Colors.primary }]}>
                  <View>
                    <Text style={styles.comparisonHeaderText}>Chip Time</Text>
                    <Text style={[styles.comparisonHeaderText, { fontSize: 10 }]}>Chip Pace (Min/km)</Text>
                  </View>
                </View>
              </View>
              <View style={styles.splitCompColumn}>
                <View style={[styles.comparisonHeaderCell, { backgroundColor: "#C6E74D" }]}>
                  <View>
                    <Text style={[styles.comparisonHeaderText, { color: Colors.textPrimary }]}>Chip Time</Text>
                    <Text style={[styles.comparisonHeaderText, { fontSize: 10, color: Colors.textPrimary }]}>Chip Pace (Min/km)</Text>
                  </View>
                </View>
              </View>
            </View>

            {splitData.map((split, index) => {
              // Generate comparison split data
              const theirTimeDiff = Math.random() > 0.5 ? -Math.floor(Math.random() * 120) : Math.floor(Math.random() * 120);
              const formatTimeDiff = (diff: number) => {
                const sign = diff >= 0 ? "+" : "";
                const absDiff = Math.abs(diff);
                if (absDiff >= 60) {
                  return `${sign}${Math.floor(absDiff / 60)}:${(absDiff % 60).toString().padStart(2, "0")}m`;
                }
                return `${sign}${absDiff}s`;
              };

              return (
                <View key={index} style={[styles.splitCompRow, index % 2 === 1 && styles.splitTableRowAlt]}>
                  <View style={[styles.splitCompColumn, { flex: 1.5 }]}>
                    <Text style={styles.splitCellText}>{split.interval}</Text>
                  </View>
                  <View style={styles.splitCompColumn}>
                    <Text style={styles.splitCellText}>{split.chipTime}</Text>
                    <Text style={[
                      styles.splitDiffText,
                      theirTimeDiff > 0 ? styles.diffPositive : styles.diffNegative
                    ]}>
                      {formatTimeDiff(theirTimeDiff)}
                    </Text>
                  </View>
                  <View style={styles.splitCompColumn}>
                    <Text style={styles.splitCellText}>{split.chipTime}</Text>
                    <Text style={[
                      styles.splitDiffText,
                      theirTimeDiff > 0 ? styles.diffNegative : styles.diffPositive
                    ]}>
                      {formatTimeDiff(-theirTimeDiff)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {!comparedRunner && (
        <View style={styles.comparisonPlaceholder}>
          <Ionicons name="people-outline" size={48} color={Colors.textLight} />
          <Text style={styles.comparisonPlaceholderText}>
            Enter a BIB number or name to compare race results with another runner
          </Text>
        </View>
      )}
    </View>
  );

  // Render Share Section
  const renderShare = () => (
    <View style={styles.sectionContent}>
      <View style={[styles.sectionHeader, { backgroundColor: Colors.primary }]}>
        <Text style={styles.sectionHeaderText}>Share Your Achievement</Text>
      </View>

      <View style={styles.shareContent}>
        <Text style={styles.shareSubtitle}>Share your race result with friends and family</Text>

        <View style={styles.shareOptionsGrid}>
          <TouchableOpacity style={styles.shareOption} onPress={() => handleShare("whatsapp")}>
            <View style={[styles.shareIconContainer, { backgroundColor: "#25D366" }]}>
              <Ionicons name="logo-whatsapp" size={28} color={Colors.textWhite} />
            </View>
            <Text style={styles.shareOptionText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={() => handleShare("instagram")}>
            <View style={[styles.shareIconContainer, styles.instagramGradient]}>
              <Ionicons name="logo-instagram" size={28} color={Colors.textWhite} />
            </View>
            <Text style={styles.shareOptionText}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={() => handleShare("twitter")}>
            <View style={[styles.shareIconContainer, { backgroundColor: "#1DA1F2" }]}>
              <Ionicons name="logo-twitter" size={28} color={Colors.textWhite} />
            </View>
            <Text style={styles.shareOptionText}>X (Twitter)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={() => handleShare("facebook")}>
            <View style={[styles.shareIconContainer, { backgroundColor: "#1877F2" }]}>
              <Ionicons name="logo-facebook" size={28} color={Colors.textWhite} />
            </View>
            <Text style={styles.shareOptionText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={() => handleShare("copy")}>
            <View style={[styles.shareIconContainer, { backgroundColor: Colors.textSecondary }]}>
              <Ionicons name="copy-outline" size={28} color={Colors.textWhite} />
            </View>
            <Text style={styles.shareOptionText}>Copy Link</Text>
          </TouchableOpacity>
        </View>

        {/* Native Share Button */}
        <TouchableOpacity style={styles.nativeShareButton} onPress={() => handleShare()}>
          <Ionicons name="share-outline" size={20} color={Colors.textWhite} />
          <Text style={styles.nativeShareButtonText}>Share Result</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>Runner Details</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {params.eventName || "Race Event"}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Runner Header Card */}
        <View style={styles.runnerHeaderCard}>
          <View style={styles.runnerHeaderTop}>
            <Avatar name={runner.name} size={100} />
            <View style={styles.eventLogoContainer}>
              <View style={styles.eventLogoPlaceholder}>
                <Ionicons name="trophy-outline" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.eventLogoText} numberOfLines={2}>
                {params.eventName || "Race Event"}
              </Text>
            </View>
          </View>

          <View style={styles.runnerInfo}>
            <Text style={styles.runnerName}>{runner.name.toUpperCase()}</Text>
            <View style={styles.runnerMetaRow}>
              <View style={styles.runnerMetaItem}>
                <Text style={styles.runnerMetaLabel}>BIB No:</Text>
                <Text style={styles.runnerMetaValue}>{runner.bibNumber}</Text>
              </View>
              <View style={styles.runnerMetaItem}>
                <Text style={styles.runnerMetaLabel}>Distance:</Text>
                <Text style={styles.runnerMetaValue}>{timingData.distance}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDownload("badge")}
              >
                <Ionicons name="ribbon-outline" size={18} color={Colors.textWhite} />
                <Text style={styles.actionButtonText}>Download Badge</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDownload("certificate")}
              >
                <Ionicons name="document-outline" size={18} color={Colors.textWhite} />
                <Text style={styles.actionButtonText}>Download Certificate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Segment Tabs */}
        <View style={styles.segmentContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.segmentRow}>
              {SEGMENTS.map((segment) => (
                <SegmentButton
                  key={segment}
                  segment={segment}
                  isActive={activeSegment === segment}
                  onPress={() => setActiveSegment(segment)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Content based on active segment */}
        {activeSegment === "Details" && renderDetails()}
        {activeSegment === "Split Details" && renderSplitDetails()}
        {activeSegment === "Comparison" && renderComparison()}
        {activeSegment === "Share" && renderShare()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundDark,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  // Runner Header Card
  runnerHeaderCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  runnerHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  avatar: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    backgroundColor: Colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarText: {
    fontWeight: "700",
    color: Colors.primary,
  },
  eventLogoContainer: {
    alignItems: "center",
    maxWidth: 120,
  },
  eventLogoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  eventLogoText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
  runnerInfo: {
    marginTop: 16,
  },
  runnerName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  runnerMetaRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 16,
  },
  runnerMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  runnerMetaLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  runnerMetaValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  // Segment Tabs
  segmentContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16,
  },
  segmentButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  segmentButtonTextActive: {
    color: Colors.textWhite,
  },
  // Section Content
  sectionContent: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  // Timing Section
  timingSection: {
    marginBottom: 16,
  },
  timingGrid: {
    flexDirection: "row",
    padding: 16,
  },
  timingItem: {
    flex: 1,
    alignItems: "center",
  },
  timingLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  timingValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  // Rank Section
  rankSection: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankGrid: {
    flexDirection: "row",
    paddingVertical: 16,
  },
  rankItem: {
    flex: 1,
    alignItems: "center",
  },
  rankLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  rankValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  rankTotal: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 2,
  },
  rankDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  // Time Badges
  timeBadgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  timeBadge: {
    flexDirection: "row",
    backgroundColor: "#FF9500",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  timeBadgeChip: {
    backgroundColor: Colors.primary,
  },
  timeBadgeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  timeBadgeValue: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  // Split Details - Horizontal Scrollable Table with Sticky Column
  splitTableContainer: {
    flexDirection: "row",
  },
  // Fixed Interval Column (Sticky)
  splitFixedColumn: {
    width: 100,
    backgroundColor: Colors.cardBackground,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  splitFixedHeaderCell: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  splitFixedRowCell: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.cardBackground,
  },
  splitIntervalText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  // Scrollable Columns
  splitScrollContainer: {
    flex: 1,
  },
  splitScrollContent: {
    flexGrow: 1,
  },
  splitScrollableColumns: {
    minWidth: SCREEN_WIDTH - 100,
  },
  splitScrollHeader: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    minHeight: 56,
  },
  splitScrollHeaderCell: {
    width: 90,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  splitScrollHeaderCellWide: {
    width: 160,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  splitHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textWhite,
    textAlign: "center",
  },
  splitSubHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 6,
    gap: 16,
  },
  splitSubHeaderText: {
    fontSize: 10,
    color: Colors.textWhite,
    opacity: 0.9,
  },
  splitScrollRow: {
    flexDirection: "row",
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.cardBackground,
  },
  splitScrollCell: {
    width: 90,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  splitScrollCellWide: {
    width: 160,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  splitCellText: {
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: "center",
    fontWeight: "500",
  },
  splitDiffContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 12,
  },
  splitDiffText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  splitTableRowAlt: {
    backgroundColor: Colors.backgroundSecondary,
  },
  diffPositive: {
    color: Colors.success,
  },
  diffNegative: {
    color: Colors.error,
  },
  // Scroll Hint
  scrollHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollHintText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  fullCourseSummary: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 12,
    backgroundColor: Colors.backgroundSecondary,
  },
  fullCourseBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  fullCourseLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  // Comparison Section
  compareInputContainer: {
    padding: 16,
    backgroundColor: "#C6E74D",
  },
  compareSearchBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  compareInputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  compareInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  compareButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  compareButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  comparisonResults: {
    marginTop: 12,
  },
  comparisonHeader: {
    flexDirection: "row",
  },
  comparisonColumn: {
    flex: 1,
  },
  comparisonColumnLabel: {
    flex: 1.2,
  },
  comparisonHeaderCell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  comparisonHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textWhite,
    textAlign: "center",
  },
  comparisonRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  comparisonLabelText: {
    fontSize: 12,
    color: Colors.textSecondary,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  comparisonValueText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 8,
    textAlign: "center",
  },
  comparisonPlaceholder: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  comparisonPlaceholderText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
  // Split Comparison
  splitComparisonSection: {
    marginTop: 16,
  },
  splitComparisonHeader: {
    flexDirection: "row",
  },
  splitCompColumn: {
    flex: 1,
  },
  splitCompRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: "center",
  },
  // Share Section
  shareContent: {
    padding: 20,
  },
  shareSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  shareOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  shareOption: {
    alignItems: "center",
    width: (SCREEN_WIDTH - 100) / 5,
    minWidth: 60,
  },
  shareIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  instagramGradient: {
    // Instagram brand gradient approximation (purple-pink-orange)
    backgroundColor: "#E1306C", // Instagram pink/magenta
    // Note: For true gradient, use expo-linear-gradient
  },
  shareOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    textAlign: "center",
  },
  nativeShareButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nativeShareButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textWhite,
  },
  // Bottom Spacing
  bottomSpacing: {
    height: 30,
  },
  // Stat Card (for future use)
  statCard: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  statCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textWhite,
  },
  statCardBody: {
    padding: 12,
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  statCardSubtitle: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 4,
  },
});
