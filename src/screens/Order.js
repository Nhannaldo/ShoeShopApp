import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import firestore from "@react-native-firebase/firestore";
import { useMyContextController} from '../context'
const Order = ({navigation,route }) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin, documentId } = controller;
  const [activeTab, setActiveTab] = useState("Chờ xác nhận");
  const [orders, setOrders] = useState([]);
  //const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const updateOrders = (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isCancelable: doc.data().Status === "Chờ xác nhận",
      }));
      setOrders(ordersData);
    };

    const unsubscribe = firestore()
      .collection("Bill")
      .where("userId", "==", documentId)
      .where("Status", "==", activeTab) // Thêm điều kiện lọc theo trạng thái
      .onSnapshot(updateOrders);

    return () => unsubscribe();
  }, [documentId, activeTab]);

  // đánh giá
  const handleReviewOrder = (orderId, orderData, orderDataProduct) => {
    // Thực hiện các bước cần thiết khi đánh giá đơn hàng
    console.log(`Đánh giá đơn hàng #${orderId}`);
    navigation.navigate('Review',{ orderId, orderData, orderDataProduct })
  };
  const handleCancelOrder = async (orderId) => {
    try {
      // Update the status in Firestore to "Đã hủy"
      await firestore().collection("Bill").doc(orderId).update({
        Status: "Đã hủy",
      });

      // Log success message or handle further actions if needed
      console.log(`Đã hủy đơn hàng #${orderId}`);

      // Optionally, you can refresh the orders by querying Firestore again
      // or updating the local state.
    } catch (error) {
      console.error("Error cancelling order:", error);
      // Handle errors, show an alert, etc.
    }
  };

  // date time
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return `${formattedDate}`;
  };
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
        <Text style={styles.orderDate}>{formatDate(item.DateCreate)}</Text>
      </View>
      <FlatList
        data={item.Products}
        keyExtractor={(product) => product.productId}
        renderItem={({ item: product, index }) => (
            <View style={styles.productItem}>
            <Image source={{ uri: product.imgProduct }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text>{product.ProductName}</Text>
              <Text>{`${product.price.toLocaleString('en-US')}đ x ${product.Quantity}`}</Text>
            </View>
            {item.Status === 'Đã giao' && (
            <TouchableOpacity onPress={() => handleReviewOrder(item.id, item, item.Products[index])}>
              <Text style={styles.reviewButton}>Đánh giá</Text>
            </TouchableOpacity>
          )}
          </View>
        )}
      />
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>{`Tổng cộng: ${item.total.toLocaleString('en-US')}đ`}</Text>
        <Text style={styles.orderStatus}>{item.Status}</Text>
        {item.isCancelable ? (
    <TouchableOpacity onPress={() => handleCancelOrder(item.id)}>
      <Text style={styles.cancelButton}>Hủy đơn</Text>
    </TouchableOpacity>
  ) : (
    <></>
  )}
      </View>
    </View>
  );

  const renderTab = (tabTitle) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tabTitle && styles.activeTab]}
      onPress={() => setActiveTab(tabTitle)}
    >
      <Text style={styles.tabText}>{tabTitle}</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTextLeft}>Đơn mua</Text>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <FontAwesomeIcons name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {renderTab("Chờ xác nhận")}
        {renderTab("Chờ giao hàng")}
        {renderTab("Đã giao")}
        {renderTab("Đã hủy")}
      </View>

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        renderItem={renderOrderItem}
      />

      {/* Hiển thị thông báo nếu không có hóa đơn */}
      {orders.length === 0 && <Text>Không có hóa đơn nào.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
  },
  headerLeft: {},
  headerTextLeft: {
    color: "black",
    fontSize: 20,
  },
  headerRight: {
    padding: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    marginBottom: 20,
    borderBottomWidth: 0.3,
    borderColor: "grey",
  },
  tab: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    color: "black",
  },
  activeTab: {
    borderBottomColor: "red",
  },
  orderItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft: 10,
    marginRight: 10,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderId: {
    fontWeight: "bold",
  },
  orderDate: {
    color: "#777",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  productImage: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderWidth:0.3,
    borderColor:'grey'
  },
  productInfo: {
    flex: 1,
  },
  cancelButton: {
    color: "red",
    fontWeight: "bold",
  },
  reviewButton:{
    color: "red",
    fontWeight: "bold",
  },
  //footer
  orderFooter: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderTotal: {
    fontWeight: "bold",
  },
  orderStatus: {
    color: "green",
  },
});

export default Order;

//


