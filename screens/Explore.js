import React, { useState, useContext, useCallback } from "react";

import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  BLACK,
  DARKGREY,
  LIGHTGREY,
  MAGENTA,
  NAVYBLUE,
  WHITE,
} from "../config/Constants";

import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import User from "../services/User";
import AppContext from "../store/AppContext";
import { FlatGrid } from "react-native-super-grid";
import {
  Avatar,
  Headline,
  Surface,
  Button,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import Placeholder from "../components/Placeholder";
import { getDatabase, ref, onValue, child, get } from "firebase/database";
import { getFirestore, collection, where, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";
import { useList } from "react-firebase-hooks/database";
import Notification from "../services/Notification";
import { useDispatch, useSelector } from "react-redux";

const Explore = () => {
  const ctxt = useContext(AppContext);
  const [users, setUsers] = useState([]);
  //   const [friendReqs, setFriendReqs] = useState([]);
  const currentUser = useSelector((state) => state.user);

  const [fireVal, storeLoading, storeError] = useCollection(
    query(
      collection(db, "userInfo"),
      where("userId", "!=", currentUser.user.userId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useFocusEffect(useCallback(() => { }));

  const sendFriendRequest = async (friendId, type) => {
    await User.friendRequest(friendId, currentUser.user.userId, type);
  };

  const renderItem = ({ item }) => {
    {
      return currentUser.user.friends.includes(item.data().userId) ? (
        <></>
      ) : (
        <Card
          style={{
            flex: 1,
            margin: 5,
            marginBottom: 10,
            flexDirection: "row",
          }}
        >
          <Card.Cover source={{ uri: item.data().avatar }} />
          <Card.Content>
            <Title>{item.data().name}</Title>
            <Paragraph>@{item.data().username}</Paragraph>
          </Card.Content>
          <Card.Actions>
            {item.data().friendRequests.includes(currentUser.user.userId) ? (
              <TouchableOpacity
                onPress={() => sendFriendRequest(item.data().userId, "undo")}
              >
                <Text>pending</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => sendFriendRequest(item.data().userId, "request")}
              >
                <Text>Add Friend</Text>
              </TouchableOpacity>
            )}
          </Card.Actions>
        </Card>
      );
    }

    // {
    //   return item.data().friends &&
    //     item.data().friends.includes(item.data().userId) ? (
    //     <></>
    //   ) : (

    //   );
    // }
  };
  if (!currentUser.user) {
    return <Placeholder />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Surface
            style={{
              marginTop: 10,
              padding: 5,
              backgroundColor: LIGHTGREY,
            }}
          >
            <Headline>Add Friend</Headline>
          </Surface>

          {!storeLoading && (
            <FlatList
              key={2}
              keyExtractor={(item) => item.id}
              data={fireVal.docs}
              renderItem={(item) => renderItem(item)}
              numColumns={2}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingBottom: StatusBar.currentHeight,
    backgroundColor: MAGENTA,
  },

  card: {
    backgroundColor: LIGHTGREY,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,

    width: "100%",
  },
  cardBody: {
    marginHorizontal: 10,

    height: "100%",
  },
  postCard: {
    height: 100,
    backgroundColor: WHITE,
    marginTop: 15,
    elevation: 5,

    shadowColor: BLACK,
  },
  postCardFooter: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postCardFooterRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  profile: {
    flex: 1,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileInner: {
    width: "50%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Explore;
