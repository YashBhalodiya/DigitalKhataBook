import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const IS_EXPO_GO = Constants.appOwnership === "expo";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async initialize() {
    try {
      if (!Device.isDevice) {
        console.log("Must use physical device for Push Notifications");
        return false;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#059669",
          sound: "default",
        });

        await Notifications.setNotificationChannelAsync("reminders", {
          name: "Payment Reminders",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#059669",
        });
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Notification permissions not granted");
        return false;
      }

      console.log("Notification permissions granted");
      return true;
    } catch (error) {
      console.error("Error initializing notifications:", error);
      return false;
    }
  },

  // Send immediate notification
  async sendInstantNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data,
          sound: "default",
        },
        trigger: {
          seconds: 1,
          channelId: "default",
        },
      });
      console.log("Instant notification scheduled");
      return true;
    } catch (error) {
      console.error("Error sending instant notification:", error);
      return false;
    }
  },

  // Schedule payment reminder for specific date
  async schedulePaymentReminder(customerName, amount, dateTime) {
    try {
      const reminderDate = new Date(dateTime);
      const now = new Date();

      if (reminderDate <= now) {
        console.log("Cannot schedule notification in the past");
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Payment Reminder",
          body: `${customerName} has pending payment of ₹${amount}`,
          data: {
            type: "payment_reminder",
            customerName,
            amount,
          },
          sound: "default",
        },
        trigger: {
          date: reminderDate,
          channelId: "reminders",
        },
      });

      console.log("Payment reminder scheduled with ID:", notificationId);
      return notificationId;
    } catch (error) {
      console.error("Error scheduling payment reminder:", error);
      return null;
    }
  },

  async scheduleDailyReminder() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(20, 0, 0, 0);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "📖 Check Your KhataBook",
          body: "Review today's transactions and pending payments",
          data: { type: "daily_reminder" },
          sound: "default",
        },
        trigger: {
          date: tomorrow,
          channelId: "reminders",
        },
      });

      console.log("Daily reminder scheduled for:", tomorrow.toLocaleString());
      return notificationId;
    } catch (error) {
      console.error("Error scheduling daily reminder:", error);
      return null;
    }
  },

  // Schedule multiple daily reminders (workaround for repeating)
  async scheduleWeeklyReminders() {
    try {
      const notificationIds = [];

      // Schedule for next 7 days
      for (let i = 1; i <= 1; i++) {
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + i);
        reminderDate.setHours(20, 0, 0, 0);

        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Check Your KhataBook",
            body: "Review today's transactions and pending payments",
            data: { type: "daily_reminder", day: i },
            sound: "default",
          },
          trigger: {
            date: reminderDate,
            channelId: "reminders",
          },
        });

        notificationIds.push(id);
      }

      console.log(`Scheduled ${notificationIds.length} daily reminders`);
      return notificationIds;
    } catch (error) {
      console.error("Error scheduling weekly reminders:", error);
      return [];
    }
  },

  // Get all scheduled notifications
  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  },

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log("Notification cancelled:", notificationId);
      return true;
    } catch (error) {
      console.error("Error cancelling notification:", error);
      return false;
    }
  },

  // Cancel all notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications cancelled");
      return true;
    } catch (error) {
      console.error("Error cancelling all notifications:", error);
      return false;
    }
  },

  // Add notification listener
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  // Add notification response listener (when user taps notification)
  addNotificationResponseReceivedListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  // Register push token
  async registerPushToken(userId) {
    try {
      if (IS_EXPO_GO) return; // won't work in Expo Go
      if (!Device.isDevice) return;

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.warn(
          "EAS projectId not configured. Run `eas init` to set it up.",
        );
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const { updateDoc, doc } = await import("firebase/firestore");
      const { db } = await import("../../firebase");

      await updateDoc(doc(db, "users", userId), {
        expoPushToken: tokenData.data,
      });

      console.log("Push token saved:", tokenData.data);
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  },

  // Send push notification to a specific customer
  async sendPushToCustomer(expoPushToken, shopName, amount, description) {
    try {
      const message = {
        to: expoPushToken,
        sound: "default",
        title: `New Entry from ${shopName}`,
        body: `₹${amount} added${description ? ` - ${description}` : ""}`,
        data: { type: "new_entry", amount, shopName },
      };

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log("Push notification result:", result);
      return result;
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  },
};
