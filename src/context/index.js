import { createContext, useContext, useReducer, useMemo } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
// import PropTypes from "prop-types";
// Create MyContext
const MyContext = createContext();
// Setting custom name for the context 
MyContext.displayName = "MyContextContext";
// React reducer
function reducer(state, action) {
  switch (action.type) {
    case "USER_LOGIN": {
      return { ...state, userLogin: action.value, documentId: action.documentId || null  };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
// React context provider
function MyContextControllerProvider({ children }) {
  const initialState = {
    userLogin: null,
  };
  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
//React custom hook for using context
function useMyContextController() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error(
      "useMyContextController should be used inside the MyContextControllerProvider."
    );
  }
  return context;
}
const USERS = firestore().collection("Users")
const login = (dispatch,email, password) =>{
  auth().signInWithEmailAndPassword(email,password)
  .then(
    () =>
    USERS.doc(email).
    onSnapshot((u) => {
      const value = u.data();
      const documentId = u.id; // Accessing the document ID
      console.log("Document ID:", documentId);
      console.log("Đăng Nhập Thành Công Với User:", value);
      dispatch({ type: "USER_LOGIN", value, documentId });
  }))
  .catch(e => alert("Sai thông tin đăng nhập. Vui lòng nhập lại!") )
}
const signOut = async (dispatch, navigation) => {
  try {
    console.log("Before signOut");
    await auth().signOut();
    console.log("After signOut");
    dispatch({ type: "USER_LOGIN", value: null });
    navigation.replace('Login');
  } catch (error) {
    console.error("Đăng xuất không thành công:", error.message);
  }
};
export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  signOut
};
