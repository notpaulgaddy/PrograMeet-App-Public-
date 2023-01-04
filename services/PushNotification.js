import * as Notifications from "expo-notifications";
import { child, get, push, ref, set } from "firebase/database";
import { database, db } from "../config/firebase";
import Constants from "expo-constants";
import messaging from "@react-native-firebase/messaging";

class PushNotification {
  getPushToken = () => {
    if (!Constants.isDevice) {
      return Promise.reject("Must use physical device for Push Notifications");
    }

    try {
      return Notifications.getPermissionsAsync()
        .then((statusResult) => {
          return statusResult.status !== "granted"
            ? Notifications.requestPermissionsAsync()
            : statusResult;
        })
        .then((statusResult) => {
          if (statusResult.status !== "granted") {
            throw "Failed to get push token for push notification!";
          }
          return Notifications.getExpoPushTokenAsync({
            experienceId: "@shadykip/programeet",
          });
        })
        .then((tokenData) => tokenData.data);
    } catch (error) {
      return Promise.reject("Couldn't check notifications permissions");
    }
  };

  getSubscriptionKey = (expoPushToken) => {
    return expoPushToken.split("[")[1].replace(/\]/g, "");
  };

  subscribeUser = async (uid, pushToken) => {
    set(ref(database, `/subscriptions/${uid}`), {
      pushToken,
    });
  };
  retrieveSubscription = async (uid, pushToken) => {
    const dbRef = ref(database);
    return get(child(dbRef, `/subscriptions/${uid}`));
  };
  sendPushNotification = async (expoPushToken, title, body) => {
    console.log("Expo token ", expoPushToken);
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data: { someData: "goes here" },
    };

    let rep = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };


  //fcm google cloud messaging

  sendPushNotificationFcm = async (pushToken, title, body, image) => {
    let notification = {
      title: title,
      body: body
    }
    if (typeof image == "string" && image.length > 0) {
      notification.image = image
    }
    // fetch request to send push notification https://fcm.googleapis.com/fcm/send
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${'AAAAEBVftCE:APA91bGTSZ2E65XDpmWimqijbTIPLJxhObqWS_3rVuL-zZQGVHs-V9PK7s3ZVsaAanRtk2DTqHv7q9ncaBm_ctOrhKE1BpgxG3bgW33y0rUK9e2SxDbQ1wUgivDCHt1Wt00sWVD4ihXn'}`
      },
      body: JSON.stringify({
        to: pushToken,
        sound: "default",
        notification: { ...notification }
      }),
    }).then((response) => {
      console.log(JSON.stringify(response));
    });
  }

  subscribeUserFcm = async (uid, fcmToken) => {
    set(ref(database, `/fcmSubscriptions/${uid}`), {
      fcmToken,
    });
  };

  getFcmToken = async () => {
    return await messaging().getToken();
  }

  retrieveFcmSubscription = async (uid) => {
    const dbRef = ref(database);
    return get(child(dbRef, `/fcmSubscriptions/${uid}`));
  };
}

export default new PushNotification();