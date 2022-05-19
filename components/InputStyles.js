import {Dimensions,Platform, StyleSheet} from "react-native";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const InputStyles = StyleSheet.create({
    container: {
        height:ScreenHeight,
        flex:1,
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
        backgroundColor:'#eee',
        fontSize:20,
        borderRadius:10
    },
    focusInputStyle: {
        width: '100%',
        marginBottom: 15,
        padding: '5%',
        alignSelf: "center",
        backgroundColor:'transparent',
        borderColor: "#f97c4d",
        borderWidth:2,
        fontSize:20,
        borderRadius:10
    },
    focusZipInputStyle: {
        width: '85%',
        marginBottom: 15,
        padding: Platform.OS === 'ios'?'5%':'2%',
        backgroundColor:'#fff',
        borderColor: "#f97c4d",
        borderWidth:2,
        fontSize:14,
        borderRadius:10,
    },
    zipInputStyle: {
        width: '85%',
        marginBottom: 15,
        padding:  Platform.OS === 'ios'?'5%':'2%',
        backgroundColor:'#eee',
        fontSize:14,
        borderRadius:10,
        shadowColor: "#5D737E",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginText: {
        color: '#000',
        marginTop: 25,
        textAlign: 'center'
    },
    ForgotPasswordText:{
        color: '#000',
        paddingBottom:10,
        textAlign: 'right'
    },
    buttons:{
        backgroundColor:"#2e344f",
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
        borderRadius:10
    },
    updateButtons:{
        backgroundColor:"#f97c4d",
        width:'50%',
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        alignSelf:'flex-end',
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
        borderRadius:10
    },
    buttonText:{
        fontSize: 20,
        color:"#e4e6e9"
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
        color:"#2e344f",
        fontSize:36,
    },
    editProfile:{
        color:"#2e344f",
        fontSize:24,
    }
});
const IconStyles = StyleSheet.create({
    arrowRight:{
        fontSize:20,
        alignSelf: 'center',
        color:"#e4e6e9"
    },
    editArrowRight:{
        fontSize:20,
        alignSelf: 'center',
        color:"#e4e6e9"
    },
    iconLeft:{
        fontSize:22,
        color:"#e4e6e9",
        alignSelf: 'center'
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
        width: 200,
        height: 200,
        borderRadius:100
    },
    editIcon:{
        color:"#000",
        fontSize:26,
        justifyContent:'center'
    }
})
const ProfileStyles = StyleSheet.create({
    container: {
        padding:'5%',
        flex:1,
        alignContent: 'center',
        justifyContent:'space-evenly'
    },
    card:{
        flexDirection:"column",
        alignItems: 'center',
        width:'100%',
        padding:'2%',
    },
    editProfile:{
        flexDirection:"row",
        justifyContent:'space-evenly',
        alignSelf:"center",
        alignItems: 'center',
        width:'60%',
        marginTop:'5%',
        padding:'4%',
        borderRadius:25,
        borderColor:"#f97c4d",
        borderWidth: 1.5
    },
    editButton:{
        fontSize:24,
        justifyContent:'space-between'
    },
    buttons:{
        backgroundColor:"#2e344f",
        padding: '5%',
        flexDirection: 'row',
        justifyContent:'space-between',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 10,
        borderRadius:10,
        marginTop:'5%'
    },
})
const LobbyStyles = StyleSheet.create({
    container:{
        flex:1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding:Platform.OS === 'ios'?'5%' : 10,
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
        letterSpacing:5,
        color: '#2e344f'
    },
    sliderContainer:{
        flex: 1,
        marginLeft: '10%',
        marginRight: '10%',
        alignItems: "stretch",
        justifyContent: "center",
    },
    closeButton:{
        width:'30%',
        height:'100%',
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor:"#f97c4d",
        shadowColor: "#5D737E",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius:10
    },
    leaveButton:{
        width:'45%',
        height:'100%',
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor:"#f97c4d",
        shadowColor: "#5D737E",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius:10
    },
    buttons:{
        width:'65%',
        height:'100%',
        backgroundColor:"#2E354E",
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        alignSelf:'center',
        shadowColor: "#5D737E",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius:10
    },
    modalSlider: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Platform.OS === 'ios'?'5%':'2%'
    },
    modalView: {
        backgroundColor: 'rgba(46, 53, 78,.95)',
        borderRadius: 20,
        padding: 10,
        margin:10,
        shadowColor: "#eee",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 20,
        height: Platform.OS === 'ios'?'65%':'65%',
        marginTop:'15%',
        justifyContent:'space-between'
    },
    zipInputStyle: {
        width: '85%',
        marginBottom: 15,
        padding:  Platform.OS === 'ios'?'5%':10,
        alignSelf: "center",
        borderColor: "#f1f1f1",
        backgroundColor: 'white',
        borderBottomWidth: 3,
        borderRightWidth:3,
        borderTopWidth:3,
        borderLeftWidth:3,
        fontSize:18,
        borderRadius:10
    },
    modalLobby: {
        backgroundColor: '#5D737E',
        borderRadius: 20,
        padding: 10,
        margin:10,
        shadowColor: "#eee",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 20,
        flex:1, justifyContent:'center'
    },
    filterButton: {
        backgroundColor:"#f97c4d",
        padding: '4%',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 10,
        borderRadius:10,
        marginBottom:'3%'
    },
/*    startButton: {
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
        borderBottomRightRadius:25,
        borderTopRightRadius:25,
        borderLeftWidth: 1,
        width: '70%'
    }*/
})
const CardStyle = StyleSheet.create({
    container:{
        backgroundColor:'#eee',
        height:ScreenHeight,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding:10,
    },
    loadContainer:{
        backgroundColor:'#eee',
        height:ScreenHeight,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        width:ScreenWidth * .95
    },
    card: {
        height:600,
        backgroundColor: '#2decb4',
        borderRadius:10,
        width:ScreenWidth * .95
    },
    cardsText: {
        fontSize: 18,
        fontWeight: "bold",
        color: '#010001',
    },
    yelpText: {
        fontSize: 16,
        color: '#010001'
    },
    yelpInfo: {
        margin:20
    },
    yelpReview:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent:'space-between',
        marginTop:'2%',
        height:'50%',

    },
    yelpStars:{
        width:'90%',
        height:'22%'
    },
    yelpImage: {
        width:45,
        height:50,
    },
    cardImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        borderTopLeftRadius:10,
        borderTopRightRadius:10
    },
    modalView: {
        backgroundColor: '#5D737E',
        borderRadius: 20,
        padding: 10,

        margin:10,
        marginTop:Platform.OS === 'ios' ? 50 : 20,
        shadowColor: "#eee",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 20,
        justifyContent:'center'

    },
    backButton: {
        padding: '5%',
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop:'5%'
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
        width:ScreenWidth,
        paddingTop:"15%",
    },
    yelpImage: {
        width:45,
        height:50,
    },
    cardImages: {
        width: ScreenWidth,
        aspectRatio: 3/2,
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
        paddingTop: 5,
        paddingLeft:25,
        paddingRight:25,
        display: "flex",
        flexDirection: "column",
    },
    yelpStars:{
        display:"flex",
        flexDirection:"row",
        justifyContent:'space-between',
        width:ScreenWidth -25
    },
    yelpStarReviewContainer:{
        width:'75%',
        alignSelf:'center'
    },
    yelpStarReview:{
        width:Platform.OS === 'ios' ? 150: 205,
        padding:'5%'
    },
    yelpInformation:{
        display: "flex",
        flexDirection: "column",
        justifyContent:"space-evenly"
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
