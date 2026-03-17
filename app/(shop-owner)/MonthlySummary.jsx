import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { transactionService } from "../../src/services/transactionService";

const MonthlySummary = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  
  const [selectedMonthStr, setSelectedMonthStr] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Data state
  const [monthsData, setMonthsData] = useState({});
  const [availableMonths, setAvailableMonths] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchMonthlyData();
    }, [userProfile?.shopId])
  );

  const fetchMonthlyData = async () => {
    if (!userProfile?.shopId) return;
    try {
      setLoading(true);
      const txs = await transactionService.getAllTransactionsForShop(userProfile.shopId);
      
      const aggregation = {};

      txs.forEach((tx) => {
        if (!tx.createdAt) return;
        const date = new Date(tx.createdAt.toMillis());
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!aggregation[monthYear]) {
          aggregation[monthYear] = { credit: 0, payment: 0 };
        }
        
        if (tx.type === 'credit') {
          aggregation[monthYear].credit += tx.amount;
        } else if (tx.type === 'payment') {
          aggregation[monthYear].payment += tx.amount;
        }
      });

      setMonthsData(aggregation);
      const months = Object.keys(aggregation);
      
      // If no transactions yet, add current month
      if (months.length === 0) {
        const currMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        setAvailableMonths([currMonthYear]);
        setSelectedMonthStr(currMonthYear);
        setMonthsData({ [currMonthYear]: { credit: 0, payment: 0 } });
      } else {
        setAvailableMonths(months);
        if (!selectedMonthStr || !months.includes(selectedMonthStr)) {
          setSelectedMonthStr(months[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching monthly data", error);
    } finally {
      setLoading(false);
    }
  };

  const currentData = monthsData[selectedMonthStr] || { credit: 0, payment: 0 };
  const balance = currentData.credit - currentData.payment;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Monthly Summary</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly Summary</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.label}>Select Month</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMonthStr}
            onValueChange={(itemValue) => setSelectedMonthStr(itemValue)}
            style={styles.picker}
          >
            {availableMonths.map((month) => (
              <Picker.Item key={month} label={month} value={month} />
            ))}
          </Picker>
        </View>

        <View style={styles.creditCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#fee2e2" }]}>
            <Ionicons name="arrow-up" size={20} color="#dc2626" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Total Credit Issued</Text>
            <Text style={styles.cardSubLabel}>{selectedMonthStr}</Text>
          </View>
          <Text style={styles.amount}>
            ₹{currentData.credit.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.paidCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#dcfce7" }]}>
            <Ionicons name="arrow-down" size={20} color="#16a34a" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Total Payment Received</Text>
            <Text style={styles.cardSubLabel}>{selectedMonthStr}</Text>
          </View>
          <Text style={styles.amount}>
            ₹{currentData.payment.toLocaleString('en-IN')}
          </Text>
        </View>

        {(currentData.credit > 0 || currentData.payment > 0) && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Credit vs Payment Breakdown</Text>
            <BarChart
              data={[
                {
                  value: currentData.credit,
                  label: "Credit",
                  frontColor: "#dc2626",
                },
                {
                  value: currentData.payment,
                  label: "Paid",
                  frontColor: "#16a34a",
                },
              ]}
              barWidth={65}
              spacing={40}
              roundedTop
              xAxisThickness={1}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "#6b7280", fontSize: 11 }}
              xAxisLabelTextStyle={{ color: "#6b7280", fontSize: 11 }}
              noOfSections={4}
              height={180}
            />
          </View>
        )}

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceIconCircle}>
              <Ionicons name="stats-chart" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.balanceLabel}>Net Flow (Credit - Payment)</Text>
              <Text style={styles.balanceSubLabel}>{selectedMonthStr}</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>
            ₹{balance.toLocaleString('en-IN')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: "#e5e5e5" },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#000", marginLeft: 8 },
  scrollContent: { padding: 16, paddingBottom: 20 },
  label: { fontSize: 14, color: "#000", marginBottom: 8, fontWeight: "500" },
  pickerContainer: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, backgroundColor: "#fff", overflow: "hidden", marginBottom: 16 },
  picker: { height: 50 },
  creditCard: { backgroundColor: "#fff", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#e5e5e5", marginBottom: 16, flexDirection: "row", alignItems: "center" },
  paidCard: { backgroundColor: "#fff", padding: 16, borderRadius: 8, borderWidth: 1, borderColor: "#e5e5e5", marginBottom: 16, flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 12 },
  cardContent: { flex: 1 },
  cardLabel: { fontSize: 12, color: "#6b7280", marginBottom: 2 },
  cardSubLabel: { fontSize: 14, color: "#000", fontWeight: "500" },
  amount: { fontSize: 22, fontWeight: "700", color: "#000" },
  balanceCard: { backgroundColor: "#059669", padding: 20, borderRadius: 12, marginBottom: 16 },
  balanceHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  balanceIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center", marginRight: 12 },
  balanceLabel: { fontSize: 12, color: "#fff", opacity: 0.9, marginBottom: 2 },
  balanceSubLabel: { fontSize: 14, color: "#fff", fontWeight: "500" },
  balanceAmount: { fontSize: 30, fontWeight: "700", color: "#fff" },
  chartCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e5e5e5", alignItems: 'center' },
  chartTitle: { fontSize: 14, fontWeight: "600", color: "#111827", marginBottom: 12, alignSelf: 'flex-start' },
});

export default MonthlySummary;
