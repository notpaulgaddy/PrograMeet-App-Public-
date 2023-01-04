import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useReducer,
} from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  SafeAreaView,
  Image,
  View,
  FlatList,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";

import AppContext from "../store/AppContext";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserAvatar from "react-native-user-avatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCollection } from "react-firebase-hooks/firestore";

import {
  doc,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  query,
  getDocs,
  orderBy,
  onSnapshot,
  getDoc,
  where,
} from "firebase/firestore";

import {
  BLACK,
  DARKGREY,
  LIGHTGREY,
  MAGENTA,
  NAVYBLUE,
  WHITE,
} from "../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import { Badge, IconButton, Modal, Portal, useTheme } from "react-native-paper";

import Settings from "./Settings";
import Search from "./Search";
import Events from "./Events";
import PostCard from "../components/PostCard";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import Toast from "react-native-root-toast";
import Post from "../services/Post";
import * as ImagePicker from "expo-image-picker";
import { db } from "../config/firebase";
import User from "../services/User";
import Placeholder from "../components/Placeholder";
import CreatePostInput from "../components/CreatePostInput";
import Explore from "./Explore";
import Chat from "./Chat";
import { useDispatch, useSelector } from "react-redux";
import NotificationIcon from "../components/NotificationIcon";
import user from "../store/user";
import Block from "../services/Block";
import blockList from "../services/blockList";
import * as RootNavigation from "../helpers/RootNavigation";
import Coaches from "./Coaches";
import { NotificationChats } from "../components/NotificationChats";
import { setModal } from "../store/model";
import PushNotification from "../services/PushNotification";

const Tab = createBottomTabNavigator();

const HomePosts = ({ navigation, props, theme, user, blockUsers = [] }) => {
  const { showModal } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const [posts, loading, error] = useCollection(
    Post.getUsersPosts(blockUsers),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => RootNavigation.navigate("NotificationTest")}
      ><Text>Test Page</Text></TouchableOpacity> */}
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <View
            style={{
              marginTop: 15,
              paddingHorizontal: 5,
            }}
          >
            {loading ? (
              <Placeholder />
            ) : (
              <FlatList
                data={posts?.docs}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                  <CreatePostInput isReply={false} isComment={false} />
                }
                renderItem={({ item }) => (
                  <PostCard
                    key={item.id}
                    postKey={item.id}
                    post={item.data()}
                    theme={theme}
                    navigation={null}
                    user={user}
                  />
                )}
              />
            )}

            <TouchableOpacity
              onPress={() => dispatch(setModal(true))}
              style={{
                backgroundColor: NAVYBLUE,
                width: 65,
                height: 65,
                borderRadius: 50,
                position: "absolute",
                bottom: 15,
                alignItems: "center",
                flexDirection: "row",
                right: 10,
                justifyContent: "center",
              }}
            >
              <View>
                <Image
                  style={{
                    alignSelf: "center",
                  }}
                  source={require("../assets/logo-ic.png")}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => dispatch(setModal(false))}
          contentContainerStyle={{
            marginHorizontal: 10,
            backgroundColor: "white",
          }}
        >
          <CreatePostInput postKey={null} isReply={false} isComment={false} />
        </Modal>
      </Portal>

      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const Home = (props) => {
  const context = useContext(AppContext);
  const { colors } = useTheme();
  const { user } = useSelector((state) => state.user);
  const { appState } = useSelector((state) => state.appState);
  const [blockUsers, setBlockUsers] = useState(null);
  const theme = useTheme();

  const handleOnGetBlockUsers = async () => {
    const _blockUsers = await blockList.getBlockUsers(user.userId);
    setBlockUsers(_blockUsers);
  };

  useEffect(() => {
    console.log();
    if (user) {
      handleOnGetBlockUsers();
    }
  }, [user]);

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerRight: (prop) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              <View>{user ? <NotificationIcon props={prop} /> : <></>}</View>
              {user ? <NotificationChats user={user} /> : null}
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => RootNavigation.navigate("Account")}
            >
              <UserAvatar
                style={{
                  marginLeft: 10,
                }}
                src={user?.avatar}
                name={user?.name}
                size={35}
              />
            </TouchableOpacity>
          ),

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home";
              return <FontAwesome name={iconName} size={30} color={DARKGREY} />;
            } else if (route.name === "Search") {
              iconName = focused ? "search" : "search";
              return <FontAwesome name={iconName} size={30} color={DARKGREY} />;
            }
            // else if (route.name === "Explore") {
            //   return <Image source={require(`../assets/feed.png`)} />;

            // }
            else if (route.name === "Events") {
              return <Image source={require(`../assets/events.png`)} />;
            } else if (route.name === "Coaches") {
              return (
                <Ionicons
                  name="people-circle-outline"
                  size={30}
                  color={DARKGREY}
                />
              );
            } else if (route.name === "Chat") {
              iconName = focused ? "comment" : "comment-o";
              return <FontAwesome name={iconName} size={30} color={DARKGREY} />;
            }
          },
        })}
        initialRouteName="Home"
      >
        <Tab.Screen
          options={{
            tabBarActiveTintColor: colors.primary,
            headerShown: true,
            headerStyle: {
              backgroundColor: MAGENTA,
            },
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerTintColor: WHITE,

            tabBarLabelStyle: {
              fontSize: 13,
            },
          }}
          name="Home"
        >
          {() =>
            user && blockUsers !== null ? (
              <HomePosts
                props={props}
                theme={theme}
                user={user}
                blockUsers={blockUsers}
              />
            ) : (
              <Placeholder />
            )
          }
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarActiveTintColor: colors.primary,
            headerShown: true,
            headerStyle: {
              backgroundColor: MAGENTA,
            },
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerTintColor: WHITE,
            tabBarLabelStyle: {
              fontSize: 13,
            },
          }}
          name="Search"
          component={Search}
        />
        <Tab.Screen
          options={{
            tabBarActiveTintColor: colors.primary,
            headerShown: true,
            headerStyle: {
              backgroundColor: MAGENTA,
            },
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerTintColor: WHITE,
            tabBarLabelStyle: {
              fontSize: 13,
            },
          }}
          name="Events"
          component={Events}
        />
        <Tab.Screen
          options={{
            tabBarActiveTintColor: colors.primary,
            headerShown: true,
            headerStyle: {
              backgroundColor: MAGENTA,
            },
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerTintColor: WHITE,

            tabBarLabelStyle: {
              fontSize: 13,
            },
          }}
          name="Coaches"
          component={Coaches}
        />
      </Tab.Navigator>
    </NavigationContainer>
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

export default Home;

//he's still showing on my home page after i blocked him and refreshed
// you have to refresh the home scr

//yep, good stuff, i'll check on the other db when i get back, once that's done, i'll complete the order. i'll message you when i finish the order in about 1 hour, good work

// Can you please send me the last user email amd password . //So I can check it in my computer
// email is shadykipkorir@gmail.com
//password is linspace

//Can you please send me your github account
//notpaulgaddy
//https://github.com/shahnawazhussain125/PrograMeet/invitations accept invitaion
//few moments, i'll disconnect and come back
