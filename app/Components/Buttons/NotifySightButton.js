import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import dbNotification from "../../firebase/Database/Functions/dbNotification";
import { AuthContext } from "../AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class NotifySightButton extends React.Component {
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    Notifications.addNotificationResponseReceivedListener(
      this._handleNotificationResponse.bind(this)
    );
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  _handleNotificationResponse(response) {
    console.log("OPEN APP");
    console.log(response.notification.request.content.data);
    //console.log(this.props.navigation);

    this.props.navigation.navigate("LostPet", {
      pet: response.notification.request.content.data.pet,
      petID: response.notification.request.content.data.petID,
    });
  }

  render() {
    const userID = this.props.userID;
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await sendPushNotificationToUser(userID, this.props.animal);
        }}
      >
        <Text style={styles.buttonText}>Reply to Loss</Text>
      </TouchableOpacity>
    );
  }
}

async function sendPushNotificationToUser(uid, animal) {
  console.log(uid);
  dbNotification.getUserToken(uid).then((expoPushToken) => {
    sendPushNotification(expoPushToken, animal);
  });
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken, animal) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Pet report",
    body: "Your pet has been spotted!",
    data: { pet: animal, petID: animal.id },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 10,
  },
  button: {
    backgroundColor: "#F9844A",
    minWidth: 100,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 5,
    marginLeft: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  buttonText: {
    alignSelf: "center",
  },
});
