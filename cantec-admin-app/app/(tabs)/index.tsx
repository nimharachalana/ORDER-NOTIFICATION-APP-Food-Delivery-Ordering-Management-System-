import { StyleSheet, Text, View, Alert, FlatList, ActivityIndicator, Platform } from "react-native";
import io from 'socket.io-client';
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen(){
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const BACKEND_URL = "http://192.168.8.139:4000";

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to show notifications was denied!');
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX, 
          vibrationPattern: [0, 250, 250, 250], 
          lightColor: '#FF231F7C',
        });
      }
    }
    requestPermissions();
  }, []);

  const sendNotification = async (orderDate: any) => {
    await Notifications.scheduleNotificationAsync({
      content:{
        title: "🍕 New Order Received!",
        body: `Amount: Rs. ${orderDate.amount} | Click to view details`,
        sound: 'default',
      },
      trigger: null,
    });
  };
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/order/list`);

      if (response.data.success) {
        setOrders(response.data.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = io(BACKEND_URL);

    socket.on("connect",() => {
      console.log("✅ App connected to Socket Server!");
    });

    socket.on("new-order-notification", (newOrder) => {
      console.log("🔔 New Order :", newOrder);

      setOrders((prevOrders) => [newOrder, ...prevOrders]);

      sendNotification(newOrder);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [])
  
  const renderOrderItem = ({ item }: {item: any}) => (
    <View style={styles.orderBox}>
      <View style={styles.headerRow}>
        <Text style={styles.orderId}>ID: ...{item._id.slice(-4)}</Text> 
        <Text style={[styles.status, {color: item.status === 'Delivered' ? 'green' : 'orange'}]}>
          {item.status}
        </Text>
      </View>

      <Text style={styles.amount}>Rs. {item.amount}.00</Text>

      <Text style={styles.details}>
        📅 {item.data ? new Date(item.data).toLocaleDateString() : 'N/A'} | 
        🕒 {item.data ? new Date(item.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
      </Text>

      <Text style={styles.address}>📍 {item.address?.firstName} - {item.address?.street}</Text>
      
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cantec Admin 👨‍🍳</Text>
      <Text style={styles.subtitle}>Real-time Order Feed</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1890ff" style={{marginTop:50}} />
      ) :(
        <FlatList
          data = {orders}
          keyExtractor={(item)=> item._id}
          renderItem = {renderOrderItem}
          contentContainerStyle = {styles.listContainer}

          refreshing = {refreshing}
          onRefresh = {onRefresh}

          ListEmptyComponent = {
            <Text style={styles.emptyText}>No order found yet.</Text>
          }
        />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop:50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle:{
    fontSize: 16,
    color: '#666',
    textAlign:'center',
    marginBottom: 20,
  },
  orderBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  listContainer:{
    paddingBottom: 20,
  },
  emptyText:{
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
  headerRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderId:{
    fontWeight: 'bold',
    color: '#555',
  },
  status:{
    fontSize: 14,
    fontWeight: 'bold',
  },
  amount:{
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: 5,
  },
  details:{
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  address:{
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

