import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Button,
  Surface,
  Divider,
  Avatar,
  Paragraph,
  Provider,
  Portal,
  FAB,
  IconButton,
  ProgressBar,
  Colors,
} from "react-native-paper";
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FontAwesome } from "@expo/vector-icons";
import UserAvatar from "react-native-user-avatar";
import AppContext from "../store/AppContext";
import { useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import { Video, AVPlaybackStatus } from "expo-av";
import VideoPlayer from "expo-video-player";
import {
  BLACK,
  DARKGREY,
  LIGHTGREY,
  MAGENTA,
  NAVYBLUE,
  WHITE,
} from "../config/Constants";
import Post from "../services/Post";
import { storage } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../store/model";
import * as RootNavigation from "../helpers/RootNavigation";
import Ionicons from "@expo/vector-icons/Ionicons";

const CreatePostInput = ({ postKey, isComment, isReply, navParams }) => {
  const context = useContext(AppContext);
  const postRef = useRef();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(false);
  const { colors } = useTheme();
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [post, setPost] = useState("");
  const videoRef = React.useRef(null);
  const [progress, setProgress] = useState(0);

  const postSomething = () => {
    if (isComment) {
      doComment();
      return;
    }
    if (isReply) {
      doReply();
      return;
    }

    doPost();
  };

  const doPost = async () => {
    let postData = {
      uid: user?.userId,
      postKey: postKey ? postKey : null,
      commKey: null,
      commentCount: 0,
      post,
      createdAt: Date.now(),
      profilePic: user?.avatar,
      theName: user?.name,
      username: user?.username,
    };

    try {
      if (image) {
        setDisabled(true);
        uploadImage(image, postData);
      } else if (video) {
        setDisabled(true);
        uploadVideo(video, postData);
      } else {
        if (post === "") {
          displayToast("Type something..");
          return;
        }
        setDisabled(true);
        try {
          let resp = await Post.addPost(postData);
          if (resp) {
            setDisabled(false);
            displayToast("Post published ! ");
            postRef.current.clear();
          }
        } catch (error) {
          console.log("failed to post because ", error);
          setDisabled(false);
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      setDisabled(false);
    }
  };
  const doComment = async () => {
    let postData = {
      uid: user?.userId,
      postKey: postKey,
      commKey: null,
      commentCount: 0,
      profilePic: user?.avatar,
      post,
      createdAt: Date.now(),
      theName: user?.name,
      username: user?.username,
    };

    try {
      if (image) {
        uploadImage(image, postData);
      } else if (video) {
        uploadVideo(video, postData);
      } else {
        if (post === "") {
          displayToast("Type something..");
          return;
        }
        setDisabled(true);
        let resp = await Post.addComment(postData);
        if (resp) {
          setDisabled(false);
          displayToast("Comment Posted");
          postRef.current.clear();
          dispatch(setModal(false));
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      setDisabled(false);
    }
  };

  const doReply = async () => {
    let postData = {
      uid: user?.userId,
      postKey: null,
      commKey: navParams.commentKey,
      commentCount: 0,
      profilePic: user?.avatar,
      theName: user?.name,
      username: user?.username,
      post,
      createdAt: Date.now(),
    };

    try {
      if (image) {
        uploadImage(image, postData);
      } else if (video) {
        uploadVideo(video, postData);
      } else {
        if (post === "") {
          displayToast("Type something..");
          return;
        }
        setDisabled(true);
        let resp = await Post.addReply(postData);
        if (resp) {
          setDisabled(false);
          displayToast("Reply Posted");
          postRef.current.clear();

          dispatch(setModal(false));
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      setDisabled(false);
    }
  };

  const uploadImage = async (imgData, postData) => {
    console.log(imgData);

    const storageRef = ref(storage, `Images/${Date.now()}`);

    console.log("uploading image");

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed")); // error occurred, rejecting
      };
      xhr.responseType = "blob"; // use BlobModule's UriHandler
      xhr.open("GET", imgData.uri, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });

    uploadBytes(storageRef, blob).then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((downloadURL) => {
          postData.coverImg = downloadURL;

          if (isComment) {
            Post.addComment(postData)
              .then((resp) => {
                if (resp) {
                  setDisabled(false);
                  displayToast("Comment Posted");
                  setImage(null);
                  postRef.current.clear();
                  dispatch(setModal(false));
                }
                return;
              })
              .catch((error) => {
                console.log(JSON.stringify(error));
              });
          } else if (isReply) {
            Post.addReply(postData)
              .then((resp) => {
                setDisabled(false);
                displayToast("Reply Posted");
                postRef.current.clear();
                setImage(null);
                dispatch(setModal(false));
              })
              .catch((error) => {
                console.log(JSON.stringify(error));
              });
            return;
          } else {
            Post.addPost(postData)
              .then(() => {
                setDisabled(false);
                setImage(null);
                postRef.current.clear();
                displayToast("Posted");
                dispatch(setModal(false));
              })
              .catch((error) => {
                setDisabled(false);
                displayToast("Failed to Post,try again");
              });
          }
        })
        .catch((error) => {
          console.log(error);
          setImage(null);
          return {
            uploaded: false,
          };
        });
    });
  };
  const uploadVideo = async (vidData, postData) => {

    const storageRef = ref(storage, `Videos/${Date.now()}`);

    // const vid = await fetch(vidData.uri);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed")); // error occurred, rejecting
      };
      xhr.responseType = "blob"; // use BlobModule's UriHandler
      xhr.open("GET", vidData.uri, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });
    //  const blob = await vid.blob();

    console.log("uploading video");

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, blob).then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((downloadURL) => {
          postData.video = downloadURL;

          if (isComment) {
            Post.addComment(postData)
              .then((resp) => {
                if (resp) {
                  setDisabled(false);
                  displayToast("Comment Posted");
                  postRef.current.clear();
                  setVideo(null);
                  dispatch(setModal(false));
                }
                return;
              })
              .catch((error) => {
                console.log(JSON.stringify(error));
              });
          } else if (isReply) {
            Post.addReply(postData)
              .then((resp) => {
                setDisabled(false);
                displayToast("Reply Posted");
                postRef.current.clear();
                setVideo(null);
                dispatch(setModal(false));
              })
              .catch((error) => {
                console.log(JSON.stringify(error));
              });
            return;
          } else {
            Post.addPost(postData)
              .then(() => {
                setDisabled(false);
                setImage(null);
                postRef.current.clear();
                displayToast("Posted");
                setVideo(null);
                dispatch(setModal(false));
              })
              .catch((error) => {
                setDisabled(false);
                setVideo(null);
                console.log(error);
                //  displayToast("Failed to Post,try again");
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  const pickImage = async () => {
    setVideo(null);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const pickVideo = async () => {
    setImage(null);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.cancelled) {
      console.log(result);
      setVideo(result);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const displayToast = (msg) => {
    Toast.show(msg, {
      duration: Toast.durations.LONG,
    });
  };

  return (
    <Card style={{ padding: 10, marginTop: 10 }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "50%",
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => RootNavigation.navigate("Profile")}
            >
              <UserAvatar name={user?.username} src={user?.avatar} size={35} />
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: 5 }}>
            <Text style={{ fontSize: 11 }}>{user?.name}</Text>
            <Text style={{ fontSize: 11 }}>@{user?.username}</Text>
          </View>
        </View>

      </View>
      <View style={{ marginTop: 10 }}>
        <TextInput
          placeholderTextColor={DARKGREY}
          placeholder="Type something.."
          onChangeText={(post) => setPost(post)}
          focusable={true}
          multiline={true}
          ref={postRef}
          numberOfLines={4}
        />
      </View>
      {video && (
        <>
          <VideoPlayer
            style={{
              height: 180,
              marginBottom: 15,
            }}
            videoProps={{
              shouldPlay: true,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              source: {
                uri: video.uri,
              },
            }}
          />
        </>
      )}
      {image && (
        <View
          style={{
            position: "relative",
            width: 100,
          }}
        >
          <Image
            source={{ uri: image.uri }}
            style={{ width: 100, height: 100 }}
          />
          <FontAwesome
            style={{
              position: "absolute",
              top: -10,
              right: -5,
            }}
            onPress={removeImage}
            color={colors.primary}
            size={20}
            name="times"
          />
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 15,
        }}
      >
        <View></View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <TouchableOpacity
              style={{
                marginRight: 5,
              }}
              onPress={pickVideo}
            >
              <Ionicons size={25} name="videocam" />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={pickImage}>
              <Ionicons size={25} name="camera" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginLeft: 10,
            }}
          >
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
                width: 100,
                backgroundColor: isDisabled ? LIGHTGREY : colors.accent,
              }}
              onPress={postSomething}
            >
              <Text
                style={{
                  color: isDisabled ? NAVYBLUE : WHITE,
                  alignSelf: "center",
                }}
              >
                {isDisabled ? "Posting..." : "Post"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default CreatePostInput;
