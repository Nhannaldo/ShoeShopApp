import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Rating from "../components/Rating";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../themes/Colors';
import firestore from "@react-native-firebase/firestore";

export default Category = ({ navigation, route }) => {
  const { item } = route.params;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentCategoryProducts, setCurrentCategoryProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories data
        const categoriesSnapshot = await firestore().collection('Category').get();
        const categoriesData = categoriesSnapshot.docs.map(doc => doc.data());

        // Fetch Products data
        const productSnapshot = await firestore().collection('Products').get();
        const productData = productSnapshot.docs.map(doc => doc.data());

        const category = categoriesData.find(category => category.id === item.id);
        if (category) {
          const categoryProducts = productData.filter(product => category.products.includes(product.id));
          setCurrentCategoryProducts(categoryProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.header_text}>Category</Text>
        </View>
      </View>

      {/* Render products in two columns */}
      <View style={styles.rowContainer}>
        {currentCategoryProducts.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() => navigation.navigate("Details", { item })}
          >
            <Image source={{ uri: item.imgProduct }} style={styles.avatar} resizeMode="cover" />
            <View style={styles.content_container}>
              <Text style={styles.content}>{item.ProductName}</Text>
              <Rating rate={item.Rating} />
              <Text style={{ color: "red", fontWeight: 'bold' }}>{item.price.toLocaleString('en-US')}đ</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filter Modal */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  header: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth:0.5,
    borderColor:'grey'
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure the input and xmark icon have space
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    width: '80%', // Adjust the width as needed
  },
  icon: {
    marginLeft: 17,
  },
  header_text: {
    fontSize: 20,
    color: "black",
    alignSelf: "flex-start"
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  itemContainer: {
    backgroundColor: Colors.white,
    width: '48%', // Adjust the width as needed
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: 'grey',
    overflow: 'hidden',
    paddingVertical:5,
    paddingHorizontal:5,
    alignItems:'center'
  },
  avatar: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    
  },
  content: {
    width: '100%',
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical:5,
  },
  content_container: {
    width: '100%',
    marginLeft: 18,
  },
});
