import React, { useEffect, useRef, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, TextInput, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import Images from "../themes/Images";
import Colors from "../themes/Colors";
import ListItem from "../components/ListItem";
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from'react-native-vector-icons/MaterialCommunityIcons'
import firestore from "@react-native-firebase/firestore"
import { useMyContextController, signOut} from '../context'
const Account = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin, documentId } = controller;
    const handleLogout = async () => {
        await signOut(dispatch, navigation);
      };
      useEffect(() => {
        if (!userLogin) {
          navigation.replace('Login');
        }
      }, [userLogin, navigation]);
    
    return (
        <ScrollView style={styles.view_container}>
            <View>
                
            </View>
            <ImageBackground  source={Images.background3} style={styles.line_bg}>
                <View style={styles.carousel_container}>
                    <View style={styles.avatarContainer}>
                        {/* Avatar */}
                        <Image source={require('../assets/images/avatar6.png')} style={styles.avatar} />

                        {/* Username */}
                        <Text style={styles.usernameText}>{userLogin ? userLogin.username : "Nguyen Nhan"}</Text>
                    </View>
                </View>
            </ImageBackground>

            <View style={styles.content_container}>
                {/* Hàng 1 */}
                <View style={{
                    borderWidth:0.5,
                    borderColor:'grey',
                    borderRadius:5,
                    margin:10
                }}>
                <View style={styles.rowContainer}>
                    <Icons name="email" size={17} color="#DC143C" />
                    <Text style={styles.userInfoText}>{documentId}</Text>
                    
                </View>
                <View style={styles.rowContainer}>
                    <Icon name="phone" size={17} color="#DC143C" />
                    <Text style={styles.userInfoText}>{userLogin ? userLogin.phone : "0123456789"}</Text>
                    
                </View>
                <View style={styles.rowContainer}>
                    <Icon name="map-marker" size={17} color="#DC143C" />
                    <Text style={styles.userInfoText}>{userLogin ? userLogin.address : "Binh Duong"}</Text>
                    
                </View>
                {/* <View style={styles.rowContainer}>
                    <Icon name="heart" size={17} color="#DC143C" />
                    <Text style={styles.userInfoText}>Yêu thích</Text>
                    <TouchableOpacity style={{}}>
                        <Icon name="angle-right" size={20} color='#DC143C'/>
                    </TouchableOpacity>
                </View> */}
                <View style={styles.rowContainer}>
                    <Icon name="lock" size={17} color="#DC143C" />
                    <Text style={styles.userInfoText}>Thay đổi mật khẩu</Text>
                    <TouchableOpacity style={{}} onPress={()=>navigation.navigate('ChangePassword')}>
                        <Icon name="angle-right" size={20} color='#DC143C'/>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            <View style={styles.content_container_1}>
                {/* Hàng 1 */}
                <View style={{
                    borderWidth:0.5,
                    borderColor:'grey',
                    borderRadius:5,
                    margin:10
                }}>
                
                <View style={styles.rowContainer_1}>
                    <Text style={styles.userInfoText_1}>About ShoeShop</Text>
                    <TouchableOpacity style={{}}>
                        <Icon name="angle-right" size={20} color='#DC143C'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowContainer_1}>
                    <Text style={styles.userInfoText_1}>FAQ</Text>
                    <TouchableOpacity style={{}}>
                        <Icon name="angle-right" size={20} color='#DC143C'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowContainer_1}>
                    <Text style={styles.userInfoText_1}>Terms & Conditions</Text>
                    <TouchableOpacity style={{}}>
                        <Icon name="angle-right" size={20} color='#DC143C'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowContainer_1}>
                    <Text style={styles.userInfoText_1}>Privacy Policy</Text>
                    <TouchableOpacity style={{}}>
                        <Icon name="angle-right" size={20} color='#DC143C'/>
                    </TouchableOpacity>
                </View>
                </View>


                {/* Các hàng khác nếu cần */}<TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
    >
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
    </TouchableOpacity>
            </View>
            
        </ScrollView>
    );
};

// Phần styles và export không thay đổi

var { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
    view_container:{
        flex:1,
        backgroundColor:'white'
    },
    line_bg: {
        height: height * 0.12
    },
    
    content_container:{
        flex: 1,
        backgroundColor: Colors.white,
        paddingVertical: 16,
        flexGrow: 1,  // Thêm dòng này,
    },
    // avatar
    carousel_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        marginLeft:10
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 35, // Nửa của chiều rộng và chiều cao
        marginRight: 16,
        
    },
    usernameText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        alignItems:'center'
    },
    // info
    content_container_1:{
        flex:2,
        backgroundColor: Colors.white,
        borderTopLeftRadius:20,
        borderTopRightRadius: 20,
        paddingVertical: 16,
        flexGrow: 1,  // Thêm dòng này,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  // Canh giữa các thành phần
        paddingHorizontal: 16,
        borderBottomWidth: 0.3,
        borderColor: 'grey',
        paddingVertical: 15,
    },
    
    userInfoText: {
        flex:1,
        fontSize: 16,
        paddingLeft:10,
        color:'#282828'
    },
    rowContainer_1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',  // Canh giữa các thành phần
        paddingHorizontal: 16,
        borderBottomWidth: 0.3,
        borderColor: 'grey',
        paddingVertical: 15,
    },
    
    userInfoText_1: {
        flex:1,
        fontSize: 16,
        paddingLeft:10,
        color:'#282828'
    },
    //
    logoutButton: {
        backgroundColor: '#A9A9A9', // Màu xám
        borderRadius: 5,
        marginHorizontal: 16,
        borderWidth:1,
        borderColor:'grey',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical:9,
        marginTop: 20,
    },
    logoutButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Account;
