import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal
} from 'react-native'
import Rating from "../components/Rating";
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icons from 'react-native-vector-icons/FontAwesome6'
import Colors from '../themes/Colors';
import firestore from "@react-native-firebase/firestore";

export default Product = ({ navigation }) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategoryProducts, setCurrentCategoryProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const onPressCategory = (categoryId) => {
    if (categoryId === 0) {
      setCurrentCategoryProducts(products);
    } else {
      const category = categories.find(category => category.id === categoryId);
      if (category) {
        const categoryProducts = products.filter(product => category.products.includes(product.id));
        setCurrentCategoryProducts(categoryProducts);
      }
    }
  };

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

  const handleFilterIconClick = () => {
    setIsFilterModalVisible(true);
  };

  //hàm sắp xếp tăng giảm
  const handleFilterSelection = (filterOption) => {
    setSelectedFilter(filterOption);
    setIsFilterModalVisible(false);

    if (filterOption === "Giá tăng dần") {
      const sortedProducts = [...currentCategoryProducts].sort((a, b) => a.price - b.price);
      setCurrentCategoryProducts(sortedProducts);
    } else if (filterOption === "Giá giảm dần") {
      const sortedProducts = [...currentCategoryProducts].sort((a, b) => b.price - a.price);
      setCurrentCategoryProducts(sortedProducts);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesSnapshot = await firestore().collection('Category').get();
        const categoriesData = categoriesSnapshot.docs.map(doc => doc.data());
        setCategories(categoriesData);

        const productSnapshot = await firestore().collection('Products').get();
        const productData = productSnapshot.docs.map(doc => doc.data());
        setProducts(productData);
        setCurrentCategoryProducts(productData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          {searchVisible ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập tên sản phẩm..."
                onChangeText={handleSearch}
                value={searchQuery}
              />
              <TouchableOpacity onPress={handleBackSearchIconClick} >
                <Icons name="xmark" size={20} color="black" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.header_text}>Sản phẩm</Text>
          )}
        </View>
        <View style={styles.headerIcons}>
          {!searchVisible && (
            <TouchableOpacity onPress={handleSearchIconClick}>
              <Icon name="search" size={20} color="black" style={styles.icon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleFilterIconClick()}>
            <Icon name="filter" size={20} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerFilter}>
        <Text style={styles.fitler_text}>Category</Text>
        <ScrollView horizontal={true} style={styles.list} showsHorizontalScrollIndicator={false}>
          {categories.map((item, index) => {
            return (
              <TouchableOpacity key={index} style={styles.item} onPress={() => onPressCategory(item.id)}>
                <Text style={styles.text_star}>{item.categoryName}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
          <ScrollView>

          
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
      </ScrollView>
      <Modal visible={isFilterModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn bộ lọc</Text>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleFilterSelection("Giá tăng dần")}
            >
              <View style={styles.radioButton}>
                {selectedFilter === "Giá tăng dần" && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
              <Text>Giá tăng dần</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleFilterSelection("Giá giảm dần")}
            >
              <View style={styles.radioButton}>
                {selectedFilter === "Giá giảm dần" && (
                  <View style={styles.radioInnerCircle} />
                )}
              </View>
              <Text>Giá giảm dần</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterOption, styles.cancelOption]}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Icon name="times" size={20} color="black" style={styles.cancelIcon} />
              <Text>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
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
    color: 'black',
    alignSelf: 'flex-start',
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
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  content: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 18,
    paddingVertical: 5,
  },
  content_container: {
    width: '100%',
    marginLeft: 18,
  },
  containerFilter: {
    paddingLeft: 15,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  list: {
    marginLeft: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 5,
    backgroundColor: Colors.white,
    marginRight: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 10,
    },
    borderWidth:0.6,
    borderColor:'grey'
  },
  text_star: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 5,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200, // Adjust the width as needed
    paddingTop: 60, // Adjust the paddingTop to position the content below the header
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
  cancelOption: {
    justifyContent: 'flex-end',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  cancelIcon: {
    marginRight: 10,
  },
});

