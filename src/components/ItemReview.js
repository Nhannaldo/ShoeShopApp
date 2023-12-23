import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import firestore from "@react-native-firebase/firestore";
import Rating from "../components/Rating";
const ItemReview = ({ productId }) => {
  console.log('Id chính', productId)
  // Kiểm tra kiểu dữ liệu của productId
  // if (typeof productId !== 'string') {
  //   console.error('Invalid type for productId:', typeof productId);
  //   // Xử lý hoặc hiển thị thông báo lỗi cho người dùng
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.errorText}>Invalid productId type</Text>
  //     </View>
  //   );
  // }
  const [reviews, setReviews] = useState([]);
  console.log("Review:", reviews);
  useEffect(() => {
    const fetchReviews = () => {
      try {
        const reviewRef = firestore().collection('Review').doc(productId);
  
        // Subscribe to real-time updates
        const unsubscribe = reviewRef.onSnapshot((reviewSnapshot) => {
          if (!reviewSnapshot.exists) {
            console.log('No reviews available for this product.');
            return;
          }
  
          const reviewData = reviewSnapshot.data();
  
          if (reviewData && Array.isArray(reviewData.Reviews)) {
            setReviews(reviewData.Reviews);
          } else {
            console.log('Invalid format for reviews data.');
          }
        });
  
        // Return the unsubscribe function to clean up the subscription when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    // Call the fetchReviews function
    fetchReviews();
  }, [productId]);

  // hàm chuyển date time
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', options);
    const formattedTime = date.toLocaleTimeString('en-GB');
    return `${formattedDate} ${formattedTime}`;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá sản phẩm</Text>
      {reviews.length === 0 ? (
        <Text style={{paddingLeft:16}}>Chưa có đánh giá nào cho sản phẩm này.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              {/* Left column with image */}
              <View style={styles.reviewImageContainer}>
                <Image
                  source={require('../assets/images/avatar.png')}
                  style={styles.reviewImage}
                />
              </View>
              {/* Right column with user information */}
              <View style={styles.reviewInfoContainer}>
                <Text style={styles.reviewUsername}>{item.username}</Text>
                <Rating rate={item.rating} />
                <Text style={styles.reviewText}>{item.comment}</Text>
                <Text style={styles.reviewDate}>{formatDate(item.dateCreated)}</Text>
              </View>
            </View>
          )}
         
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  title: {
    fontSize: 18,
    color:'black',
    paddingVertical:18,
    paddingLeft:16,
    borderColor:'grey'
  },
  reviewItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 0.7,
    borderColor: '#ccc',
    
  },
  reviewText: {
    fontSize: 16,
  },
  reviewImageContainer: {
    marginRight: 12,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // một nửa của chiều rộng và chiều cao để tạo hình ảnh tròn
  },
  reviewInfoContainer: {
    flex: 1,
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default ItemReview;
