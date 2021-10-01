import {Dimensions,Platform, StyleSheet} from "react-native";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const InputStyles = StyleSheet.create({
    container: {
        height:ScreenHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: '10%',
        backgroundColor: '#fff'
    },
    inputStyle: {
        width: '100%',
        marginBottom: 15,
        padding: '5%',
        alignSelf: "center",
        borderColor: "#2decb4",
        borderBottomWidth: 3,
        borderRightWidth:3,
        borderTopWidth:3,
        borderLeftWidth:3,
        fontSize:20,
        borderRadius:25
    },
    zipInputStyle: {
        width: '100%',
        marginBottom: 15,
        padding:  Platform.OS === 'ios'?'5%':10,
        alignSelf: "center",
        borderColor: "#5D737E",
        borderBottomWidth: 3,
        borderRightWidth:3,
        borderTopWidth:3,
        borderLeftWidth:3,
        fontSize:12,
        borderRadius:25
    },
    loginText: {
        color: '#000',
        marginTop: 25,
        textAlign: 'center'
    },
    buttons:{
        backgroundColor:"#2decb4",
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom:10,
        shadowColor: "#5D737E",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius:25
    },
    buttonText:{
        fontSize: 20,
        color:"#5D737E"
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
    },
    userNameText:{
        color:"#5D737E",
        fontSize:24,
    }
});
const IconStyles = StyleSheet.create({
    arrowRight:{
        fontSize:20,
        alignSelf: 'center',
        color:"#5D737E"
    },
    iconLeft:{
        fontSize:22,
        color:"#5D737E",
        alignSelf: 'center'
    },
    closeButton:{
        padding: "2%",
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center'
    },
    iconShare:{
        fontSize:22,
        color:"#000",
        alignSelf: 'center'
    },
    iconContainer:{
        display:'flex',
        flexDirection:'column'
    },
    addProfilePic:{
        fontSize:24,
        alignSelf:'flex-end',
        paddingBottom:10
    },
    profilePicture:{
        width: 75,
        height: 75,
        borderRadius:100
    },
    editIcon:{
        color:"#5D737E",
        fontSize:26,
        justifyContent:'center'
    }
})
const ProfileStyles = StyleSheet.create({
    container: {
        padding:'5%',
        flex:1,
        alignContent: 'center',
        justifyContent:'center'
    },
    card:{
        flexDirection:"row",
        justifyContent:'space-evenly',
        alignItems: 'center',
        width:'100%',
        padding:'2%',
        backgroundColor:'#fff',
        borderRadius:4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    editButton:{
        fontSize:24,
        justifyContent:'center'
    },
    buttons:{
        backgroundColor:"#2decb4",
        padding: '5%',
        flexDirection: 'row',
        justifyContent:'space-between',
        shadowColor: "#5D737E",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius:25,
        marginTop:'5%'
    },
})
const LobbyStyles = StyleSheet.create({
    container:{
        flex:1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding:Platform.OS === 'ios'?'5%' : 10 ,
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
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
        marginBottom:10,
        padding:10,
        flex: 5,
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
        borderColor:'#5D737E',
        borderRadius:1,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:10,
        paddingBottom: 10,
        flexDirection:'row',
        marginBottom:25,
        justifyContent:'space-evenly'
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
        backgroundColor:'#5D737E'
    },
    sliderThumb:{
        height: 25,
        width:25,
        borderRadius: 20,
        backgroundColor:'#2decb4'
    }
})
const CardStyle = StyleSheet.create({
    container:{
        backgroundColor:'#eee',
        height:ScreenHeight,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:-70,
        padding:10
    },
    loadContainer:{
        backgroundColor:'#eee',
        height:ScreenHeight,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding:10
    },
    card: {
        height:600,
        backgroundColor: 'rgba(218,44,56,1)',
        borderRadius:10,

    },
    cardsText: {
        fontSize: 18,
        fontWeight: "bold",
        paddingLeft: 15,
        color: '#010001',
        padding:5
    },
    yelpLocation:{
        margin: 15
    },
    yelpText: {
        fontSize: 15,
        color: '#010001'
    },
    yelpStars: {
        marginLeft: 15,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        flexDirection: 'row',
    },
    yelpReview:{
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        padding:5
    },
    yelpImage: {
        width: 125,
        height: 50,
    },
    cardImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        borderTopLeftRadius:10,
        borderTopRightRadius:10
    },
    modalView: {
        backgroundColor: 'rgba(218,44,56,.75)',
        borderRadius: 20,
        padding: 20,
        margin: 10,
        shadowColor: "#eee",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 20
    },
    button: {
        backgroundColor:"#DA2C38",
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:"stretch",
        marginBottom:10,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText:{
        color: "#EEEEEE",
        fontWeight: "bold",
        fontSize: 20,
        paddingLeft:10,
    },
    backButton: {
        backgroundColor:"#DA2C38",
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        fontWeight: "normal",
        justifyContent:'space-between',
        margin:10,
        shadowColor: "#5D737E",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "#EEEEEE",
        fontWeight: "bold",
        fontSize: 20,
    },
    cardImageModal: {
        width: "20%",
        height: "50%",
        aspectRatio: 1,
        borderRadius:10,
        position: "relative",
        left:10,
        right:10
    },

})
const DecisionStyle = StyleSheet.create({
    container: {
        flex:1,
        height:'100%',
        width:'100%',
        padding:10,
        paddingTop:"35%",
        backgroundColor: 'rgba(218,44,56,.25)',
        borderRadius:10
    },
    yelpImage: {
        width: 125,
        height: 75,
    },
    cardImages: {
        width: 339.5,
        height: 200,
        aspectRatio: 1.5,
        borderRadius:10,
    },
    cardsText: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: 'center',
        color: '#010001',
        paddingTop: 15,
        paddingBottom:15
    },
    yelpText: {
        fontSize: 15,
        color: '#010001'
    },
    yelpContainer: {
        padding: 10,
        display: "flex",
        flexDirection: "row"
    },
    yelpInformation:{
        display: "flex",
        flexDirection: "column"
    },
    button: {
        backgroundColor: '#bc0402',
        borderRadius: 20,
        padding: 5,
    },
    circleDiv: {
        position: "absolute",
        bottom: 15,
        height: 10,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    whiteCircle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        margin: 5,
        backgroundColor: "#fff"
    }
})

export {InputStyles, IconStyles,ProfileStyles,LobbyStyles, CardStyle,DecisionStyle}
