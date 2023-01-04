import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Surface,
} from "react-native-paper";
import { List } from "react-native-paper";
import { useTheme } from "react-native-paper";
import moment from "moment";
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import { useList, useObject } from "react-firebase-hooks/database";
import {
  getFirestore,
  collection,
  where,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import AppContext from "../store/AppContext";
import { db } from "../config/firebase";
import { DARKGREY, WHITE } from "../config/Constants";
import { Badge } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as RootNavigation from "../helpers/RootNavigation";
import { FormatTime } from "../helpers/FormatTime";
import OnlineIndicator from "./OnlineIndicator";

let fArr = [];
const ChatLog = ({ friends }) => {
  const ctxt = React.useContext(AppContext);
  const currentUser = useSelector((state) => state.user);
  const [fireVal, storeLoading, storeError] = useCollection(
    query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    )
  );

  fArr = [];

  !storeLoading &&
    friends.map((f) => {
      let msgArr = [];

      let data = fireVal.docs.filter(
        (snap) =>
          (snap.data().receiver === currentUser.user.userId &&
            snap.data().uid === f.data().userId) ||
          (snap.data().uid === currentUser.user.userId &&
            snap.data().receiver === f.data().userId)
      );

      return data.map((recDoc, i) => {
        msgArr.push(recDoc.data());
        if (data.length === msgArr.length) {
          fArr.push({
            message: msgArr[msgArr.length - 1].message,
            name: f.data().name,
            avatar: f.data().avatar,
            timestamp: msgArr[msgArr.length - 1].createdAt,
            uid: f.data().userId,
            isRead: msgArr[msgArr.length - 1].isRead,
            unread: data.filter(
              (msg) =>
                !msg.data().isRead &&
                msg.data().receiver === currentUser.user.userId
            ).length,
            receiver: msgArr[msgArr.length - 1].receiver,
          });
          fArr.sort(function (a, b) {
            return b.timestamp - a.timestamp;
          });
        }
      });
    });

  return fArr.map((dt, i) => {
    return (
      <Surface
        key={i}
        style={{
          elevation: 2,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            RootNavigation.navigate("ChatScreen", {
              uid: dt.uid,
              chatKey: null,
            });
          }}
        >
          <List.Item
            right={() => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <View>
                    {dt.unread > 0 && <Badge>{dt.unread}</Badge>}

                    <View>
                      <Text>{FormatTime(moment(dt.timestamp).fromNow())}</Text>
                    </View>
                  </View>
                </View>
              );
            }}
            left={() => (
              <>
                <Avatar.Image
                  source={{
                    uri: dt.avatar,
                  }}
                />
                <OnlineIndicator receiver={dt.uid} />
              </>
            )}
            titleStyle={{
              fontWeight:
                !dt.isRead && dt.receiver == currentUser.user.userId
                  ? "bold"
                  : "normal",
            }}
            descriptionStyle={{
              fontWeight:
                !dt.isRead && dt.receiver == currentUser.user.userId
                  ? "bold"
                  : "normal",
            }}
            title={dt.name}
            description={dt.message}
          ></List.Item>
        </TouchableOpacity>
      </Surface>
    );
  });
};

export default ChatLog;
