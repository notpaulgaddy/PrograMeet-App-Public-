import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { Button, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import PushNotification from "../services/PushNotification";

//https://blog.appcircle.io/article/sending-push-notifications-to-react-native-using-firebasehttps://blog.appcircle.io/article/sending-push-notifications-to-react-native-using-firebase

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const getPushToken = () => {
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

export default function NotificationTest() {
  const [expoPushToken, setExpoPushToken] = useState();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    getPushToken().then((pushToken) => {
      setExpoPushToken(pushToken);
      if (pushToken) {
        console.log(PushNotification.getSubscriptionKey(pushToken));
        // retrieveWeatherSubscription(pushToken, setIsSubscribed);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(setNotification);

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotification(response.notification);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  function sendPushNotification() {
    PushNotification.sendPushNotificationFcm(
      "eHIoYTb870HpkxsS5buc76:APA91bEevnwQmLHuLB7Qln6iWfbxfwHUk_jQBwRnXWSB2Th7KlBtmIQD6BcUwnz2YY0aUsV9DovaLgGX6kKNULWhURZqIWvagEEjwNgHRYySx9WO67qg0GteQH_stbL0aoOxgJGaUwXr",
      "Hey",
      "This is a test notification"
    )
  }
  


  return (
    <ScrollView>
      <View>
        <Text>Daily weather notification</Text>

        <Text>Your expo push token:</Text>
        <Text selectable={true}>{expoPushToken || "-"}</Text>


        <TouchableOpacity
          onPress={() => {
            sendPushNotification();
          }}
        >
          <Text>Send me notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {

          }}
        >


        </TouchableOpacity>
      </View>


    </ScrollView>
  );
}
