import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, TextInput, ScrollView } from "react-native";
import { Input, Button, Rating } from "react-native-elements";
import { useMyContextController } from "../context";
import Icon from "react-native-vector-icons/FontAwesome5";
import firestore from "@react-native-firebase/firestore";

const Review = ({ route, navigation }) => {
  const { orderId, orderData, orderDataProduct } = route.params;
  console.log('data review product:',orderDataProduct)
  console.log('data review orderdata:',orderData)

  const [controller, dispatch] = useMyContextController();
  const { userLogin, documentId } = controller;
  const [rating, setRating] = useState(5);
  const [ratingtransport, setRatingTransport] = useState(5);
  const [ratingservice, setRatingService] = useState(5);
  const [textrating, setTextRating] = useState("");
  const [textratingtransport, setTextRatingTransport] = useState("");
  const [textratingservice, setTextRatingService] = useState("");
  const [comment, setComment] = useState("");

  // Load dữ liệu
  useEffect(() => {
    // Các hành động khác bạn muốn thực hiện trong useEffect
  }, [orderData]);

  // Hàm render dynamic view container tương ứng với số lượng sản phẩm trong orderData
  const renderProductReviewContainers = () => {
    return (
      <View style={styles.productReviewContainer}>
        {/* Product Info */}
        <View style={styles.productInfoContainer}>
          <View style={styles.productImageContainer}>
            <Image
              source={{ uri: orderDataProduct.imgProduct }} // Sửa source tại đây
              style={styles.productImage}
            />
          </View>
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{orderDataProduct.ProductName}</Text>
            <Text style={styles.productPrice}>{`Giá: ${orderDataProduct.price}đ`}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {renderQualityRating()}
          <TextInput
            placeholder="Nhập đánh giá của bạn..."
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={(text) => setComment(text)}
            style={styles.inputcomment}
          />

          {renderTransport()}
          {renderService()}
          <Button
            title="Hoàn thành"
            buttonStyle={styles.sendButton}
            onPress={handleSendReview}
          />
        </View>
      </View>
    );
  };

  const handleSendReview = async () => {
    try {
      const reviewData = orderDataProduct;
      const productid = reviewData.id.toString();
      const userId = orderData.userId;
      const username = orderData.userName;
      const dateCreated = new Date().toISOString();
  
      // Tạo object chứa thông tin đánh giá
      const newReview = {
        userId,
        username,
        rating,
        comment,
        dateCreated,
      };
  
      // Tạo tham chiếu đến tài liệu đánh giá
      const reviewRef = firestore().collection('Review').doc(productid);
      const reviewDoc = await reviewRef.get();
  
      if (reviewDoc.exists) {
        // Nếu tài liệu đã tồn tại, kiểm tra xem userId đã đánh giá chưa
        const reviewsArray = reviewDoc.data().Reviews || [];
  
        // Kiểm tra xem userId đã tồn tại trong mảng Reviews hay không
        const hasUserReviewed = reviewsArray.some((review) => review.userId === userId);
  
        if (hasUserReviewed) {
          // Nếu userId đã tồn tại, hiển thị thông báo và dừng lại
          Alert.alert("Bạn đã đánh giá sản phẩm này");
          return;
        }
  
        // Nếu userId không trùng với documentId, cập nhật mảng Reviews
        reviewRef.update({
          Reviews: firestore.FieldValue.arrayUnion(newReview),
        });
      } else {
        // Nếu tài liệu chưa tồn tại, tạo mới và thêm đánh giá vào mảng Reviews
        reviewRef.set({
          Reviews: [newReview],
        });
      }
  
      // Hiển thị thông báo khi đánh giá được gửi thành công
      Alert.alert("Đánh giá đã được gửi thành công");
  
      // Chuyển về trang trước đó hoặc thực hiện các hành động khác tùy thuộc vào yêu cầu của bạn
      navigation.goBack();
    } catch (error) {
      console.error("Error sending review:", error);
      Alert.alert("Đã xảy ra lỗi khi gửi đánh giá, vui lòng thử lại.");
    }
  };

  const renderQualityRating = () => {
    const qualityTexts = ["Tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"];
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>Chất lượng:</Text>
        <Rating
          type="custom"
          ratingCount={5}
          imageSize={25}
          showRating={false}
          onFinishRating={(value) => {
            setRating(value);
            setTextRating(qualityTexts[value - 1]);
          }}
          defaultRating={5} // Đặt giá trị mặc định là 5 sao
        />
        <Text style={styles.qualityText}>{textrating}</Text>
      </View>
    );
  };

  const renderTransport = () => {
    const qualityTexts = ["Tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"];
    return (
      <View 
      style={{
        borderTopWidth:0.5,
        borderColor:'grey',
        marginTop:10,
        paddingVertical:10
      }}>
        <Text style={styles.additionalDisplayText}>Vận chuyển và xử lý đơn hàng</Text>
        <View style={styles.additionalDisplay}>
        <Rating
          type="custom"
          ratingCount={5}
          imageSize={25}
          showRating={false}
          onFinishRating={(value) => {
            setRatingTransport(value);
            setTextRatingTransport(qualityTexts[value - 1]);
          }}
          defaultRating={5} // Đặt giá trị mặc định là 5 sao
        />
        <Text style={styles.qualityText}>{textratingtransport}</Text>
        </View>
        
        
      </View>
    );
  };

  const renderService = () => {
    const qualityTexts = ["Tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"];
    return (
      <View style={{
        borderTopWidth:0.5,
        borderColor:'grey',
        marginTop:10,
        paddingVertical:10
      }}>
        <Text style={styles.additionalDisplayText}>Dịch vụ người bán</Text>
        <View style={styles.additionalDisplay}> 
          <Rating
          type="custom"
          ratingCount={5}
          imageSize={25}
          showRating={false}
          onFinishRating={(value) => {
            setRatingService(value);
            setTextRatingService(qualityTexts[value - 1]);
          }}
          defaultRating={5} // Đặt giá trị mặc định là 5 sao
        />
        <Text style={styles.qualityText}>{textratingservice}</Text>
        </View>
        
        
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTextCenter}>Đánh giá sản phẩm</Text>
        <TouchableOpacity onPress={handleSendReview}>
          <Text style={styles.headerTextRight}>Gửi</Text>
        </TouchableOpacity>
      </View>
      {/* Dynamic Product Review Containers */}
      {renderProductReviewContainers()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... Styles đã định nghĩa trước đó

  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  headerTextLeft: {
    color: "black",
    fontSize: 16,
  },
  headerTextCenter: {
    fontSize: 18,
    color: 'black',
  },
  headerTextRight: {
    color: "red",
    fontSize: 16,
  },
  body: {
    flex: 1,
    padding:10
  },
  sendButton: {
    backgroundColor: "red",
    marginTop: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    
  },
  ratingText: {
    marginRight: 10,
    fontSize: 18,
  },
  qualityText: {
    marginLeft: 10,
    fontSize: 17,
  },
  // productinfo
  productInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  productImageContainer: {
    width: 100,
    height: 100,
    borderWidth: 0.3,
    borderColor:'grey'
  },
  productImage: {
    flex: 1,
    resizeMode: "cover",
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "green",
  },
  //input comment
  inputcomment:{
    borderWidth:0.7,
    borderColor:'grey',
    borderRadius:5,
    paddingLeft:15,
    backgroundColor:"#A9A9A9",
    fontSize:18,
    
  },
  //
  additionalDisplay: {
  flexDirection: "row",
  alignItems: "center",
  },
  additionalDisplayText: {
  
  fontSize: 18,
  fontWeight: "bold",
  color:'black',
  marginBottom: 10,
  },
  // Khác
  productReviewContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  productReviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Review;