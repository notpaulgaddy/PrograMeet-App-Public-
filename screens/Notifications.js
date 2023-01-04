import React, { useContext, useState } from "react";

import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  SafeAreaView,
  Image,
  SectionList,
  View,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  getFirestore,
  collection,
  getDoc,
  where,
  query,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";
import AppContext from "../store/AppContext";
import { Avatar, Button, Divider, List, Surface } from "react-native-paper";
import User from "../services/User";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import moment from "moment";
import {
  BLACK,
  DARKGREY,
  LIGHTGREY,
  MAGENTA,
  NAVYBLUE,
  WHITE,
} from "../config/Constants";
import Placeholder from "../components/Placeholder";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/user";
import Notification from "../services/Notification";
let notArr = [];
let notiObj = {};
const Notifications = () => {
  const ctxt = useContext(AppContext);
  const [DATA, setDATA] = useState({});
  const [friendRequests, setFriendRequests] = useState([]);

  const [isSending, setSending] = useState(false);
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [value, loading, error] = useCollection(
    query(
      collection(db, "notifications"),
      where("receiver", "==", currentUser.user.userId)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  React.useEffect(() => { }, []);

  const acceptFriend = async (uid, friendId, notifyKey) => {
    setSending(true);
    User.acceptFriendReqst(uid, friendId, notifyKey)
      .then((snap) => {
        User.getUser(uid)
          .then((user) => {
            dispatch(setUser(user));
            Notification.remNotification(notifyKey);
            setSending(false);
          })
          .catch((error) => {
            console.log("error ", error);
            setSending(false);
          });
      })
      .catch((error) => {
        setSending(false);
      });
  };

  const deleteReq = async (uid, friendId, notifyKey) => {
    setSending(true);
    await User.rejectRequest(uid, friendId);
    await Notification.remNotification(notifyKey);
    setSending(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          {!loading &&
            value.docs.filter((item) => item.data().type === "FRIEND_REQUEST")
              .length > 0 ? (
            <List.Subheader>Friend Requests</List.Subheader>
          ) : (
            <></>
          )}

          {!loading ? (
            value.docs
              .filter((item) => item.data().type === "FRIEND_REQUEST")
              .map((snap, i) => {
                return (
                  <View key={i}>
                    <List.Section>
                      <List.Item
                        left={() => (
                          <Avatar.Image
                            source={{
                              uri: snap.data().senderData.avatar,
                            }}
                            size={45}
                          />
                        )}
                        title={`${snap.data().senderData.name
                          } sent a friend request`}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        <View>
                          <Button
                            icon="check"
                            loading={isSending}
                            mode="flat"
                            onPress={() =>
                              acceptFriend(
                                currentUser.user.userId,
                                snap.data().sender,
                                snap.id
                              )
                            }
                          >
                            Accept
                          </Button>
                        </View>
                        <View>
                          <Button
                            icon="close-circle"
                            loading={isSending}
                            mode="flat"
                            onPress={() => {
                              deleteReq(
                                currentUser.user.userId,

                                snap.data().sender,
                                snap.id
                              );
                            }}
                          >
                            Reject
                          </Button>
                        </View>
                      </View>
                    </List.Section>
                  </View>
                );
              })
          ) : (

            <Placeholder />
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
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  cardBody: {
    marginHorizontal: 10,
    flex: 1,
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

export default Notifications;
