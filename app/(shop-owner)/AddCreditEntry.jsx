import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { customerService } from "../../src/services/customerService";
import { transactionService } from "../../src/services/transactionService";

const AddCreditEntry = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("1");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingCustomers, setFetchingCustomers] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [userProfile?.shopId]),
  );

  const fetchCustomers = async () => {
    if (!userProfile?.shopId) {
      Alert.alert("Error", "Shop ID not found");
      return;
    }
    try {
      setFetchingCustomers(true);
      const customersList = await customerService.getCustomers(
        userProfile.shopId,
      );
      setCustomers(customersList);
      if (customersList.length > 0) {
        setSelectedCustomer(customersList[0].id);
      }
    } catch (error) {
      throw error;
    } finally {
      setFetchingCustomers(false);
    }
  };

  const handleSave = async () => {
    try {
      await transactionService.addCreditEntry(
        userProfile.shopId,
        selectedCustomer,
        {
          amount: parseFloat(amount),
          description: description.trim(),
          date,
        },
      );
      Alert.alert("Success", "Credit entry added successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      throw error;
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === "ios") {
        setShowDatePicker(false);
      }
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleCancel = () => {
    router.back();
  };

  if (fetchingCustomers) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Credit Entry</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading customers...</Text>
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
        <Text style={styles.headerTitle}>Add Credit Entry</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.label}>Select Customer *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
            style={styles.picker}
            enabled={!loading}
          >
            {customers.map((customer) => (
              <Picker.Item
                key={customer.id}
                label={`${customer.name} - ${customer.totalDue || 0} due`}
                value={customer.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Date *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={showDatePickerModal}
          disabled={loading}
        >
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
            textColor="#000"
          />
        )}

        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          placeholder="₹ 0"
          value={`₹ ${amount}`}
          onChangeText={(text) => setAmount(text.replace("₹ ", ""))}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Description / Items</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter details about the purchase..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#0891b2"
          />
          <Text style={styles.infoText}>
            This will add to the customer's outstanding balance.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Entry</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "500",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  dateText: {
    fontSize: 15,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#cffafe",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#0e7490",
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  saveButton: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cancelButton: {
    padding: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
});

export default AddCreditEntry;
