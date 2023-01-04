import React, { useContext } from "react";
import { FAB, List } from "react-native-paper";
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
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  BLACK,
  DARKGREY,
  LIGHTGREY,
  MAGENTA,
  NAVYBLUE,
  WHITE,
} from "../config/Constants";
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
import * as RootNavigation from "../helpers/RootNavigation";
import { db } from "../config/firebase";

import { useDispatch, useSelector } from "react-redux";
import ChatLog2 from "../components/ChatLog2";
import Placeholder from "../components/Placeholder";

const Chat = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);

  const nav = useRoute();

  if (nav.params.friends.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardBody}>
            <ScrollView>
              <Text>You have no friends yet</Text>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const [friends, storeLoading, storeError] = useCollection(
    query(
      collection(db, "userInfo"),
      where("userId", "in", nav.params.friends)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        title: `Messages`,
      });
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <ScrollView>
            {/* {!storeLoading ? <ChatLog friends={friends.docs} /> : <></>} */}
            {!storeLoading ? (
              <ChatLog2 friends={friends.docs} />
            ) : (
              <Placeholder />
            )}
          </ScrollView>
        </View>
      </View>
      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        label="Start Chat"
        small
        icon="plus"
        onPress={() =>
          RootNavigation.navigate("StartChat", {
            chatKey: null,
          })
        }
      />
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

export default Chat;
