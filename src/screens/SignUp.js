import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState("");

  // Thêm state để theo dõi lỗi cho từng trường
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const handleSignup = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    // Xóa thông báo lỗi cũ khi người dùng thử lại
    clearErrors();

    let errorCount = 0; // Biến đếm lỗi

    if (!email.trim() || !password.trim() || !confirmpassword.trim() || !username.trim() || !address.trim() || !phoneNumber.trim()) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Email không đúng định dạng!");
      errorCount++;
    }

    if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự!");
      errorCount++;
    }

    if (confirmpassword !== password) {
      setConfirmPasswordError("Mật khẩu không khớp");
      errorCount++;
    }
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Số điện thoại phải là số và chứa đúng 10 ký tự!");
      errorCount++;
    }

    // Thực hiện kiểm tra ràng buộc cho các trường khác (ví dụ: kiểm tra độ dài tên, ...)
    // Cập nhật state lỗi nếu có lỗi

    if (errorCount > 0) {
      // Hiển thị thông báo hoặc thực hiện hành động tương ứng khi có lỗi
      return;
    }

    try {
      // Đăng ký bằng email password
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // Thêm email và các trường vào collection 'Users' với email làm ID của document
      await firestore().collection('Users').doc(email).set({
        address: address,
        phone: phoneNumber,
        username: username,
        // Các trường thông tin khác nếu cần
      });

      // Đăng nhập thành công, chuyển hướng đến trang đăng nhập
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Thông báo', error.message);
    }
  };

  // Hàm để xóa thông báo lỗi cũ
  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneNumberError("");
  };

  return (
    <ScrollView style={styles.container}>

      <View>
        <Text style={styles.headertext}>Register</Text>
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="alternate-email" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(""); // Xóa lỗi khi người dùng thay đổi giá trị
          }}
        />
      </View>
      <Text style={styles.errorText}>{emailError}</Text>

      {/**Usee name */}
      <View style={styles.inputContainer}>
        <Icon name="user-o" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <Text style={styles.errorText}>{}</Text>
      {/* Password */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => 
            { 
              setPassword(text);
              setPasswordError('');
            }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <SimpleLineIcons name="eye" size={20} color="#999" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.errorText}>{passwordError}</Text>

      {/* ... Các TextInput và các thành phần khác ... */}
      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmpassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError("");
          }}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <SimpleLineIcons name="eye" size={20} color="#999" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.errorText}>{confirmPasswordError}</Text>
      <View style={styles.inputContainer}>
        <SimpleLineIcons name="phone" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          keyboardType="numeric"
        />
      </View>
      <Text style={styles.errorText}>{phoneNumberError}</Text>
      <View style={styles.inputContainer}>
        <Icon name="map-marker" size={23} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
      </View>
      {/* Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Register</Text>
      </TouchableOpacity>

      <Text style={{alignSelf: 'center', marginTop: 20}}>Or, register with...</Text>
      
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
      <Text style={{color: "blue",textAlign: "center",margin: 15}} onPress={()=>navigation.navigate("Login")}>Already have an account?</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 100
  },
  headertext: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'black',
    alignSelf: 'center'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    
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
    marginTop: 20
  },
  signupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    color: "red",
    marginBottom: 0,
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
});

export default SignUp;
