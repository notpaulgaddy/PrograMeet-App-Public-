import React, { useState, useEffect } from "react";
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
import { Badge, Colors, IconButton } from "react-native-paper";
import { WHITE } from "../config/Constants";
import * as RootNavigation from "../helpers/RootNavigation";
import {
  getFirestore,
  collection,
  getDoc,
  where,
  query,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { db } from "../config/firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import AppContext from "../store/AppContext";
import { useList } from "react-firebase-hooks/database";
import { getDatabase, ref } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
const NotificationIcon = () => {
  const ctxt = React.useContext(AppContext);
  const { user } = useSelector((state) => state.user);
  const [value, loading, error] = useCollection(
    query(
      collection(db, "notifications"),
      where("receiver", "==", user.userId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <IconButton
        size={25}
        color={WHITE}
        onPress={() => RootNavigation.navigate("Notifications")}
        icon={"bell-outline"}
      />
      {!loading && !value.empty ? (
        <Badge
          style={{
            backgroundColor: Colors.white,
            position: "absolute",
            top: 15,
            right: 13,
          }}
          size={10}
        ></Badge>
      ) : (
        <></>
      )}
    </View>
  );
};

export default NotificationIcon;

const styles = StyleSheet.create({});
