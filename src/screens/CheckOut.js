import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import Colors from '../themes/Colors';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useMyContextController} from '../context'
import  firestore from "@react-native-firebase/firestore";
import { Image } from 'react-native-elements';
const CheckOut = ({navigation, route}) => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin, documentId } = controller;
  const { selectedProducts, totalAmount} = route.params;
  const [products, setProducts] = useState([]);
  const [feeShip, setFeeShip] = useState(42000);
  const [total, setTotal] = useState(totalAmount + feeShip);
  const [countproduct, setCountProduct] = useState(0);

  console.log("Sản phẩm:", products)
  useEffect(() => {
    // Update state with the selected products
    setProducts(selectedProducts);

    const totalCount = selectedProducts.length;
    setCountProduct(totalCount);
    
  }, [selectedProducts, totalAmount]);

  const calculateTotalAmount = () => {
    return products.reduce((total, product) => total + product.price * product.Quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (userLogin) {
      try {
          // Thêm sản phẩm vào collection bills
          const billRef = firestore().collection("Bill").doc(); // Remove uid from here
          await billRef.set({
              userId: documentId, // Add the uid field with the user's ID
              userName: userLogin.username,
              userPhone: userLogin.phone,
              userAddress: userLogin.address,
              Products: products,
              total,
              Status: 'Chờ xác nhận',
              DateCreate: new Date().toISOString(),
          });

          // Xóa các sản phẩm đã thanh toán khỏi collection carts
          const cartRef = firestore().collection("Cart").doc(documentId);
          const updatedCart = products.reduce((cart, item) => {
              cart[item.id] = firestore.FieldValue.delete();
              return cart;
          }, {});
          await cartRef.update(updatedCart);
          // Cập nhật tổng tiền của giỏ hàng thành 0
          //await cartRef.update({ totalAmount: 0 });
          // Chuyển hướng về màn hình thành công hoặc màn hình khác cần thiết
          console.log('Số lượng sản phẩm đã được giảm thành công!');
          Alert.alert('Thông báo', 'Đặt hàng thành công.Bạn có thể vào đơn hàng để xem chi tiết!');
          navigation.goBack();
      } catch (error) {
          console.error("Lỗi khi tạo hóa đơn:", error);
      }
  }
  };

  return (
    <View style={styles.container}>
      {/* Content View */}
      <View style={{ flex: 1 }}>
        <ScrollView>
        <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    
                    <Text style={styles.header_text}>Thanh toán</Text>
                </View>
        </View>
      {/* Shipping Information */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
          {/* <TouchableOpacity style={{ flexDirection: 'row'}}>
            <Text style={{ color: 'black' }}>Cập nhật thông tin</Text>
            <Icons name='keyboard-arrow-right' size={20} color='#ccc' />
          </TouchableOpacity> */}
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={userLogin.username}
          
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={userLogin.address}
          
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          keyboardType="numeric"
          value={userLogin.phone}
          onChangeText={(text) => setShippingInfo({ ...shippingInfo, phoneNumber: text })}
        />
      </View>

      {/* Product List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        <FlatList
        nestedScrollEnabled={true} // enable nested scrolling
        //removeClippedSubviews={false} // prevent clipping content
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{flexDirection:'row'}}>
            <Image source={{uri:item.imgProduct}} style={{width:100, height:80}}/>
            <View style={{marginLeft:7}}>
              <Text style={{ color:'black'}}>{item.ProductName}</Text>
              <Text style={{paddingVertical:25}}>{`${item.price.toLocaleString('en-US')}đ x ${item.Quantity}`}</Text>
            </View>
            
            {/* Add more details as needed */}
          </View>
        )}
      />
      </View>

      {/* Shipping Method */}
      <View style={styles.section}>
        <Text style={{
            fontSize: 15,
            color:'green',
            marginBottom: 8,
            borderBottomWidth:0.2,
            borderColor:'grey',
            paddingVertical:5
        }}>Phương thức vận chuyển (Nhấn để chọn)</Text>
        
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                 <View>
                     <Text style={{fontSize:15,paddingVertical:10,color:'black'}}>Nhanh</Text>
                     <Text style={{fontSize:13}}>Nhận hàng vào 12Th12</Text>
                     <View style={{flexDirection:'row',alignItems:'center'}}>
                         <Icons name='check-circle' size={20} color='green'/>
                         <Text style={{fontSize:14,padding:10, color:'green'}}>Đã áp dụng miễn phí vận chuyển</Text>
                     </View>
                 </View>
                 <TouchableOpacity style={{flexDirection:'row'}}>    
                     <Text style={{color:'black'}}> {feeShip.toLocaleString('en-US')}đ</Text>
                     <Icons name='keyboard-arrow-right' size={20} color='#ccc'/>
                 </TouchableOpacity>
            </View>
        </View>

          {/* Total Amount */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 0.2,
            borderColor: 'grey',
            paddingLeft: 10,
            paddingVertical: 10,
          }}>
            <Text style={{
              fontSize: 15,
              color: 'black',
              marginBottom: 8,
            }}>Tổng số tiền ({countproduct} sản phẩm):</Text>
            <Text style={styles.totalAmount}>{`${calculateTotalAmount().toLocaleString('en-US')}đ`}</Text>
          </View>

          {/* Payment Method */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
            paddingVertical: 5
          }}>
            <Text style={{
              fontSize: 15,
              color: 'black',
            }}>Phương thức thanh toán</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'black', }}>Thanh toán khi nhận hàng</Text>
                <Icons name='keyboard-arrow-right' size={20} color='#ccc' />
              </TouchableOpacity>
              {/* You can add more payment methods here */}
            </View>
          </View>

          {/* Payment Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 14, color: 'grey' }}>Tổng tiền hàng:</Text>
              <Text style={{ fontSize: 14, color: 'black' }}>{`${calculateTotalAmount().toLocaleString('en-US')}đ`}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 14, color: 'grey' }}>Phí vận chuyển:</Text>
              <Text style={{ fontSize: 14, color: 'black' }}>{feeShip.toLocaleString('en-US')}đ</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 17, color: 'black' }}>Tổng thanh toán:</Text>
              <Text style={{ fontSize: 17, color: 'red' }}>{total.toLocaleString('en-US')}đ</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{alignItems:'flex-end', paddingHorizontal:10}}>
                <Text style={styles.totalAmountText}>Tổng thanh toán</Text>
                <Text style={styles.totalAmount1}>đ {total.toLocaleString('en-US')}</Text>
            </View>
          <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Đặt hàng</Text>
        </TouchableOpacity>
        </View>

        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:Colors.white,
  },
  header: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth:0.4,
    borderBlockColor:'grey'
    },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
    },
    header_text:{
        fontSize:20,
        fontWeight:'bold',
        color:'black'
    },
  section: {
    marginBottom: 5,
    marginLeft:10,
    marginTop:10,
    marginRight:10
  },
  sectionTitle: {
    fontSize: 15,
    color:'black',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.3,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'red',
    marginRight:5
  },
  placeOrderButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  //footer
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopWidth: 0.5,
    borderColor: 'grey',
  },
  totalAmountText: {
    fontSize: 14,
    color: 'black',
  },
  totalAmount1: {
    fontSize: 16,
    color: 'red',
    fontWeight:'bold'
  },
  placeOrderButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckOut;
