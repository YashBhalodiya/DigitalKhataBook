import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';

const AddCreditEntry = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCustomers, setFetchingCustomers] = useState(true);

  
  const handleCancel = () => {
    router.replace('/(shop-owner)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add Credit Entry</Text>

        {/* Select Customer */}
        <Text style={styles.label}>Select Customer</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Customer Name" value="" />
            {customers.map((customer) => (
              <Picker.Item
                key={customer.id}
                label={customer.name}
                value={customer.id}
              />
            ))}
          </Picker>
        </View>

        {/* Date */}
        <Text style={styles.label}>Label</Text>
        <TextInput
          style={styles.input}
          placeholder="Date (DD/MM/YYYY)"
          value={date}
          onChangeText={setDate}
          placeholderTextColor="#999"
        />

        {/* Amount */}
        <Text style={styles.label}>Label</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount (₹)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholderTextColor="#999"
        />

        {/* Description */}
        <Text style={styles.label}>Label</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description / Items"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />

        {/* Buttons */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveEntry}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: '#fff',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default AddCreditEntry;
