import { StyleSheet, Text, View, Alert } from "react-native";
import io from 'socket.io-client';
import { useEffect, useState } from "react";

export default function HomeScreen(){
  const [lastOrder, setLastOrder] = useState<any>(null);
  
  useEffect(() => {
    const socket = io("http://192.168.8.139:4000"); // Replace with your server URL

    socket.on("connect", () => {
      console.log("✅ App connected to Socket Server!");
    });

    socket.on("new-order-notification", (orderData) => {
      console.log("🔔 New Order Received:", orderData);
      setLastOrder(orderData);
      Alert.alert(
        "New Order Received! 🍕",
        `Amount: Rs. ${orderData.amount}\nAddress: ${orderData.address?.street || 'No address'}}`
      );
    });

    return () => {
      socket.disconnect();
    };

  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cantec Admin App 👨‍🍳</Text>
      <Text style={styles.subtitle}>Waiting for orders...</Text>

      {lastOrder ?(
        <View style={styles.orderBox}>
          <Text style={styles.orderTitle}>Last Order Details:</Text>
          <Text>ID: {lastOrder._id}</Text>
          <Text>Amount: {lastOrder.amount}</Text>
          <Text>Status: {lastOrder.status}</Text>
        </View>
      ) : (
        <Text style={{marginTop: 20, color: 'gray'}}>No new orders yet.</Text>  
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle:{
    fontSize: 16,
    color: '#666',
  },
  orderBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1890ff',
  },
  orderTitle:{
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 18,
  }
});

