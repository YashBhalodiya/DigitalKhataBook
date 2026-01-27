import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";

const VerifyEmailScreen = () => {
  const router = useRouter();
  const { user, resendVerificationEmail, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

  useEffect(() => {
    // Check if email is already verified
    if (user?.emailVerified) {
      router.replace("/(auth)/LoginScreen");
    }
  }, [user]);

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      await resendVerificationEmail();
      ToastAndroid.show("Verification email sent!", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show("Failed to send email. Try again.", ToastAndroid.SHORT);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setCheckingVerification(true);
      await user?.reload();

      if (user?.emailVerified) {
        ToastAndroid.show("Email verified successfully!", ToastAndroid.SHORT);
        router.replace("/(auth)/LoginScreen");
      } else {
        ToastAndroid.show(
          "Email not verified yet. Please check your inbox.",
          ToastAndroid.LONG
        );
      }
    } catch (error) {
      ToastAndroid.show(
        "Error checking verification status",
        ToastAndroid.SHORT
      );
      console.error(error);
    } finally {
      setCheckingVerification(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/LoginScreen");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={80} color="#059669" />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>We've sent a verification email to</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Text style={styles.instructions}>
          Please check your inbox and click the verification link to activate
          your account.
        </Text>

        <TouchableOpacity
          style={styles.checkButton}
          onPress={handleCheckVerification}
          disabled={checkingVerification}
        >
          {checkingVerification ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#fff"
              />
              <Text style={styles.checkButtonText}>I've Verified My Email</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#059669" />
          ) : (
            <>
              <Ionicons name="mail-outline" size={20} color="#059669" />
              <Text style={styles.resendButtonText}>
                Resend Verification Email
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Wrong email address?</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign out and try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 24,
    textAlign: "center",
  },
  instructions: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  checkButton: {
    flexDirection: "row",
    backgroundColor: "#059669",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
    gap: 8,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  resendButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#059669",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 8,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
  },
  footer: {
    marginTop: "auto",
    marginBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
});

export default VerifyEmailScreen;
