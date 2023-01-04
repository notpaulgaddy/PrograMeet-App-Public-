import React, { useContext, useState, useRef, useEffect } from "react";

import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
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
import AppContext from "../store/AppContext";
import {
  Card,
  Button,
  Surface,
  Divider,
  Modal,
  Avatar,
  Paragraph,
  Provider,
  Portal,
  FAB,
  TouchableRipple,
  ActivityIndicator,
} from "react-native-paper";

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
import { Video, AVPlaybackStatus } from "expo-av";
import VideoPlayer from "expo-video-player";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as RootNavigation from "../helpers/RootNavigation";

import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref,
} from "firebase/storage";
import Toast from "react-native-root-toast";
import CommentCard from "../components/CommentCard";
import User from "../services/User";
import Placeholder from "../components/Placeholder";
import CreatePostInput from "../components/CreatePostInput";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { setModal } from "../store/model";
import LikeCommentBar from "../components/LikeCommentBar";

const getUsr = async (uid) => {
  return await User.getUser(uid);
};
const Post = ({ navigation }) => {
  const context = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postOwner, setPostOwner] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const { showModal } = useSelector((state) => state.modal);
  const [vid, setVid] = useState(null);
  const dispatch = useDispatch();
  const nav = useRoute();
  const [postComments, storeLoading, storeError] = useCollection(
    query(
      collection(db, "comments"),
      where("postKey", "==", nav.params.postKey)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const hideModal = () => {
    dispatch(setModal(false));
  };

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        title: `Comments`,
      });
      if (nav.params.post.video) setVid(nav.params.post.video);
      getUsr(nav.params.post.uid)
        .then((user) => {
          setPostOwner(user);
        })
        .catch((error) => {
          console.log(error);
        });
      return () => {
      };
    }, [])
  );

  useEffect(() => { }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <ScrollView>
            <Card>
              {postOwner ? (
                <Card.Title
                  title={`${postOwner.name}`}
                  subtitle={`@${postOwner.username}`}
                  left={() => (
                    <TouchableOpacity
                      onPress={() =>
                        RootNavigation.navigate(
                          currentUser.user.userId === postOwner.userId
                            ? "Profile"
                            : "ViewProfile",
                          {
                            uid:
                              currentUser.user.userId === postOwner.userId
                                ? currentUser.user.userId
                                : postOwner.userId,
                          }
                        )
                      }
                    >
                      <Avatar.Image
                        size={50}
                        source={{ uri: postOwner.avatar }}
                      />
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <ActivityIndicator />
              )}

              <Card.Content>
                <Paragraph>{nav.params.post.post}</Paragraph>
              </Card.Content>
              {nav.params.post.coverImg && (
                <ImageBackground
                  source={{ uri: `${nav.params.post.coverImg}` }}
                  resizeMode="contain"
                  style={{
                    height: 300,
                  }}
                ></ImageBackground>
              )}

              {nav.params.post && nav.params.post.video && (
                <Video
                  style={{
                    height: 250,
                    width: Dimensions.get("window").width,
                    marginBottom: 15,
                    alignSelf: "center",
                  }}
                  resizeMode="contain"
                  useNativeControls={true}
                  source={{
                    uri: vid,
                  }}
                />
              )}
            </Card>
            <Divider
              style={{
                backgroundColor: "#6B6983",
                marginTop: 10,
              }}
            />
            <LikeCommentBar
              node={`posts`}
              isComment={false}
              postkey={nav.params.postKey}
            />
            <Divider
              style={{
                backgroundColor: DARKGREY,
                marginTop: 10,
              }}
            />
            {storeLoading ? (
              <Placeholder />
            ) : (
              postComments.docs.map((comment, i) => {
                return (
                  <CommentCard
                    key={i}
                    commentKey={comment.id}
                    comment={comment.data()}
                  />
                );
              })
            )}
          </ScrollView>
        </View>

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
        <Portal>
          <Modal
            visible={showModal}
            onDismiss={hideModal}
            contentContainerStyle={{
              marginHorizontal: 10,
              backgroundColor: "white",
            }}
          >
            <CreatePostInput
              postKey={nav.params.postKey}
              isReply={false}
              isComment={true}
            />
          </Modal>
        </Portal>
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
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
});

export default Post;
