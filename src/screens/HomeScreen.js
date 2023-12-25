import React, { useEffect, useRef, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import Images from "../themes/Images";
import Colors from "../themes/Colors";
import ListItem from "../components/ListItem";
import Icon from 'react-native-vector-icons/FontAwesome'
import firestore from "@react-native-firebase/firestore"

const HomeScreen = ({ navigation }) => {
    
    const [toggleSearchBar, setToggleSearchBar] = useState(false);

    //khai báo lấy dữ liệu
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [orderproducts, setOrderProducts] = useState([]);

    // khai báo search
    const [search, setSearchQuery] = useState('');

    //hàm chuyển hướng truyền tìm kiếm
    const handleSearch = () => {
        navigation.navigate('Search', { search });
    };

    //hàm khi dê chuột hiện tab bar
    const handleScroll = (event) => {
        if (event.nativeEvent.contentOffset.y > 30 && !toggleSearchBar) {
            setToggleSearchBar(true);
        } else if (event.nativeEvent.contentOffset.y <= 30 && toggleSearchBar) {
            setToggleSearchBar(false);
        }
    };
    useEffect(() => {
        // Fetch categoryies data
        const fetchCategoriesData = async () => {
            const categoriesSnapshot = await firestore().collection('Category').get();
            const categoriesData = categoriesSnapshot.docs.map(doc => doc.data());
            // Lọc ra những danh mục có id > 0
            const filteredCategoriesData = categoriesData.filter(category => category.id > 0);
            setCategories(filteredCategoriesData);
            
          };
          fetchCategoriesData();
        // Fetch Products data
        const fetchProductsData = async () => {
            const productSnapshot = await firestore().collection('Products').get();
            const productData = productSnapshot.docs.map(doc => doc.data());
            // Lọc ra những sản phẩm có id từ 1 đến 5
            const filteredProductData = productData.filter(product => product.id >= 5 && product.id <= 10);
            const sortedProductData = productData.sort((a, b) => b.Sellnumber - a.Sellnumber);

        // Take the top 5 products
        const top5ProductsData = sortedProductData.slice(0, 5);
        
        // Set the state with the top 5 products
        setOrderProducts(top5ProductsData);
            //const filteredOrderProductData = productData.filter(product => product.id > 5 && product.id <= 10);
            //setOrderProducts(filteredOrderProductData)
            setProducts(filteredProductData);
        };
        fetchProductsData();
      }, []);
    return (
        <View style={styles.view_container}>
            {toggleSearchBar && (
                <View style={[styles.searchBar, { backgroundColor: Colors.white }]}>
                    <View style={[styles.search_container, { backgroundColor: Colors.gray_search }]}>
                        <TouchableOpacity onPress={handleSearch}>
                            <Icon name='search' style={{fontSize: 20}}/>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.text_input}
                            placeholder="Nhập từ khóa tìm kiếm..."
                            onChangeText={(text)=>setSearchQuery(text)}
                            value={search}
                        />
                    </View>
                    {/* <TouchableOpacity>
                        <Icon name='shopping-cart' style={{fontSize: 20}}/>
                    </TouchableOpacity> */}
                </View>
            )}
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                onScroll={(event) => handleScroll(event)}
                scrollEventThrottle={16}
            >
                <ImageBackground source={Images.line_bg} style={styles.line_bg}>
                    <View style={styles.top_container}>
                        <View style={styles.search_container}>
                            <TouchableOpacity onPress={handleSearch}>
                                <Icon name='search' style={{fontSize: 20}}/>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.text_input}
                                placeholder="Nhập từ khóa tìm kiếm..."
                                placeholderTextColor={Colors.white}
                                onChangeText={(text)=>setSearchQuery(text)}
                                value={search}
                            />
                        </View>
                        
                    </View>
                    <View style={styles.carousel_container}>
                
                    <Image source={require('../assets/images/slide1.jpg')} style={{width:380, alignSelf: "center", borderRadius:15, height:197}}/>
        
                    </View>
                </ImageBackground>
                <View style={styles.content_container}>
                    <ListItem title="CATEGORIES" data={categories} type={2} />
                    <ListItem title="SẢN PHẨM MỚI" data={products} style={{ marginTop: 20 }}/>
                    <ListItem title="SẢN PHẨM BÁN CHẠY" data={orderproducts} style={{ marginTop: 30 }} />
                    <View style={{ height: 50 }} />
                </View>
            </ScrollView>
        </View>
    );
};

// Phần styles và export không thay đổi

var { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
    view_container:{
        flex:1
    },
    container: {
        flex: 1,
        backgroundColor: Colors.blue_bg
    },
    line_bg: {
        height: height * 0.38
    },
    top_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 16
    },
    search_container: {
        flexDirection: 'row',
        backgroundColor: Colors.blue_search,
        paddingHorizontal: 16,
        borderRadius: 7,
        width: '100%',
        alignItems: "center"
    },
    text_input: {
        marginLeft: 10
    },
    carousel_container: {
        marginTop: 7,
        alignSelf: 'center',
    },
    carousel_item: {
        flexDirection: 'row',
        borderRadius: 15,
        padding: 16,
        marginHorizontal: 16,
        height: 125
    },
    carousel_item_left: {
    },
    carousel_title: {
        width: '65%',
        fontSize: 14,
        fontWeight: 'bold'
    },
    carousel_content: {
        width: '65%',
        fontSize: 10,
        marginTop: 5
    },
    carousel_img: {
        position: 'absolute',
        right: 10
    },
    get_now: {
        borderRadius: 3,
        backgroundColor: Colors.yellow,
        marginTop: 10
    },
    text_get_now: {
        fontSize: 9,
        paddingHorizontal: 12,
        paddingVertical: 8
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
    content_container:{
        backgroundColor: Colors.white,
        shadowColor:Colors.blue_bg,
        shadowOffset:{
            height:-20
        },
        shadowRadius:5,
        shadowOpacity:1,
        marginTop:-30,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        paddingVertical:16
    },
    horizontal_container:{
        marginLeft:16,
        marginTop:12, 
    },
    item:{
        backgroundColor: Colors.white_gray,
        height:90,
        width:119,
        marginRight:16,
        justifyContent:"center",
        alignItems:'center',
        borderRadius:15
    },
    header_list:{
        flexDirection:"row",
        justifyContent:'space-between',
        paddingHorizontal:16
    },
    header_list_left:{
        fontSize:14,
        color: Colors.black_text
    },
    header_list_right:{
        fontSize:12,
        color: Colors.purple
    },
    product_item:{
        width:138,
        height:100,
        backgroundColor: Colors.white_gray,
        marginRight:16,
        borderTopRightRadius:15,
        borderTopLeftRadius:15
    },
    name:{
        marginTop:8,
        fontSize:14,
        color:Colors.black_text,
        fontWeight:'bold',
        marginLeft:8
    },
    price:{
        marginTop:8,
        marginLeft:8,
        fontSize:14,
        color: Colors.ogran
    },
    searchBar:{
        position:'absolute',
        backgroundColor: Colors.white,
        zIndex:1,
        width:width,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:16
    }
});

export default HomeScreen;
