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
  Badge,
} from "react-native-paper";
import { List } from "react-native-paper";
import { useList } from "react-firebase-hooks/database";
import { ref, getDatabase } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../config/firebase";
import Placeholder from "./Placeholder";
import * as RootNavigation from "../helpers/RootNavigation";
import OnlineIndicator from "./OnlineIndicator";
import { FormatTime } from "../helpers/FormatTime";
import moment from "moment";

const UnreadIndicator = ({ chatId }) => {
  const currentUser = useSelector((state) => state.user);
  const [snapshots, loading, error] = useList(
    ref(database, "messages/" + chatId)
  );

  if (loading) {
    return <></>;
  }

  let unreadMsgCount = snapshots.filter(
    (item) =>
      !item.val().isRead && item.val().receiver === currentUser.user.userId
  ).length;
  return (
    snapshots.filter(
      (item) =>
        !item.val().isRead && item.val().receiver === currentUser.user.userId
    ).length > 0 && <Badge>{unreadMsgCount}</Badge>
  );
};

export default UnreadIndicator;
