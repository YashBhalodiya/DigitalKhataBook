import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { authService } from "../../src/services/authService";
import { notificationService } from "../../src/services/notificationService";
import { shopService } from "../../src/services/shopService";

const ShopOwnerProfileScreen = () => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [shopData, setShopData] = useState(null);
  const [fetchingShop, setFetchingShop] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  useEffect(() => {
    checkScheduledNotifications();
  }, []);

  const checkScheduledNotifications = async () => {
    const notifications =
      await notificationService.getAllScheduledNotifications();
    setScheduledNotifications(notifications);
    setNotificationsEnabled(notifications.length > 0);
  };

  const handleLogout = async () => {
    try {
      await authService.singout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        //request
        const hasPermission = await notificationService.initialize();
        if (!hasPermission) {
          alert("Please enable notifications in your device settings");
          return;
        }

        const ids = await notificationService.scheduleWeeklyReminders();

        if (ids.length > 0) {
          setNotificationsEnabled(true);
          alert(`Scheduled ${ids.length} daily reminders for the next week`);
        }
      } else {
        await notificationService.cancelAllNotifications();
        setNotificationsEnabled(false);
        alert("All reminders cancelled");
      }

      checkScheduledNotifications();
    } catch (error) {
      console.error("Error toggling notifications:", error);
      alert("Error setting up notifications");
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/(auth)/LoginScreen");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchShopData = async () => {
      if (userProfile?.shopId) {
        try {
          setFetchingShop(true);
          const shop = await shopService.getShopById(userProfile?.shopId);
          setShopData(shop);
        } catch (error) {
          throw error;
        } finally {
          setFetchingShop(false);
        }
      } else {
        setFetchingShop(false);
      }
    };
    fetchShopData();
  }, [userProfile?.shopId]);

  if (loading || !user || !userProfile || fetchingShop) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#05865dff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Profile</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#05865dff"
              style={styles.icon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userProfile?.name || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#05865dff"
              style={styles.icon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#05865dff"
              style={styles.icon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Mobile Number</Text>
              <Text style={styles.infoValue}>
                +91 {userProfile?.phone || "N/A"}
              </Text>
            </View>
          </View>

          {userProfile?.role === "shop-owner" && (
            <View style={styles.infoRow}>
              <Ionicons
                name="storefront-outline"
                size={20}
                color="#05865dff"
                style={styles.icon}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Shop Name</Text>
                <Text style={styles.infoValue}>
                  {shopData.shopName || "N/A"}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#05865dff"
              style={styles.icon}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>
                {userProfile?.role === "shop-owner" ? "Shop Owner" : "Customer"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push("/(shop-owner)/EditProfileModal")}
          >
            <Ionicons
              name="create-outline"
              size={24}
              color="#05865dff"
              style={styles.actionIcon}
            />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#666"
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push("/(shop-owner)/ChangePasswordModal")}
          >
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="#05865dff"
              style={styles.actionIcon}
            />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#666"
              style={styles.chevron}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingItem,
              notificationsEnabled && styles.settingItemActive,
            ]}
            onPress={toggleNotifications}
          >
            <View
              style={[
                styles.settingIcon,
                notificationsEnabled && styles.settingIconActive,
              ]}
            >
              <Ionicons
                name={
                  notificationsEnabled
                    ? "notifications"
                    : "notifications-outline"
                }
                size={24}
                color="#059669"
              />
            </View>
            <Text style={styles.settingText}>
              {notificationsEnabled ? "Disable" : "Enable"} Daily Reminders
            </Text>
            {scheduledNotifications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {scheduledNotifications.length}
                </Text>
              </View>
            )}
            <Ionicons
              name={notificationsEnabled ? "toggle" : "toggle-outline"}
              size={32}
              color={notificationsEnabled ? "#059669" : "#ccc"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
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
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#dbdbdbff",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  icon: {
    backgroundColor: "#eff8f5ff",
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  section: {
    marginBottom: 20,
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
    borderColor: "#dbdbdbff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  actionIcon: {
    backgroundColor: "#eff8f5ff",
    padding: 5,
    borderRadius: 5,
  },
  actionButtonText: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  chevron: {
    marginLeft: "auto",
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#ffcdd2",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#ffebee",
  },
  logoutButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#d32f2f",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
  badgeText: {
    fontSize: 12,
    color: "#f44336",
    fontWeight: "bold",
  },
  settingItem: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#dbdbdbff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  settingItemActive: {
    borderColor: "#059669",
    backgroundColor: "#f0faf6",
  },
  settingIcon: {
    backgroundColor: "#eff8f5ff",
    padding: 5,
    borderRadius: 5,
  },
  settingIconActive: {
    backgroundColor: "#d1fae5",
  },
  settingText: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  badge: {
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
});

export default ShopOwnerProfileScreen;
