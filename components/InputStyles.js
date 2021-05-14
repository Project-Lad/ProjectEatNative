import {StyleSheet} from "react-native";

const InputStyles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    inputStyle: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#BC0B02",
        borderBottomWidth: 2
    },
    loginText: {
        color: '#000',
        marginTop: 25,
        textAlign: 'center'
    },
    buttons:{
        borderColor:"#BC0B02",
        borderWidth:2,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom:10
    },
    buttonText:{
        fontSize: 18
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});
const IconStyles = StyleSheet.create({
    arrowRight:{
        fontSize:18,
        alignSelf: 'center'
    },
    iconLeft:{
        fontSize:22,
        alignSelf: 'center'
    },
    iconContainer:{
        position: 'relative',
        top:-25,
        left:75
    },
    addProfilePic:{
        fontSize:24,
    },
    profilePicture:{
        width: 200,
        height: 200,
        borderRadius:100
    }
})
const ProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        padding: 25,
        backgroundColor: '#fff'
    },
    card:{
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems: 'center',
        width:'100%',
        height:'50%',
        borderRadius:10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 6,
        marginBottom:10
    },
    editButton:{
        position:'absolute',
        bottom:20,
        right:10,
        fontSize:24
    }
})
const LobbyStyles = StyleSheet.create({
    container:{
        flex:1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: 20,
        height:'50%',
    },
    listContainer:{
        display:'flex',
        flexDirection:'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        width:'100%',
        height:'75%',
        borderRadius:4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 2,
        marginBottom:10,
        padding:10,
        flex: 5,
    },
    bottomContainer:{
      flex:0
    },
    userName:{
        alignSelf:'center',
        fontSize:18,
        paddingLeft:25
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    shareCodeContainer:{
        borderStyle:'dashed',
        borderWidth:2,
        borderColor:'#BC0B02',
        borderRadius:1,
        alignItems:'center',
        backgroundColor:'rgba(188, 11, 2, 0.25)',
        paddingTop:10,
        paddingBottom: 10,

        marginBottom:25,
    },
    shareCodeText:{
        fontSize:18,
        textAlign:'center',
        letterSpacing:5
    },
    sliderContainer:{
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: "stretch",
        justifyContent: "center",
        color:'red'
    },
    sliderTrack:{
        height: 15,
        borderRadius: 25,
        backgroundColor:'rgba(188, 11, 2, 0.25)'
    },
    sliderThumb:{
        height: 25,
        width:25,
        borderRadius: 20,
        backgroundColor:'rgb(188, 11, 2)'
    }

})
export {InputStyles, IconStyles,ProfileStyles,LobbyStyles}
