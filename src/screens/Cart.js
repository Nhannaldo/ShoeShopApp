import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import { Checkbox } from 'react-native-paper';
import firestore from "@react-native-firebase/firestore";
import { useMyContextController} from '../context'
export default Cart = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
    const [controller, dispatch] = useMyContextController();
    const { userLogin, documentId } = controller;
    console.log(documentId);
  const truncateProductName = (name, maxLength) => {
    if (name && name.length > maxLength) {
      return name.substring(0, maxLength - 3) + "...";
    }
    return name;
  };
  console.log("sản phẩm bên cart:",products)

  useEffect(() => {
    const unsubscribe = firestore().collection('Cart').doc(documentId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const productData = snapshot.data();
          const productsArray = Object.entries(productData).map(([productId, productData]) => 
          {
            return {
              id: productId,
              ...productData,
            };
          });
          setProducts(productsArray);
          //updateTotalAmount(productData);
        } else {
          console.log('No such document!');
        }
      });

    // Cleanup function to unsubscribe from the snapshot listener
    return () => unsubscribe();
  }, [documentId]);

  

   // Checkbox
   const handleCheckboxToggle = (id, price, quantity) => {
    const isSelected = selectedItems.includes(id);

    if (isSelected) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
      setTotalAmount((prevTotal) => prevTotal - price * quantity);
    } else {
      setSelectedItems([...selectedItems, id]);
      setTotalAmount((prevTotal) => prevTotal + price * quantity);
    }
  };
  // hàm checkbox tất cả
  const handleSelectAll = () => {
    const allProductIds = products.map((item) => item.id);

    if (selectedItems.length < allProductIds.length) {
      // Chọn tất cả sản phẩm
      setSelectedItems(allProductIds);
      setTotalAmount(
        products.reduce((sum, item) => sum + item.price * item.Quantity, 0)
      );
    } else {
      // Bỏ chọn tất cả sản phẩm
      setSelectedItems([]);
      setTotalAmount(0);
    }
  };
  // hàm click vào thanh toán
  const handlePlaceOrder = () => {
    if (selectedItems.length > 0) {
      const selectedProducts = products.filter(item =>
        selectedItems.includes(item.id)
      );
      
      navigation.navigate('CheckOut', { selectedProducts, totalAmount });
    } else {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
    }
  };

  // Delete

  const handleDeleteProduct = (id) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      [
        {
          text: 'Không',
          style: 'cancel',
        },
        {
          text: 'Có',
          onPress: async () => {
            try {
              // Truy cập vào collection "Cart" và document tương ứng với "documentId"
              const cartRef = firestore().collection('Cart').doc(documentId);
  
              // Sử dụng hàm update để cập nhật dữ liệu trong document
              await cartRef.update({
                [id]: firestore.FieldValue.delete(),
              });
  
              console.log('Sản phẩm đã được xóa thành công!');
            } catch (error) {
              console.error('Lỗi xóa sản phẩm:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // hàm tăng giảm số lượng

  const handleIncrementQuantity = async (id, price, quantity) => {
    try {
      const cartRef = firestore().collection('Cart').doc(documentId);
  
      // Tăng số lượng sản phẩm trong giỏ hàng
      await cartRef.update({
        [`${id}.Quantity`]: firestore.FieldValue.increment(1),
      });
  
      // Kiểm tra xem sản phẩm đã được chọn trước khi cập nhật tổng số tiền
      if (selectedItems.includes(id)) {
        
        setTotalAmount((prevTotall) => prevTotall + price);
        
      }
  
      console.log('Số lượng sản phẩm đã được tăng thành công!');
    } catch (error) {
      console.error('Lỗi tăng số lượng sản phẩm:', error);
    }
  };
  
  const handleDecrementQuantity = async (id, price, quantity) => {
    try {
      const cartRef = firestore().collection('Cart').doc(documentId);
  
      // Giảm số lượng sản phẩm trong giỏ hàng
      await cartRef.update({
        [`${id}.Quantity`]: firestore.FieldValue.increment(-1),
      });
  
      // Kiểm tra xem sản phẩm đã được chọn trước khi cập nhật tổng số tiền
      if (selectedItems.includes(id)) {
        setTotalAmount((prevTotal) => prevTotal - price);
      }
  
      console.log('Số lượng sản phẩm đã được giảm thành công!');
    } catch (error) {
      console.error('Lỗi giảm số lượng sản phẩm:', error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={styles.header_text}>Giỏ hàng</Text>
        </View>
      </View>

      {products.length === 0 ? (
        <View style={{flex:1,alignItems:"center", justifyContent:"center"}}>
          <Image source={require('../assets/images/giohangtrong.png')} style={{}}/>
          </View>
      ):(
        <FlatList
        data={products}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate("Details", { item })}>
              <View style={styles.itemContainer}>
              <Checkbox
                  status={selectedItems.includes(item.id) ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxToggle(item.id, item.price, item.Quantity)}
                  style={{marginRight: 50, alignSelf: "center" }}
              />
                <Image source={{ uri: item.imgProduct }} style={styles.avatar} />
                <View style={styles.content_container}>
                    <Text style={styles.content}>{truncateProductName(item.ProductName, 17)}</Text>
                    <Text style={{ color: "red", fontWeight: 'bold' }}>{item.price.toLocaleString('en-US')}đ</Text>
            
                    <View style={styles.quantityButtons}>
                        <TouchableOpacity onPress={() => {
                          if(item.Quantity>1){
                            handleDecrementQuantity(item.id, item.price, item.Quantity)
                          }
                          }}>
                            <Icon name="minus" size={15} color="grey" />
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10, color:'black',fontWeight:'bold' }}>{item.Quantity}</Text>
                        <TouchableOpacity onPress={() => {
                          if(item.Quantity>0){
                            handleIncrementQuantity(item.id, item.price, item.Quantity)
                          }
                            
                          }}>
                            <Icon name="plus" size={15} color="grey" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                  style={{ position: 'absolute', top: 5, right: 5 }}
                  onPress={() => handleDeleteProduct(item.id)}>
                  <Icon name="trash" size={20} color="grey" style={{marginRight:5, marginTop:5}}/>
                </TouchableOpacity>
                
              </View>
            </TouchableOpacity>
          );
        }}
      />
      )

      }
      


      {/* Filter Modal */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleSelectAll()}>
            <FontAwesomeIcons
                name={selectedItems.length === products.length ? "check-square-o" : "square-o"}
                size={20}
                color="#4B0082"
            />
            <Text>All</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>Tổng tiền: <Text style={{ color: 'red', fontWeight: 'bold' }}>{totalAmount.toLocaleString('en-US')}đ</Text></Text>
        <TouchableOpacity style={styles.orderButton} onPress={() => handlePlaceOrder()}>
          <Text style={styles.orderButtonText}>Mua hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 0.4,
    borderColor: 'grey'
  },
  headerTitle: {
    flex: 1,
    alignSelf: "center"
  },
  header_text: {
    fontSize: 20,
    color: "black",
    alignSelf: "center"
  },
  itemContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginHorizontal: 10,
    padding: 16,
    marginTop: 16,
    borderRadius: 10,
    marginLeft: 10,
    borderWidth: 0.4,
    borderColor: 'grey'
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 10
  },
  content: {
    width: '85%',
    fontWeight: "bold",
    fontSize: 18,
    color:'black',
    marginBottom:7
  },
  content_container: {
    width: '100%',
    marginLeft: 18
  },
  text_star: {
    fontSize: 12,
    color: 'black',
    marginLeft: 5
  },
  //footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Màu nền của footer
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    borderTopWidth: 0.5
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // tăng giảm số lượng
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
});
