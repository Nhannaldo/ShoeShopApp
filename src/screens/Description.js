import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../themes/Colors';

export default Description = ({ navigation, route }) => {
    const { item } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Description</Text>
                </View>
            </View>
            <ScrollView>
                <Text style={styles.content}>
                    {item.productdescribe}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    headerTextContainer: {
        marginLeft: 15,
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 18,
        color: Colors.text,
        fontWeight: 'bold'
    },
    content: {
        fontSize: 14,
        color: Colors.text,
        marginTop: 20,
        marginLeft: 5,
        textAlign:'justify',
        lineHeight:20
    }
});
