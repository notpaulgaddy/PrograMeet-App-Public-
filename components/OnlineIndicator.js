import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  SafeAreaView,
  Image,
  View,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  ref,
  off,
} from "firebase/database";
import { useList, useObject } from "react-firebase-hooks/database";
import { database } from "../config/firebase";

const OnlineIndicator = ({ receiver }) => {
  const [users, loading, error] = useList(
    ref(database, "onlineUsers")
  );

  React.useEffect(() => {
    return () => {
      off(ref(database, "onlineUsers"));
    };
  }, [users]);

  return (
    <View>
      {!loading && users.filter((snap) => snap.key === receiver).length > 0 ? (
        <FontAwesome
          style={{
            color: "green",
            position: "absolute",
            right: 3,
            bottom: 5,
          }}
          name="circle"
        />
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

export default OnlineIndicator;
