import { View } from "react-native";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";

export default function Index() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // Jab message aayega, tu yahan Alert dikha sakta hai
      Alert.alert(
        remoteMessage.notification?.title || "New Notification",
        remoteMessage.notification?.body
      );

      // Ya fir tu console mein data check kar sakta hai
      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  return <View style={{ flex: 1, backgroundColor: "#0A0A0A" }} />;
}
