import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import db from "../../firebase/DatabaseManager";
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

  render() {
    const userID = this.props.userID;
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await sendPushNotificationToUser(userID);
        }}
      >
        <Text style={styles.buttonText}>Reply to Loss</Text>
      </TouchableOpacity>
    );
  }
}

async function sendPushNotificationToUser(uid) {
  console.log(uid);
  db.getUserToken(uid).then((expoPushToken) => {
    sendPushNotification(expoPushToken);
  });
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Pet report",
    body: "Your pet has been spotted!",
    data: { someData: "goes here" },
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
