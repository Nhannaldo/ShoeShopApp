import { StyleSheet, Dimensions } from 'react-native'
import Colors from '../../themes/Colors'

var { height, width } = Dimensions.get('window')

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    star_container:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:15
    },
    star:{
        marginHorizontal:1
    },
    rating:{
        flexDirection:'row'
    },
})