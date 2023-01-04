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
  TouchableOpacity,
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
import { useDispatch, useSelector } from "react-redux";
import {
  FAB,
  List,
  Surface,
  MD3Colors,
  Chip,
  IconButton,
} from "react-native-paper";
import {
  getFirestore,
  doc,
  query,
  orderBy,
  collection,
} from "firebase/firestore";
import * as RootNavigation from "../helpers/RootNavigation";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import Placeholder from "../components/Placeholder";
import { db } from "../config/firebase";
import CoachBox from "../components/CoachBox";
import SearchBox from "../components/SearchBox";

const Coaches = () => {
  const { user } = useSelector((state) => state.user);
  const { searchData } = useSelector((state) => state.search);
  const [fireVal, loading, storeError] = useCollection(
    query(
      collection(db, "coaches"),
      orderBy("createdAt", "desc")
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (loading) {
    return <Placeholder />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <ScrollView>
            <SearchBox
              type={`coaches`}
              placeholderText={`Search coach by name`}
            />

            {searchData &&
              searchData.results !== "" &&
              searchData.type === "coaches" &&
              JSON.parse(searchData.results) &&
              JSON.parse(searchData.results).length > 0 ? (
              JSON.parse(searchData.results).map((item, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(
                        setSearch({
                          type: "coaches",
                          results: "",
                        })
                      );
                      RootNavigation.navigate("Coach", {
                        coach: item,
                      });
                    }}
                  >
                    <View key={i}>
                      <Surface
                        style={{
                          marginTop: 5,
                        }}
                        elevation={2}
                      >
                        <List.Section>
                          <List.Item
                            title={item.fName}
                            description={item.bio}
                            left={() => (
                              <List.Icon color={NAVYBLUE} icon="check" />
                            )}
                            right={() => {
                              return (
                                <List.Icon
                                  color={NAVYBLUE}
                                  icon="chevron-right"
                                />
                              );
                            }}
                          />
                          <View
                            style={{
                              flexDirection: "row",
                            }}
                          >
                            <Chip
                              style={{
                                marginLeft: 10,
                              }}
                              selectedColor={MAGENTA}
                              selected={true}
                              icon={"map-marker"}
                            >
                              {item.location}
                            </Chip>
                          </View>
                        </List.Section>
                      </Surface>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <></>
            )}

            <View
              style={{
                marginTop: 45,
              }}
            >
              {fireVal.docs.map((snap, i) => {
                return (
                  <>
                    <CoachBox
                      avatar={snap.data().avatar}
                      userType={user.accessLevel}
                      fName={snap.data().fName}
                      location={snap.data().location}
                      email={snap.data().email}
                      phone_number={snap.data().phone_number}
                      bio={snap.data().bio}
                      coachKey={snap.id}
                      createdAt={snap.data().createdAt}
                      navigation={RootNavigation}
                      key={i}
                    />
                  </>
                );
              })}
            </View>
          </ScrollView>
          {user.accessLevel === "admin" ? (
            <FAB
              label="Add Coach"
              icon="plus"
              style={{
                position: "absolute",
                margin: 16,
                right: 0,
                bottom: 0,
              }}
              onPress={() => RootNavigation.navigate("Create Coach")}
            />
          ) : null}
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

export default Coaches;
