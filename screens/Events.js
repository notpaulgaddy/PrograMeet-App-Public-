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
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BLACK,
  DARKGREY,
  LIGHTGREY,
  MAGENTA,
  NAVYBLUE,
  WHITE,
} from "../config/Constants";
import EventBox from "../components/EventBox";
import SearchBox from "../components/SearchBox";
import {
  FAB,
  List,
  Surface,
  MD3Colors,
  Chip,
  IconButton,
} from "react-native-paper";
import * as RootNavigation from "../helpers/RootNavigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getFirestore,
  doc,
  query,
  orderBy,
  collection,
} from "firebase/firestore";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";
import Placeholder from "../components/Placeholder";
import moment from "moment";
import { setSearch } from "../store/search";
import EventService from "../services/EventService";

const Events = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const { searchData } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const inputRef = React.useRef("");
  const [clear, showClear] = React.useState(false);
  const [isSearching, setSearching] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [fireVal, loading, storeError] = useCollection(
    query(collection(db, "events"), orderBy("createdAt", "desc")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (loading) {
    return <Placeholder />;
  }

  const doSearch = (q) => {
    if (q === "") {
      setSearching(false);
      return;
    }
    if (q.length >= 3) {
      setSearching(true);

      EventService.search(q)
        .then((snap) => {
          console.log(snap.docs);
          snap.docs.map((snp) => {
            console.log(snp.data());
          });
          setResults(snap.docs);
        })
        .catch((errors) => {
          console.log(errors);
        });
    } else {
      setResults(null);
      setSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <ScrollView>
            <View
              style={{
                borderColor: DARKGREY,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderRadius: 25,
                justifyContent: "space-evenly",
                marginTop: 15,
              }}
            >
              <View
                style={{
                  padding: 3,
                }}
              >
                <Ionicons name="search-outline" size={35} color={DARKGREY} />
              </View>
              <View
                style={{
                  padding: 3,
                  width: "60%",
                }}
              >
                <TextInput
                  ref={inputRef}
                  onChangeText={(q) => doSearch(q)}
                  placeholderTextColor={"black"}
                  style={{
                    flexGrow: 1,
                  }}
                  placeholder={`Search for events`}
                />
              </View>
              {clear ? (
                <View
                  style={{
                    justifyContent: "flex-end",
                  }}
                >
                  <Ionicons
                    onPress={() => {
                      inputRef.current.clear();
                      showClear(false);
                    }}
                    size={20}
                    name="close-circle-sharp"
                    color={MAGENTA}
                  />
                </View>
              ) : (
                <View
                  style={{
                    padding: 3,
                    width: "20%",
                  }}
                ></View>
              )}
            </View>

            {results &&
              results.map((item, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      RootNavigation.navigate("Event", {
                        event: item.data(),
                        eventKey: item.id,
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
                            title={item.data().eventTitle}
                            description={item.data().eventLink}
                            // link={item.data().eventLink}
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
                              icon={"star"}
                            >
                              {item.data().eventType}
                            </Chip>
                          </View>
                        </List.Section>
                      </Surface>
                    </View>
                  </TouchableOpacity>
                );
              })}
            {!isSearching ? (
              <View>
                {fireVal.docs.map((snap, i) => {
                  return (
                    <EventBox
                      key={i}
                      navigation={RootNavigation}
                      eventKey={snap.id}
                      userType={user?.accessLevel}
                      eventType={snap.data().eventType}
                      eventName={snap.data().eventTitle}
                      eventLink={snap.data().eventLink}
                      // eventTime={moment(snap.data().eventDate.toDate()).format(
                      // 	"llll"
                      // )}
                      eventDate={snap.data().eventDate}
                      eventDescription={snap.data().eventDescription}
                      createdAt={snap.data().createdAt}
                    />
                  );
                })}
              </View>
            ) : (
              <></>
            )}
          </ScrollView>
          {user.accessLevel === "admin" ? (
            <FAB
              label="Create Event"
              icon="plus"
              style={{
                position: "absolute",
                margin: 16,
                right: 0,
                bottom: 0,
              }}
              onPress={() => RootNavigation.navigate("Create Events")}
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

export default Events;
