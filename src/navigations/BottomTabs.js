import { View } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Product from '../screens/Product';
import Order from '../screens/Order';
import Account from '../screens/Account';
import Colors from '../themes/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Cart from '../screens/Cart';
// số lượng nằm trên icon giỏ hàng
import { Badge } from 'react-native-elements';
const Tab = createMaterialBottomTabNavigator();

export default BottomTabs = () => {
    const getIconName = (routeName) => {
        switch (routeName) {
          case 'Home':
            return 'home';
          case 'Product':
            return 'shopping-outline';
          case 'Order':
            return 'order-bool-ascending-variant';
          case 'Account':
            return 'account';
          case 'Cart':
            return 'cart-outline';
          default:
            return 'home';
        }
      };
    return (
        <Tab.Navigator
      shifting={true} // Bật chế độ shifting
      barStyle={{height:68, backgroundColor: Colors.white }} // Màu nền của toàn bộ bottom tab
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          const iconName = getIconName(route.name);
          return <Icon name={iconName} size={28} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.red, // Màu của tab đang active
        inactiveTintColor: Colors.gray, // Màu của tab không active
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Product" component={Product} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Order" component={Order} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
    );
}
