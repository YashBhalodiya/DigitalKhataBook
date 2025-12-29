import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

const AddCustomerModal = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [initialCredit, setInitialCredit] = useState('')

  const handleAddCustomer = () => {
    console.log('Adding customer:', { name, mobile, email, address, initialCredit })
    // Add your customer creation logic here
    router.replace('/(shop-owner)/dashboard')
  }

  const handleCancel = () => {
    router.replace('/(shop-owner)/dashboard')
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Add New Customer</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter customer name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter address"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Initial Credit Amount (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="₹ 0"
                value={initialCredit}
                onChangeText={setInitialCredit}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAddCustomer}
              >
                <Text style={styles.addButtonText}>Add Customer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    padding: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    paddingLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#000',
    padding: 14,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
})

export default AddCustomerModal
