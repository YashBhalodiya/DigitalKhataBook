import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {

    const router = useRouter();

    const addCustomer = () => {
        router.replace('/(shop-owner)/AddCustomerModal')
    }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shop Owner Dashboard</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Outstanding</Text>
          <Text style={styles.statValue}>₹ XX,XXX</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Number of Customers</Text>
          <Text style={styles.statValue}>XX</Text>
        </View>
      </View>

      {/* Quick Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={addCustomer}>
          <Text style={styles.actionButtonText}>Add Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Add Credit Entry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Monthly Summary</Text>
        </TouchableOpacity>
      </View>

     
      <View style={styles.viewSection}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View All Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>All Transactions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

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
  statsContainer: {
    marginBottom: 20,
  },
  statCard: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  viewSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  viewButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
})

export default Dashboard