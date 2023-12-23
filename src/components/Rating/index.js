import React from "react";
import { View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from "./styles";

export default function Rating({ rate = 5 }) {
    let rating = [...new Array(rate).keys()]

    return (
        <View style={styles.rating}>
            {rating.map((item, index) => {
                return (
                    <View key={index} style={styles.star}>
                        <Icon name='star' size={14} color="#FFD700"/>
                    </View>
                )
            })}
        </View>
    )
}