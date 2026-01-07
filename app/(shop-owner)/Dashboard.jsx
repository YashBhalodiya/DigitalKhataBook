import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { customerService } from "../../src/services/customerService";

const Dashboard = () => {
  const router = useRouter();
  const [customerCount, setCustomerCount] = useState(0);
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomerCount();
  }, []);

  const fetchCustomerCount = async () => {
    try {
      setLoading(true);
      const count = await customerService.getCustomerCount(user?.uid);
      setCustomerCount(count);
    } catch (error) {
      throw error;
    }
  };

  const addCustomer = () => {
    router.push("/(shop-owner)/AddCustomerModal");
  };

  const viewAllCustomer = () => {
    router.push("/(shop-owner)/ListAllCustomers");
  };

  const addCreditEntry = () => {
    router.replace("/(shop-owner)/add-credit-entry");
    console.log("Pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Shop Owner: {userProfile?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/(shop-owner)/ProfileScreen")}
        >
          <Ionicons name="person-circle" size={40} color="#059669" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.outstandingCard]}>
          <Text style={[styles.statLabel, styles.whiteText]}>
            Total Outstanding
          </Text>
          <Text style={[styles.statValue, styles.whiteText]}>₹ XX,XXX</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Number of Customers</Text>
          <Text style={styles.statValue}>{customerCount}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton} onPress={addCustomer}>
          <Ionicons name="person-add-outline" size={24} color='#05865dff' style={{backgroundColor: '#eff8f5ff', padding: 5, borderRadius: 5}} />
          <Text style={styles.actionButtonText}>Add Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={addCreditEntry}>
          <Ionicons name="add" size={24} color='#05865dff' style={{backgroundColor: '#eff8f5ff', padding: 5, borderRadius: 5}} />
          <Text style={styles.actionButtonText}>Add Credit Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="stats-chart-outline" size={24} color='#05865dff' style={{backgroundColor: '#eff8f5ff', padding: 5, borderRadius: 5}} />
          <Text style={styles.actionButtonText}>Monthly Summary</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.viewSection}>
        <Text style={styles.sectionTitle}>Manage</Text>
        <TouchableOpacity style={styles.actionButton} onPress={viewAllCustomer}>
          <Ionicons name="people-outline" size={24} color='#05865dff' style={{backgroundColor: '#eff8f5ff', padding: 5, borderRadius: 5}} />
          <Text style={styles.actionButtonText}>View All Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="clipboard-outline" size={24} color='#05865dff' style={{backgroundColor: '#eff8f5ff', padding: 5, borderRadius: 5}} />
          <Text style={styles.actionButtonText}>All Transactions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    // borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#E8F5E9',
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 4,
  },
  outstandingCard: {
    backgroundColor: "#05865dff",
  },
  whiteText: {
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 12,
    paddingBottom: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#dbdbdbff',
    padding: 16,
    flexDirection: 'row',
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  actionButtonText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  viewSection: {
    // marginTop: 20,
    paddingTop: 20,
  },
  // viewButton: {
  //   borderWidth: 1,
  //   borderColor: "#000",
  //   padding: 16,
  //   alignItems: "center",
  //   marginBottom: 12,
  //   backgroundColor: "#fff",
  // },
  // viewButtonText: {
  //   fontSize: 16,
  //   fontWeight: "500",
  //   color: "#000",
  // },
});

export default Dashboard;
