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
        padding: 15,
        alignSelf: "center",
        borderColor: "#DA2C38",
        borderBottomWidth: 3,
        borderRightWidth:3,
        borderTopWidth:3,
        borderLeftWidth:3,
        fontSize:20
    },
    zipInputStyle: {
        width: '100%',
        marginBottom: 15,
        padding: 10,
        alignSelf: "center",
        borderColor: "#DA2C38",
        borderBottomWidth: 3,
        borderRightWidth:3,
        borderTopWidth:3,
        borderLeftWidth:3,
        fontSize:12
    },
    loginText: {
        color: '#000',
        marginTop: 25,
        textAlign: 'center'
    },
    buttons:{
        backgroundColor:"#DA2C38",
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
    },
    buttonText:{
        fontSize: 20,
        color:"#eee"
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
        color:"#eee"
    },
    iconLeft:{
        fontSize:22,
        color:"#eee",
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
    },
    editIcon:{
        color:"#5D737E",
        fontSize:24,
        fontWeight:"bold"
    }
})
const ProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        marginTop: 50,
        padding:10,
    },
    card:{
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems: 'center',
        width:'100%',
        height:'50%',
        borderRadius:10,
        shadowColor: '#DA2C38',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        elevation: 5,
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
        display:'flex',
        borderStyle:'dashed',
        borderWidth:2,
        borderColor:'#BC0B02',
        borderRadius:1,
        alignItems:'center',
        backgroundColor:'rgba(188, 11, 2, 0.25)',
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
        backgroundColor:'rgba(188, 11, 2, 0.25)'
    },
    sliderThumb:{
        height: 25,
        width:25,
        borderRadius: 20,
        backgroundColor:'rgb(188, 11, 2)'
    }
})
const CardStyle = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#eee',
        height:'100%',
        width:'100%'
    },
    cardContainer:{
        position:'absolute',
        backgroundColor:'#eee',
        top:75,
        bottom:-20,
        left:0,
        right:0
    },
    card: {
        height:'100%',
        width:'100%',
        backgroundColor: 'rgba(218,44,56,.25)',
        borderRadius:25
    },
    cardsText: {
        fontSize: 18,
        fontWeight: "bold",
        paddingLeft: 15,
        color: '#010001'
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
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'center',
        flexDirection: 'row',
    },
    yelpReview:{
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'flex-end'
    },
    yelpImage: {
        width: 125,
        height: 50,
    },
    cardImage: {
        width: "95%",
        height: undefined,
        aspectRatio: 1,
        borderTopLeftRadius:25,
        borderTopRightRadius:25
    },
    modalView: {
        margin: 10,
        backgroundColor: 'rgba(218,44,56,.75)',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
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
