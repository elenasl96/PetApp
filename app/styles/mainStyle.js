import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a9d8f',
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo:{
        fontSize:50,
        color:"#fb5b5a",
        marginBottom:40
      },
      form: {
        width: "86%",
        marginTop: 15,
        backgroundColor:"#33C1B1",
        borderRadius:25,
        height:50,
        justifyContent:"center",
        padding:20
      },
      input: {
        fontSize: 20,
        borderColor: '#707070',
        borderBottomWidth: 1,
        paddingBottom: 1.5,
        marginTop: 25.5
      },
      inputView:{
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
      },
      inputText:{
        height:50,
        color:"white"
      },
      text:{
        fontSize: 18, 
        textAlign: 'center'
      },
      button: {
        backgroundColor: '#3A559F',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22
      },
      buttonText:{    
        letterSpacing: 0.5,
        fontSize: 16,
        color: '#FFFFFF'
      },
      error:{
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
        width: '80%'
      }
  });