import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import styles from "./styles";
import { useNavigation } from '@react-navigation/native';
export default function ListItem({ title = "", data = [], type = 1, style, onPress }) {
    const navigation = useNavigation();
    const truncateProductName = (name, maxLength) => {
        if (name && name.length > maxLength) {
          return name.substring(0, maxLength - 3) + "...";
        }
        return name;
    };
      const navigateToDetails = (item) => {
        // Chuyển hướng sang trang Details và truyền dữ liệu thông qua tham số định tuyến
        navigation.navigate('Details', { item });
      };
      const navigateToCategory = (item) =>{
        navigation.navigate('Category', {item});
      }
    return (
        <View style={style}>
            <View style={styles.header_list}>
                <Text style={styles.header_list_left}>{title}</Text>
                {/* <TouchableOpacity>
                    <Text style={styles.header_list_right}>SEE ALL</Text>
                </TouchableOpacity> */}
            </View>
            <ScrollView horizontal={true} style={styles.horizontal_container} showsHorizontalScrollIndicator={false}>
                {data.map((item, index) => {
                    return (
                        <View key={index}>
                            {type === 1 ?
                                <TouchableOpacity style={{}} onPress={() => navigateToDetails(item)}>
                                    <View style={styles.product_item}>
                                        <Image source={{uri:item.imgProduct}} style={styles.avatar} />
                                    </View>
                                    <Text style={styles.name}>{truncateProductName(item.ProductName, 18)}</Text>
                                    <Text style={styles.price}>{item.price.toLocaleString('en-US')}đ</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={{borderWidth:0.5, borderColor:'grey', borderRadius:15,marginRight:10}} onPress={()=>navigateToCategory(item)}>
                                    <View style={styles.product_item_category}>
                                        <Image source={{uri:item.img}} style={styles.avatarcategory} />
                                    </View>
                                </TouchableOpacity>
                                
                            }
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}