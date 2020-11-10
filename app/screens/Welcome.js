import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';


function Welcome(props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.mainTitle}>PetApp</Text>
                <View style={styles.profileImage}>

                </View>

            </View>
            <View style={styles.feedContainer}>
                <View style={styles.feed}>

                </View>
            </View>
            <View style={styles.myPets}>
                <Text style={styles.title}>My Pets</Text>   
                <View style={styles.myPetsContent}>
                    <View style={styles.pet}>

                    </View>
                    <View style={styles.pet}>
                        
                    </View>
                    <View style={styles.pet}>

                    </View>
                </View> 
            </View>
        <View style={styles.bottomMenu} />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 25,
        padding: 10,
        height: 80,
    },
    profileImage: {
        width: 50,
        height: 50,
        backgroundColor: 'grey',
    },
    feedContainer:{
        flex: 4,
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 20,
        height: 300, 
        backgroundColor: 'powderblue',
        },
    feed:{
        width: 300,
        height: 250,
        backgroundColor: 'white',
        borderRadius: 20,
    },
    myPets:{
        flex: 2,
        flexDirection: 'column',
        height: 150, 
        backgroundColor: 'white',
        padding: 10,
        },
    title:{
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 20,
    },
    myPetsContent:{
        flex: 1,
        flexWrap: "nowrap",
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
    },
    pet:{
        marginRight: 20,   
        width: 150,
        height: 150,
        borderRadius: 20,
        backgroundColor: 'orange',
    },
    bottomMenu:{
        height: 70, 
        backgroundColor: 'white'
        },

  });
  

export default Welcome;