import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Button,
  BackHandler,
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

import AppContext from "../store/AppContext";
import * as RootNavigation from "../helpers/RootNavigation";

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  ActivityIndicator,
  Avatar,
  Divider,
  IconButton,
  List,
  Paragraph,
  Surface,
} from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import User from "../services/User";
import Toast from "react-native-root-toast";
import Message from "../services/Message";
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
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
import fireApp from "../config/firebase";
import Placeholder from "../components/Placeholder";
import { useDispatch, useSelector } from "react-redux";
import { useList, useObject } from "react-firebase-hooks/database";
import OnlineIndicator from "../components/OnlineIndicator";
import ChatViewObserver from "../services/ChatViewObserver";
import { setActiveChatUser } from "../store/chatview";
import ChatBubbleRight from "../components/ChatBubbleRight";
import ChatBubbleLeft from "../components/ChatBubbleLeft";
import { Audio } from "expo-av";
import FileHandler from "../services/FileHandler";
import { getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import FilePicker from "../components/FilePicker";
import MessageBox from "../components/MessageBox";
import PushNotification from "../services/PushNotification";

const ChatScreen = ({ navigation }) => {
  const ctxt = React.useContext(AppContext);
  const [user, setUser] = React.useState(null);

  const [disabled, setDisabled] = React.useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [sound, setSound] = React.useState(false);
  const [recording, setRecording] = React.useState();
  const [audioUri, setAudioUri] = React.useState(null);
  const [docData, setDocData] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const currentUser = useSelector((state) => state.user);
  const { chatKey } = useSelector((state) => state.chatkey);
  const [chatId, setChatId] = React.useState(null);
  const msgRef = React.useRef("");
  const scrollViewRef = React.useRef();
  const dispatch = useDispatch();
  const nav = useRoute();
  let msgArray = [];
  let tracker = 0;
  let message = "";
  const [status, loading, error] = useList(
    ref(getDatabase(fireApp), `chatView`)
  );

  useEffect(() => {
    if (nav.params.chatKey !== undefined) {
      setChatId(nav.params.chatKey);
    }
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current.scrollToEnd();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [chatId]);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        title: ``,
      });

      dispatch(setActiveChatUser(nav.params.uid));
      // setSound(undefined);

      ChatViewObserver.onChatView(currentUser.user.userId, nav.params.uid);
      if (nav.params.chatKey) {
        ChatViewObserver.setRecentChatRead(nav.params.chatKey);
        ChatViewObserver.setRead(nav.params.chatKey);
      }
      User.getUser(nav.params.uid)
        .then((user) => {
          setUser(user);
          navigation.setOptions({
            title: ``,
            activeUser: nav.params.uid,
            headerBackVisible: true,
            headerLeft: () => (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ position: "relative" }}>
                  <Avatar.Image
                    size={45}
                    source={{
                      uri: user.avatar,
                    }}
                  />

                  <OnlineIndicator receiver={nav.params.uid} />
                </View>
                <View>
                  <Text
                    style={{
                      color: LIGHTGREY,
                      marginLeft: 10,
                      marginTop: 200,
                    }}
                  >
                    {user.name}
                  </Text>
                </View>
              </View>
            ),
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }, [])
  );

  const doRecord = async () => {
    try {
      console.log("Requesting permissions..");
      setDocData(null);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      displayToast("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
      displayToast("Failed to start recording.");
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
    console.log("Recording stopped and stored at ", uri);
  };

  const doPlay = async () => {
    const { sound, status } = await Audio.Sound.createAsync({
      uri: audioUri,
    });
    setSound(sound);
    await sound.playAsync();
    setIsPlaying(true);
    console.log(status);
  };

  const stopPlay = async () => {
    await sound.unloadAsync();
    setIsPlaying(false);
  };

  const pickAttachment = () => {
    setDisabled(true);
    setDocData(null);
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    })
      .then((result) => {
        console.log(result);
        setDisabled(false);
        if (result.type === "success") {
          setDocData(result);
        }
      })
      .catch((error) => {
        console.log(error);
        displayToast("Error ", error);
        setDisabled(false);
      });
    // DocumentPicker.getDocumentAsync({
    // 	type: ["image/*"], //add supported files
    // })
    // 	.then((result) => {
    // 		console.log(result);
    // 		setDisabled(false);
    // 		if (result.type === "success") {
    // 			setDocData(result);
    // 		}
    // 	})
    // 	.catch((error) => {
    // 		console.log(error);
    // 		displayToast("Error ", error);
    // 		setDisabled(false);
    // 	});
  };

  const sendMessage = async () => {
    if (message == "" && !docData) {
      displayToast("Type a message :(");
      return;
    }
    let usersOnline = status.filter((dt) => dt.key === nav.params.uid);
    let msgData = {
      message,
      uid: currentUser.user.userId,
      receiver: nav.params.uid,
      type: "text",
      isRead: !loading && usersOnline.length > 0 ? true : false,
    };
    msgData.createdAt = Date.now();
    msgData.timestamp = Timestamp.now();

    if (docData) {
      setDisabled(true);
      try {
        let snapshot = await FileHandler.uploadFile(docData.uri);
        let dUrl = await getDownloadURL(snapshot.ref);
        console.log("doc url is ", dUrl);
        msgData.type = "doc";
        msgData.url = dUrl;
      } catch (error) {
        console.log(error);
        setDisabled(false);
      }
    }

    msgRef.current.clear();
    //  Message.sendMessage(msgData);
    Message.sendMessage2(msgData, chatId).then((key) => {
      setChatId(key);
      setDocData(null);
      setDisabled(false);

      PushNotification.retrieveFcmSubscription(msgData.receiver)
        .then((snap) => {
          if (snap.val()) {
            PushNotification.sendPushNotification(
              snap.val().fcmToken,
              `New Message From ${currentUser.user.username}`,
              `${msgData.message}`
            );
            console.log("snap key ", snap.val().pushToken);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const sendAudioMessage = async () => {
    setDisabled(true);
    FileHandler.uploadAudio(audioUri).then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((downloadUrl) => {
          console.log("audio url available at ", downloadUrl);
          let msgData = {
            uid: currentUser.user.userId,
            receiver: nav.params.uid,
            type: "audio",
            isRead:
              !loading &&
              status.filter((dt) => dt.key === nav.params.uid).length > 0
                ? true
                : false,
          };
          msgData.createdAt = Date.now();
          msgData.timestamp = Timestamp.now();
          msgData.url = downloadUrl;
          if (audioUri) {
            Message.sendMessage2(msgData, chatId)
              .then((snap) => {
                setAudioUri(null);
                setDisabled(false);
              })
              .catch((error) => {
                console.log(error);
                setDisabled(false);
              });
          }
        })
        .catch((error) => {
          console.log(error);
          setDisabled(false);
        });
    });
  };
  const setMessage = (msg) => {
    message = msg;
  };

  const displayToast = (msg) => {
    Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      animation: true,
      hideOnPress: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <ScrollView
            ref={scrollViewRef}
            style={{
              marginTop: 15,
              flexGrow: 1,
            }}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <View
              style={{
                marginBottom: 15,
              }}
            >
              {/* messages */}
              <MessageBox user={user} chatId={chatId} />
            </View>
          </ScrollView>

          {docData ? (
            <View
              style={{
                height: 40,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  width: "20%",
                }}
              >
                <Ionicons name="attach" size={30} color={NAVYBLUE} />
              </View>

              <View
                style={{
                  width: "60%",
                }}
              >
                <Text>{docData.name}</Text>
              </View>
              <View
                style={{
                  width: "20%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setDocData(null);
                  }}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={30}
                    color={NAVYBLUE}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <></>
          )}

          {audioUri ? (
            <View
              style={{
                height: 40,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                justifyContent: "space-between",
              }}
            >
              <View>
                {isPlaying ? (
                  <TouchableOpacity onPress={stopPlay}>
                    <Ionicons name="stop" size={30} color={NAVYBLUE} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={doPlay}>
                    <Ionicons name="play" size={30} color={NAVYBLUE} />
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text>Voice note</Text>
              </View>
              <View>
                <TouchableOpacity
                  disabled={disabled}
                  onPress={sendAudioMessage}
                >
                  <Ionicons name="send" size={30} color={NAVYBLUE} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <></>
          )}

          {!audioUri ? (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                backgroundColor: WHITE,
              }}
            >
              <View
                style={{
                  flexGrow: 1,
                  width: "40%",
                }}
              >
                <TextInput
                  onChangeText={(msg) => setMessage(msg)}
                  style={{ backgroundColor: WHITE, padding: 0, width: "100%" }}
                  placeholder="Type a message"
                  mode="flat"
                  multiline={true}
                  ref={msgRef}
                />
              </View>
              <View
                style={{
                  width: "70%",
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: -210,
                }}
              >
                <View>
                  <TouchableOpacity onPress={sendMessage}>
                    <IconButton disabled={disabled} icon={"send"} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <></>
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

export default ChatScreen;
