import React, { useState, useEffect, useContext } from "react";
import * as RootNavigation from "../helpers/RootNavigation";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Text,
} from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { useTheme } from "react-native-paper";
import moment from "moment";
import UserAvatar from "react-native-user-avatar";
import { DARKGREY, LIGHTGREY, MAGENTA, WHITE } from "../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import AppContext from "../store/AppContext";
import Post from "../services/Post";
import { Video, AVPlaybackStatus } from "expo-av";
import VideoPlayer from "expo-video-player";
import { useRoute } from "@react-navigation/native";
import { db } from "../config/firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";

const CommentCard = ({ comment, commentKey }) => {
  const context = useContext(AppContext);
  const { colors } = useTheme();
  const route = useRoute();
  const currentUser = useSelector((state) => state.user);
  const [commentUser, loading, storeError] = useDocument(
    doc(db, "userInfo", comment.uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const doLike = async (key, uid) => {
    await Post.likeComment(key, uid);
  };

  const doReply = async (comment) => {
    RootNavigation.navigate("Reply", {
      reply: comment,
      commentKey,
    });
  };
  return (
    <View style={styles.commentContainer}>
      <View>
        {!loading ? (
          <TouchableOpacity
            onPress={() =>
              RootNavigation.navigate(
                currentUser.user.userId === commentUser.data().userId
                  ? "Profile"
                  : "ViewProfile",
                {
                  uid: commentUser.data().userId,
                }
              )
            }
          >
            <UserAvatar
              src={commentUser.data().avatar}
              size={30}
              name={commentUser.data().name}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>

      <View style={styles.comment}>
        <View style={styles.commentBody}>
          {comment.coverImg && (
            <ImageBackground
              source={{
                uri: comment.coverImg,
              }}
              resizeMode="cover"
              style={styles.image}
            ></ImageBackground>
          )}
          {comment.video && (
            <VideoPlayer
              style={{
                height: 180,
                marginBottom: 15,
              }}
              videoProps={{
                shouldPlay: false,
                resizeMode: Video.RESIZE_MODE_CONTAIN,
                source: {
                  uri: comment.video,
                },
              }}
            />
          )}
          <Text style={{ fontWeight: "bold" }}>
            {comment.theName} @{comment.username}
          </Text>
          <Text style={{ marginTop: 10 }}>{comment.post}</Text>
        </View>

        <View style={styles.commentFooter}>
          <View>
            <TouchableOpacity onPress={() => doReply(comment)}>
              <Text>Reply</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => doLike(commentKey, currentUser.user.userId)}
            >
              <View>
                <Ionicons
                  color={
                    comment.likes &&
                      comment.likes.includes(currentUser.user.userId)
                      ? MAGENTA
                      : "gray"
                  }
                  style={{
                    fontWeight: "700",
                  }}
                  size={20}
                  name={
                    comment.likes &&
                      comment.likes.includes(currentUser.user.userId)
                      ? "heart"
                      : "heart-outline"
                  }
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <Text>{comment.likes ? comment.likes.length : "0"}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginLeft: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Ionicons
                color={MAGENTA}
                style={{
                  fontWeight: "700",
                }}
                size={20}
                name="time-outline"
              />
            </View>
            <Text
              style={{
                color: MAGENTA,
              }}
            >
              {moment(comment.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommentCard;
const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    marginTop: 30,
    padding: 10,
    width: "78%",
  },
  comment: {
    marginLeft: 15,
    flexGrow: 1,
  },
  commentBody: {
    backgroundColor: WHITE,
    padding: 10,
  },
  commentFooter: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: LIGHTGREY,
  },
  image: {
    height: 200,
    width: "100%",
  },
});
