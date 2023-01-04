import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { DARKGREY, LIGHTGREY, WHITE } from "../config/Constants";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import AppContext from "../store/AppContext";
import Toast from "react-native-root-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../store/user";
import * as AppNotifications from "expo-notifications";
import * as Device from "expo-device";
import PushNotification from "../services/PushNotification";

AppNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await AppNotifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await AppNotifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await AppNotifications.getExpoPushTokenAsync({
        experienceId: "@shadykip/programeet",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    AppNotifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: AppNotifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [isHidden, setHidden] = useState(true);
  const context = useContext(AppContext);
  const dispatch = useDispatch();

  const goToSignup = () => {
    navigation.navigate("Signup");
  };

  const doLogin = () => {
    if (email !== "" && password !== "") {
      setDisabled(true);

      signInWithEmailAndPassword(auth, email, password)
        .then((resp) => {
          const uid = resp.user.uid;
          const docRef = doc(db, "userInfo", uid);

          console.log(`doc(db, "userInfo", uid);`, { docRef, uid });

          getDoc(docRef)
            .then((docSnap) => {
              setDisabled(false);
              if (!docSnap.exists()) {
                displayToast("User data does not exist");
              } else {
                const userData = docSnap.data();

                if (resp.user.emailVerified) {
                  /*  if(true){ */
                  registerForPushNotificationsAsync()
                    .then(async (token) => {
                      //  setExpoPushToken(token);
                      const FcmToken = await PushNotification.getFcmToken();
                      console.log(FcmToken);
                      PushNotification.subscribeUserFcm(
                        userData.userId,
                        FcmToken
                      );
                    })
                    .catch((error) => {
                      console.log("Token Error ", error);
                    });

                  dispatch(setUser(userData));
                  navigation.navigate("Home");
                } else {
                  navigation.navigate("Verify Email");
                }
              }
            })
            .catch((error) => {
              console.log(JSON.stringify(error));
              displayToast(error.message);
              setDisabled(false);
            });
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          if (
            error.code === "unavailable" ||
            error.code === "auth/network-request-failed"
          ) {
            displayToast("Network error, try again");
            setDisabled(false);
          } else {
            setDisabled(false);
            displayToast(error.message);
          }
        });
    } else {
      displayToast("Please fill all required fields");
      setDisabled(false);
    }
  };

  const displayToast = (msg) => {
    Toast.show(msg, {
      duration: Toast.durations.LONG,
    });
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("../assets/Logo.png")} />
        </View>
        <View>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={styles.formArea}>
          <View style={styles.textInputArea}>
            <View style={styles.iconArea}>
              <FontAwesome name="inbox" size={20} color={DARKGREY} />
            </View>
            <View style={styles.inputArea}>
              <TextInput
                style={styles.placeholderText}
                placeholder="Email address"
                onChangeText={(em) => setEmail(em)}
                keyboardType="email-address"
                placeholderTextColor="#003f5c"
              />
            </View>
          </View>

          <View style={styles.textInputArea}>
            <View style={styles.iconArea}>
              <FontAwesome name="lock" size={20} color={DARKGREY} />
            </View>
            <View style={styles.inputArea}>
              <TextInput
                style={styles.placeholderText}
                placeholder="Password"
                secureTextEntry={isHidden ? true : false}
                placeholderTextColor="#003f5c"
                onChangeText={(pass) => setPassword(pass)}
              />
            </View>
          </View>
        </View>
        <View style={styles.forgotPass}>
          <Text
            onPress={() => navigation.navigate("Forgot")}
            style={styles.forgotPassTxt}
          >
            Forgot password?
          </Text>
        </View>
        <TouchableOpacity
          style={styles.authBtnArea}
          onPress={doLogin}
          disabled={disabled}
        >
          {disabled ? (
            <Text styles={styles.loginText}>logging in</Text>
          ) : (
            <Text styles={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.fullDHA}>
            Don't have an account?
            <Text onPress={goToSignup} style={styles.signupTxt}>
              Signup
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHTGREY,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logoContainer: {
    height: 100,
    flexDirection: "row",
    padding: 10,
    width: "90%",
    marginBottom: 40,
  },
  logo: {
    height: 90,
    width: "100%",
    resizeMode: "contain",
    marginTop: -100,
  },

  title: {
    fontWeight: "700",
    fontSize: 25,
    color: "black",
    // marginTop:-90,
  },
  hiddenIcon: {
    paddingLeft: 10,
  },
  formArea: {
    marginTop: 15,
  },
  loginText: {
    color: "#FFF",
  },
  textInputArea: {
    backgroundColor: WHITE,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 15,
  },
  placeholderText: {
    marginTop: 25,
    marginRight: 30,
  },
  iconArea: {
    width: "10%",
    paddingLeft: 10,
  },
  fullDHA: {
    marginTop: "10%",
  },
  inputArea: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    borderRadius: 10,
  },
  authBtnArea: {
    width: 250,
    borderRadius: 10,
    height: 50,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
    backgroundColor: "#FB275D",
  },
  authBtn: {
    width: "100%",
  },
  forgotPass: {
    marginTop: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 25,
    paddingLeft: 40,
  },
  signupTxt: {
    color: "black",
    fontWeight: "700",
    marginTop: "20%",
    paddingLeft: 20,
  },
  forgotPassTxt: {
    paddingRight: "35%",
    paddingTop: 10,
  },
});
