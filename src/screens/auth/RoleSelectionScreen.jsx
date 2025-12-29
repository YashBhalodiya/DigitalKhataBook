import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RoleSelectionScreen = () => {

    const router = useRouter();

  const handleShopOwnerPress = () => {
    router.push('/(auth)/login')
  }

  const handleCustomerPress = () => {
    router.push('/(auth)/login')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>Choose how you want to use the app</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.roleButton} 
          onPress={handleShopOwnerPress}
        >
          <Text style={styles.roleTitle}>Login as Shop Owner</Text>
          <Text style={styles.roleSubtitle}>Manage customers and credit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.roleButton} 
          onPress={handleCustomerPress}
        >
          <Text style={styles.roleTitle}>Login as Customer</Text>
          <Text style={styles.roleSubtitle}>View your transactions</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    gap: 16,
  },
  roleButton: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    color: '#666',
  },
})

export default RoleSelectionScreen