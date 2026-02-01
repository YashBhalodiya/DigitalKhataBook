import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const { signInWithEmail, forgotPassword } = useAuth();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        ToastAndroid.show("Please fill the fields", ToastAndroid.SHORT);
        return;
      }
      await signInWithEmail(email, password);
      console.log("Logged in success");
      // router.replace("/(shop-owner)/Dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const handleforgotPassword = async () => {
    try {
      await forgotPassword(email);
      ToastAndroid.show(
        "Check your inbox to reset password",
        ToastAndroid.SHORT,
      );
    } catch (error) {
      throw error;
    }
  };

  const handleCreateAccount = () => {
    router.push("/(auth)/SignupScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subTitle}>Please Login</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!visible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setVisible(!visible)}
            >
              <Ionicons
                name={visible ? "eye-off" : "eye"}
                size={24}
                color="#059669"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.forgotPassButton}
          onPress={handleforgotPassword}
        >
          <Text style={styles.forgotPassButtonText}>Forgot Passoword?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createAccountText}>
            Don't have an account? Click here
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  header: {
    marginBottom: 30,
    marginTop: 50,
  },
  title: {
    fontSize: 35,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    color: "#686868ff",
  },
  formContainer: {
    gap: 16,
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
  eyeIcon: {
    position: "absolute",
    right: 14,
    padding: 4,
  },
  forgotPassButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 12,
  },
  forgotPassButtonText: {
    color: "#1eaa25ff",
    fontSize: 15,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#059669",
    // borderWidth: 2,
    // borderColor: "#000",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffffff",
  },
  createAccountButton: {
    alignItems: "center",
    padding: 12,
  },
  createAccountText: {
    fontSize: 14,
    color: "#000",
    // textDecorationLine: "underline",
  },
});

export default LoginScreen;
