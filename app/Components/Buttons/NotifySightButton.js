import * as Notifications from "expo-notifications";
import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import dbNotification from "../../firebase/database/functions/DbNotification";
import mainStyle from "../../styles/MainStyle";
import { AuthContext } from "../custom/ContextProvider";

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
    this.props.navigation.navigate("LostPet", {
      pet: response.notification.request.content.data.pet,
      petID: response.notification.request.content.data.petID,
    });
  }

  send = () => {
    let petSeen = this.props.replyToLoss();
    if (petSeen) {
      sendPushNotificationToUser(this.props.userID, petSeen);
    }
  };

  render() {
    const userID = this.props.userID;
    return (
      <TouchableOpacity
        style={mainStyle.submitButton}
        onPress={async () => {
          await this.send();
        }}
      >
        <Text style={styles.buttonText}>Reply to Loss</Text>
      </TouchableOpacity>
    );
  }
}

async function sendPushNotificationToUser(uid, animal) {
  dbNotification.getUserToken(uid).then((expoPushToken) => {
    sendPushNotification(expoPushToken, animal);
  });
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken, animal) {
  let body = "Your pet has been spotted! \n" + "Place: " + animal.place;
  if (animal.phone) {
    body += "\n" + "Phone:" + animal.phone;
  }
  if (animal.email) {
    body += "\n" + "Email:" + animal.email;
  }

  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Pet report",
    body: body,
    //data: { pet: animal, petID: animal.id },
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
