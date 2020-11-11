import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';


function Welcome(props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.mainTitle}>GPaw</Text>
                <View style={styles.profileContainer}>
                    <Text style={styles.username}>Anna Black</Text>
                    <Image source={{uri: 'https://cdn.pixabay.com/photo/2015/09/02/13/24/girl-919048_960_720.jpg'}} style={styles.profileImage}>
                    </Image>
                </View>

            </View>
            <View style={styles.feedContainer}>
                <View style={styles.feed}>
                    <Text>Feed1</Text>
                </View>                   
                <View style={styles.feed}>
                    <Text>Feed2</Text>
                </View>
                <View style={styles.feed}>
                    <Text>Feed3</Text>
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
        alignItems: 'center',
        paddingTop: 35,
        padding: 10,
    },
    mainTitle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    profileContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    username:{
        fontSize: 14,
        fontWeight: 'bold',
        margin: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        backgroundColor: 'grey',
        borderRadius: 30,
        
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
        marginRight: 15,
        padding: 15,
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