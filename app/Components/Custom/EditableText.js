import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from "react-native";
import dbAdoptableAnimal from "../../firebase/database/functions/DbAdoptableAnimal";
import dbPlace from "../../firebase/database/functions/DbPlace";
import dbNews from "../../firebase/database/functions/DbNews";

class EditableText extends React.Component {
    // props text
  
    state = {
      oldText: "",
      newText: "",
      onEditing: false,
    };

  
    componentDidMount() {
      this.setState({ mounted: true , oldText: this.props.text, newText: this.props.text});
    }

    handlePress(){
        if(this.state.onEditing){
            this.saveUpdate();
        }else{
            this.setOnEditing();
        }
    }

    setOnEditing(){
        this.setState({onEditing:true});
    }

    saveUpdate(){
        const oldText = this.state.oldText;
        const newText = this.state.newText;
        if(oldText != newText){ // update if there is some change
            console.log("new text!!");
            this.setState({oldText:newText});
            this.updateDb(newText);
        }
        this.setState({onEditing:false});
    }

    updateDb(text){

       const field = this.props.field;
       if(field == "address"){
         dbPlace.updateAddressPlace(this.props.pid,text);
       }
       if(field == "description"){
        dbPlace.updateDescriptionPlace(this.props.pid,text);
       }
       if(field == "profile"){
        dbAdoptableAnimal.updateAdoptablePetProfile(this.props.pid,this.props.aid,text);
       }
       if(field == "titlenews"){
         dbNews.updateNewsTitle(this.props.pid,this.props.nid,text);
       }
       if(field == "textnews"){
        dbNews.updateNewsText(this.props.pid,this.props.nid,text);
      }

    }

    render() { 
        const oldText = this.state.oldText; 
        const newText = this.state.newText; 
        const onEditing = this.state.onEditing; 
        const m1 = "Update";
        const m2= "Save"; 
        
        return (  // visualizes TextInput or Text if OnEditing 
        <> 
           {
             onEditing ?  
            (
                
                <View style={styles.info}>
                  <TextInput
                    multiline
                    placeholder="editable"
                    placeholderTextColor="#616161"
                    returnKeyType="next"
                    value={newText}
                    onChangeText={(text) => this.setState({ newText:text })}
                  />
                </View>
                 )
            : (<Text> {oldText} </Text> ) }

        
            <TouchableHighlight
            style={styles.disease}
            onPress={() => this.handlePress()}
            >
            <View style={styles.info}>
              <Text style={{ fontWeight: "bold" }}>{!onEditing? m1 : m2}</Text>
            </View> 
          </TouchableHighlight>
       </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    mainContent: {
      flex: 1,
    },
    text: {
      margin: 15,
    },
    diseaseDescription: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      elevation: 2,
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 35,
      padding: 10,
    },
    buttons: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      paddingBottom: 10,
    },
    buttonText: {
      alignSelf: "center",
    },
    disease: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "white",
      borderRadius: 15,
      marginLeft: 10,
      marginRight: 5,
      marginBottom: 5,
      padding: 10,
      elevation: 2,
    },
    title: {
      fontWeight: "400",
      fontSize: 16,
      marginHorizontal: 20,
      marginBottom: 15,
    },
  
    descriptionContainer: {
      padding: 0,
    },
  
    mainButtonContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
    },
    mainButton: {
      width: 50,
      height: 50,
      resizeMode: "cover",
      tintColor: "orange",
    },
    error: {
      fontSize: 18,
      textAlign: "center",
      color: "red",
      width: "80%",
    },
    healthStatus: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      marginVertical: 5,
    },
    diseaseBox: {
      alignSelf: "center",
      backgroundColor: "#fde2e4",
      elevation: 2,
      width: "90%",
      maxWidth: 500,
      paddingVertical: 15,
      borderRadius: 15,
      marginVertical: 10,
    },
    form: {
      borderRadius: 30,
      width: "60%",
      backgroundColor: "#FFF",
      borderRadius: 25,
      height: 50,
      justifyContent: "center",
      alignSelf: "center",
      paddingLeft: 30,
      elevation: 1,
    },
    deleteButton: {
      backgroundColor: "#FFF",
      borderRadius: 22,
      padding: 10,
      elevation: 2,
      alignSelf: "flex-start",
    },
    descriptionContainer: {
      width: "90%",
      alignSelf: "center",
    },
    title: {
      color: "red",
      fontWeight: "bold",
      fontSize: 20,
      marginVertical: 10,
      textAlign: "center",
    },
  });
  export default EditableText;
  
