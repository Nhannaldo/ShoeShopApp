import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, Image, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet } from 'react-native';
import Colors from "../themes/Colors";
import Images from "../themes/Images";
import ListItem from "../components/ListItem";
import Rating from "../components/Rating";
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useMyContextController} from '../context'
import firestore from "@react-native-firebase/firestore";
import ItemReview from "../components/ItemReview";
export default Details = ({ navigation, route })=> {

    const LineDivider = () => {
        return (
            <View style={{
                width: 1,
                height: '80%',
                backgroundColor: "grey",
                marginHorizontal: 10,
            }}></View>
        )
    }
    // review
    const [reviews, setReviews] = useState([]);
    
  const {item} = route.params;
  console.log('Item ID:', item.id);
  const [controller, dispatch] = useMyContextController();
  const { userLogin, documentId } = controller;
  console.log(documentId);
  const addToCart = async () => {
    if (userLogin) {
        try {
            const cartRef = firestore().collection('Cart').doc(documentId);
            const cartDoc = await cartRef.get();
        
            if (!cartDoc.exists) {
             
              // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới
              cartRef.set({
                [item.id]:{
                    ProductName: item.ProductName,
                    price: item.price,
                    Rating: item.Rating,
                    Sellnumber: item.Sellnumber,
                    imgProduct: item.imgProduct,
                    productdescribe: item.productdescribe, 
                    Quantity: 1
                  }
              });
            } else {
              // Nếu giỏ hàng đã tồn tại, kiểm tra sản phẩm đã có hay chưa
              const cartData = cartDoc.data();
        
              if (cartData[item.id]) {
                const newQuantity = cartData[item.id].Quantity + 1;
                //const newPrice = product.price * newQuantity;
                // Nếu sản phẩm đã có trong giỏ, tăng số lượng lên 1
                cartRef.update({
                  // [`${product.id}.quantity`]: cartData[product.id].quantity + 1,
                  // [`${product.id}.price`]: cartData[product.id].price * cartData[product.id].quantity,
                  [`${item.id}.Quantity`]: newQuantity,
                  //[`${product.id}.price`]: newPrice,
                });
              } else {
                // Nếu sản phẩm chưa có trong giỏ, thêm mới với số lượng là 1
                cartRef.update({
                    [item.id]:{
                        ProductName: item.ProductName,
                        price: item.price,
                        Rating: item.Rating,
                        Sellnumber: item.Sellnumber,
                        imgProduct: item.imgProduct,
                        productdescribe: item.productdescribe, 
                        Quantity: 1
                      }
                });
              }
            }
            // Hiển thị thông báo hoặc thực hiện các hành động khác nếu cần
            Alert.alert('Thông báo', 'Sản phẩm đã được thêm vào giỏ hàng.');
          } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            // Xử lý lỗi hoặc hiển thị thông báo lỗi cho người dùng
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.');
          }
    } else {
      console.log('Người dùng chưa đăng nhập. Không thể kiểm tra giỏ hàng.');
    }
  };
  const handleBuyNow = () => {
    navigation.navigate('CheckOut', {
      selectedProducts: [{ ...item, Quantity: 1 }], // Chuyển danh sách sản phẩm đã chọn với số lượng
      totalAmount: item.price, // Chuyển tổng giá trị của đơn hàng
    });
  };
  return (
    
    <View style={styles.container}>
        <View style={styles.top_content}>
            <View style={styles.top_bar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='arrow-left' size={20} />
                </TouchableOpacity>
                
            </View>
            <View style={styles.item}>
            <Image
                source={{uri: item.imgProduct}}
                style={{width: 250, height: 200}}
                onError={(error) => console.error('Image error:', error)}
            />
            </View>
            <View style={styles.dot_container}>
                <View style={[styles.dot, { backgroundColor: Colors.dot }]} />
            </View>
        </View>
        <View style={styles.details}>
                    <Text style={styles.title}>{item.ProductName} </Text>
                    <Text style={styles.price}>{item.price.toLocaleString('en-US')} đ</Text>
                    <View style={styles.star_container}>
                        <Rating rate={item.Rating}/>
                        <Text style={{color:'black',paddingHorizontal:10}}>{item.Rating}</Text>
                        
                        <LineDivider/>
                        <Text style={{color:'black'}}>Đã bán {item.Sellnumber}</Text>
                        {/* <Text>{item.Inventorynumber}</Text> */}
                    </View>
                    
        </View>
                <TouchableOpacity style={styles.description} onPress={() => navigation.navigate('Description',{item})}>
                    <Text style={styles.description_text}>See Description</Text>
                    <Icon name='arrow-right' size={20}/>
                </TouchableOpacity>
                {/* <ListItem data={productData} title="RELATED PRODUCT" style={styles.list} />
                <ListItem data={productData} title="RELATED PRODUCT" style={styles.list} /> */}
        
    
      
        <ItemReview productId={item.id.toString()} />
        
        <View style={styles.bottom_container}>
            <View style={styles.column}>
                <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={addToCart}>
                    <Text style={styles.buttonText}>THÊM GIỎ HÀNG</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.column}>
                <TouchableOpacity style={[styles.button, styles.redButton]} onPress={handleBuyNow}>
                    <Text style={styles.buttonText}>MUA HÀNG</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}

var { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        //paddingBottom: 50,//
    },
    top_content: {
        //paddingBottom: 10,//
        backgroundColor: Colors.white_gray,
    },
    item: {
        alignSelf: 'center'
    },
    top_bar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width - 64,
        marginHorizontal: 30,
        top: 18,
        zIndex: 2
    },
    top_bar_left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    top_bar_right: {
        flexDirection: 'row',
    },
    share: {
        marginLeft:20
    },
    dot_container: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 15,
        width: width - 32,
        justifyContent: 'center'
    },
    dot: {
        height: 7,
        width: 7,
        borderRadius: 4,
        marginHorizontal: 4
    },
    details: {
        marginTop: 20,
        marginHorizontal: 16,
        paddingVertical:8
    },
    star_container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    star: {
        marginHorizontal: 1
    },
    rating: {
        flexDirection: 'row'
    },
    text_review: {
        fontSize: 14,
        color: Colors.purple,
        marginLeft: 15
    },
    price: {
        fontSize: 18,
        color: '#ee4d2d',
        marginTop: 20,
        fontWeight: "bold"
    },
    description: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop:20
    },
    list: {
        marginTop: 30
    },
    //
    bottom_container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.white,
        paddingTop: 12,
        shadowColor: Colors.black,
        shadowOffset: {
            height: -2
        },
        shadowOpacity: 0.2,
        zIndex: 1,
        width: width
    },
    column: {
        flex: 1,
    },
    button: {
        paddingVertical: 16,
        alignItems: 'center',
        width: '100%',
    },
    greenButton: {
        backgroundColor: 'green',
    },
    redButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
    },
    modal_container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    content: {
        backgroundColor: Colors.white,
        width: width,
        height: height * 0.6,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingTop: 40
    },
    row_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16
    },
    left_row: {
        flexDirection: 'row'
    },
    left_text: {
        fontSize: 12,
        color: Colors.gray_5f,
        marginLeft: 10
    },
    title: {
        fontSize: 20,
        color: Colors.text,
        fontWeight: 'bold'
    },
    border_check: {
        height: 20,
        width: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.border_check
    },
    color_container: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 30
    },
    color_border: {
        height: 32,
        width: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    border_container: {
        height: 44,
        borderRadius: 10,
        width: 44,
        justifyContent: 'center',
        alignItems: 'center'
    },
    apply_text: {
        color: Colors.black_text,
        fontSize: 16
    },
    apply: {
        backgroundColor: Colors.yellow,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 50,
        width: width - 48,
        alignSelf:'center',
        paddingVertical:16,
        borderRadius:10
    }
})
