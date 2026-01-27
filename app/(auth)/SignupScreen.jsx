import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";

const SignupScreen = () => {
  const router = useRouter();
  const { signUpShopOwner, signUpCustomer } = useAuth();
  const [role, setRole] = useState("shop-owner");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    shopName: "",
  });

  const handleSignup = async () => {
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        ToastAndroid.show("Fill the fields", ToastAndroid.SHORT);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        ToastAndroid.show("Passwords don't match", ToastAndroid.SHORT);
        return;
      }

      if (formData.phone.length !== 10) {
        ToastAndroid.show("Invalid mobile number", ToastAndroid.SHORT);
        return;
      }

      if (role === "shop-owner" && !formData.shopName) {
        ToastAndroid.show("Shop name is req", ToastAndroid.SHORT);
        return;
      }
      setLoading(true);

      if (role === "shop-owner") {
        await signUpShopOwner(formData);
        ToastAndroid.show("Shop created successfully!", ToastAndroid.SHORT);
        router.replace("/VerifyEmailScreen");
      } else {
        const result = await signUpCustomer(formData);
        ToastAndroid.show(
          "Account created! Please verify your email.",
          ToastAndroid.LONG,
        );

        if (result.customerId) {
          ToastAndroid.show("Account linked successfully!", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(
            "Account created! Contact shop owner to link.",
            ToastAndroid.LONG,
          );
        }
        router.replace("/VerifyEmailScreen");
        // router.replace("/(customer)/CustomerDashboard");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subTitle}>Sign up to get started</Text>
        </View>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "shop-owner" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("shop-owner")}
          >
            <Text
              style={[
                styles.roleText,
                role === "shop-owner" && styles.roleTextActive,
              ]}
            >
              Shop Owner
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "customer" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("customer")}
          >
            <Text
              style={[
                styles.roleText,
                role === "customer" && styles.roleTextActive,
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {role === "shop-owner" && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Shop Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter shop name"
                  value={formData.shopName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, shopName: text })
                  }
                />
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry={!visible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setVisible(!visible)}
              >
                <Ionicons
                  name={visible ? "eye-off" : "eye"}
                  size={24}
                  color="#686868"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              secureTextEntry={!visible}
            />
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/LoginScreen")}
          >
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  roleText: {
    fontSize: 16,
    color: "#666",
  },
  roleTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  formContainer: {
    gap: 16,
    paddingRight: 1,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: "#000000ff",
    paddingLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    padding: 14,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    padding: 4,
  },
  signupButton: {
    backgroundColor: "#059669",
    // borderWidth: 2,
    // borderColor: "#000",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffffff",
  },
  loginButton: {
    alignItems: "center",
    padding: 12,
  },
  loginText: {
    fontSize: 14,
    color: "#000",
    // textDecorationLine: "underline",
  },
});

export default SignupScreen;
