import React,{ useState, useEffect} from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity ,Image, ScrollView} from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'
import { useMyContextController, login } from "../context"
export const Login = ({navigation})=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberPassword, setRememberPassword] = useState(false);
    // lấy dữ liệu user
    const [controller, dispatch] = useMyContextController();
    const {userLogin} = controller;
    useEffect(() => {
        console.log("useEffect triggered");
        if (userLogin !== null) 
        {
            navigation.replace("HomeScreen");
        }
        else{
          console.log("dữ liệu chưa có");
        }
      }, [userLogin]);
    const onSubmit =()=>{
        if (!email.trim() || !password.trim()) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        else{
            login(dispatch,email,password);
        }
        
    }
    return (
    <ScrollView style={styles.container}>

        <Image source={require('../assets/images/logo1.png')} style={{width:"55%", height:200, marginBottom:20, alignSelf: 'center'}}></Image>
      <View>
        <Text style={styles.headertext}>Login</Text>
      </View>
      {/* Email */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="alternate-email" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
         
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <SimpleLineIcons name="eye" size={20} color="#999" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.rememberContainer}>
        <TouchableOpacity
            style={{marginRight:10}}
            onPress={() => setRememberPassword(!rememberPassword)}>
                <FontAwesomeIcons
                    name={rememberPassword ? "check-square-o" : "square-o"}
                    size={20}
                    color={rememberPassword ? "#4B0082" : "#999"}
                />
        </TouchableOpacity>
        <Text style={styles.rememberText}>Nhớ mật khẩu</Text>
      </View>
      {/* Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={onSubmit}>
        <Text style={styles.signupButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={{alignSelf: 'center', marginTop: 20}}>Or, login with...</Text>
      {/* Social Icons */}
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIcon} onPress={()=>alert('Tính năng dự kiến phát triển...')}>
          <Image source={require('../assets/images/gg.png')} style={styles.socialIconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon} onPress={()=>alert('Tính năng dự kiến phát triển...')}>
          <Image source={require('../assets/images/face.png')} style={styles.socialIconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon} onPress={()=>alert('Tính năng dự kiến phát triển...')}>
          <Image source={require('../assets/images/twitter.png')} style={styles.socialIconImage} />
        </TouchableOpacity>
      </View>
      <Text style={{color: "blue",textAlign: "center",margin: 15}} onPress={()=>navigation.navigate("SignUp")}>Create a new account?</Text>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    
      backgroundColor:'white'
    },
    headertext:{
      fontWeight:'bold',
      fontSize:25,
      color:'black',
      alignSelf:'flex-start',
      marginBottom:20
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      borderBottomWidth: 1,
      borderColor: "#999",
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    icon: {
      
      marginRight: 10,
      color: 'black',
      width: 20, // Điều chỉnh chiều rộng của icon
      alignSelf: 'center',
    },
    input: {
      flex: 1,
      height: 45,
    },
    signupButton: {
      backgroundColor: "#4B0082",
      padding: 15,
      borderRadius: 5,
      alignItems: "center",
      marginTop:20
    },
    signupButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: 'bold'
    },
    // gg facebook, twitter
    socialIconsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
    },
    socialIcon: {
      borderWidth: 1,
      borderColor: "#999",
      borderRadius: 50,
      padding: 10,
    },
    socialIconImage: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    //rememberContainer
    rememberContainer:{
        flexDirection: 'row',
        paddingHorizontal: 5,
        marginTop:5
    }
  });