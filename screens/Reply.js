import React, { useContext, useState, useRef, useEffect } from "react";

import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
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
import AppContext from "../store/AppContext";
import {
  Card,
  Button,
  Surface,
  Divider,
  Avatar,
  Paragraph,
  Provider,
  Modal,
  Portal,
  FAB,
} from "react-native-paper";
import UserAvatar from "react-native-user-avatar";
import {
  doc,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  query,
  getDocs,
  onSnapshot,
  where,
  getDoc,
} from "firebase/firestore";

import Pst from "../services/Post";
import { db } from "../config/firebase";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref,
} from "firebase/storage";
import Toast from "react-native-root-toast";
import CommentCard from "../components/CommentCard";
import User from "../services/User";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Placeholder from "../components/Placeholder";
import CreatePostInput from "../components/CreatePostInput";
import Post from "../services/Post";
import * as RootNavigation from "../helpers/RootNavigation";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../store/model";
import Ionicons from "@expo/vector-icons/Ionicons";
import LikeCommentBar from "../components/LikeCommentBar";

const getUsr = async (uid) => {
  return await User.getUser(uid);
};
const Reply = ({ navigation, route }) => {
  const context = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [routeKeys, setRouteKeys] = useState([]);
  const [postOwner, setPostOwner] = useState(null);
  const currentUser = useSelector((state) => state.user);

  const { showModal } = useSelector((state) => state.modal);
  const hideModal = () => {
    dispatch(setModal(false));
  };

  const nav = useRoute();
  const dispatch = useDispatch();

  const [postReplies, storeLoading, storeError] = useCollection(
    query(
      collection(db, "comments"),
      where("commKey", "==", nav.params.commentKey)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    navigation.setOptions({
      title: `Add Reply`,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {

      getUsr(nav.params.reply.uid)
        .then((user) => {
          setPostOwner(user);
        })
        .catch((error) => {
          console.log(error);
        });

      return () => { };
    }, [navigation])
  );

  const LeftContent = (props) => (
    <TouchableOpacity
      onPress={() =>
        RootNavigation.navigate(
          currentUser.user.userId === nav.params.reply.uid
            ? "Profile"
            : "ViewProfile",
          {
            uid:
              currentUser.user.userId === nav.params.reply.uid
                ? currentUser.user.userId
                : nav.params.reply.uid,
          }
        )
      }
    >
      <Avatar.Image size={50} source={{ uri: nav.params.reply.profilePic }} />
    </TouchableOpacity>
  );
  const doLike = async (comment, uid) => {
    await Post.likeComment(comment.commKey, uid);
  };

  const startPostDialog = () => {
    dispatch(setModal(true));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <ScrollView>
            <Card>
              <Card.Title
                title={`${nav.params.reply.theName}`}
                subtitle={`@${nav.params.reply.username}`}
                left={LeftContent}
              />

              <Card.Content>
                <Paragraph>
                  {nav.params.reply && nav.params.reply.post}
                </Paragraph>
              </Card.Content>
              {nav.params.reply && nav.params.reply.coverImg && (
                <ImageBackground
                  source={{
                    uri: nav.params.reply.coverImg,
                  }}
                  resizeMode="contain"
                  style={styles.image}
                ></ImageBackground>
              )}
            </Card>
            <View></View>

            <Surface
              style={{
                marginTop: 10,
              }}
            >
              <LikeCommentBar
                node={`comments`}
                isComment={true}
                postkey={nav.params.commentKey}
              />
              <Divider
                style={{
                  backgroundColor: DARKGREY,
                  marginTop: 10,
                }}
              />
            </Surface>

            {/* comments */}
            {storeLoading ? (
              <Placeholder />
            ) : (
              postReplies.docs.map((comment, i) => {
                console.log(comment.data());
                return (
                  <CommentCard
                    commentKey={comment.id}
                    key={i}
                    comment={comment.data()}
                  />
                );
              })
            )}
          </ScrollView>
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
            <CreatePostInput
              navParams={nav.params}
              isComment={false}
              isReply={true}
            />
          </Modal>
        </Portal>

        <View
          style={{
            position: "absolute",
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: BLACK,
          }}
        >
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
    marginTop: 10,
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
  image: {
    minHeight: 200,
  },
});

export default Reply;
