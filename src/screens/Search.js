import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, ScrollView } from 'react-native';
import Rating from "../components/Rating";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome6';
import Colors from '../themes/Colors';
import firestore from "@react-native-firebase/firestore";

export default Search = ({ navigation, route }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategoryProducts, setCurrentCategoryProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productSnapshot = await firestore().collection('Products').get();
        const productData = productSnapshot.docs.map(doc => doc.data());
        setProducts(productData);

        const { search } = route.params || {};
        setSearchQuery(search || '');

        const filteredProducts = filterProductsBySearchQuery(productData, search);
        setCurrentCategoryProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [route.params]);

  const handleSearchIconClick = () => {
    setSearchVisible(true);
  };

  const handleBackSearchIconClick = () => {
    setSearchVisible(false);
    setSearchQuery('');
    setCurrentCategoryProducts(products);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredProducts = products.filter(product => product.ProductName.toLowerCase().includes(query.toLowerCase()));
    setCurrentCategoryProducts(filteredProducts);
  };

  const filterProductsBySearchQuery = (products, searchQuery) => {
    if (!searchQuery) {
      return products;
    }

    const lowercaseSearchQuery = searchQuery.toLowerCase();
    //lọc sản phẩm tìm kiếm
    const filteredProducts = products.filter(product =>
      product.ProductName.toLowerCase().includes(lowercaseSearchQuery)
    );

    return filteredProducts;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          {searchVisible ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập tên sản phẩm..."
                onChangeText={handleSearch}
                value={searchQuery}
              />
              <TouchableOpacity onPress={handleBackSearchIconClick}>
                <Icons name="xmark" size={20} color="black" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.header_text}>Tìm kiếm</Text>
          )}
        </View>
        <View style={styles.headerIcons}>
          {!searchVisible && (
            <TouchableOpacity onPress={handleSearchIconClick}>
              <Icon name="search" size={20} color="black" style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView>
        <View style={styles.rowContainer}>
          {currentCategoryProducts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              onPress={() => navigation.navigate("Details", { item })}
            >
              <Image source={{ uri: item.imgProduct }} style={styles.avatar} />
              <View style={styles.content_container}>
                <Text style={styles.content}>{item.ProductName}</Text>
                <Rating rate={item.Rating} />
                <Text style={{ color: "red", fontWeight: 'bold' }}>{item.price.toLocaleString('en-US')}đ</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'grey'
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
    justifyContent: 'space-between',
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    width: '80%',
  },
  icon: {
    marginLeft: 17,
  },
  header_text: {
    fontSize: 20,
    color: "black",
    marginLeft: 10,
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
    width: '48%',
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 0.4,
    borderColor: 'grey',
    overflow: 'hidden',
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center'
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
    paddingVertical: 5,
  },
  content_container: {
    width: '100%',
    marginLeft: 18,
  },
});
