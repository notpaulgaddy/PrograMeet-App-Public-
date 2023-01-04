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
import {
  Tabs,
  TabScreen,
  useTabIndex,
  useTabNavigation,
} from "react-native-paper-tabs";
import { StatusBar } from "expo-status-bar";
import {
  BLACK,
  DARKGREY,
  LIGHTGREY,
  MAGENTA,
  NAVYBLUE,
  WHITE,
} from "../config/Constants";
import EditAbout from "./profile-edit/EditAbout";
import EditPrompts from "./profile-edit/EditPrompts";
import EditPosts from "./profile-edit/EditPosts";
import EditProjects from "./profile-edit/EditProjects";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { db } from "../config/firebase";
import Placeholder from "../components/Placeholder";

const EditProfile = () => {
  const r = useRoute();
  const [user, fetching, error] = useDocument(
    doc(db, "userInfo", `${r.params.uid}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (fetching) {
    return <Placeholder />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Tabs
            style={{
              backgroundColor: WHITE,
              marginTop: 10,
              elevation: 0,
            }}
            mode="scrollable"
            disableSwipe={true}
            uppercase={false}
            styles={styles.tabsArea}
            defaultIndex={0}
            showLeadingSpace={false}
          >
            <TabScreen label="About">
              <EditAbout user={user.data()} />
            </TabScreen>
            <TabScreen label="Prompts">
              <EditPrompts user={user.data()} />
            </TabScreen>
            <TabScreen label="Posts">
              <EditPosts user={user.data()} />
            </TabScreen>
            <TabScreen label="Projects">
              <EditProjects user={user.data()} />
            </TabScreen>
          </Tabs>
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

export default EditProfile;
