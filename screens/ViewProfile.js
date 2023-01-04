import React, { useContext, useState } from "react";
import {
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	SafeAreaView,
	TouchableOpacity,
	Image,
	View,
	ImageBackground,
	ScrollView,
	Alert
} from "react-native";
import {
	Tabs,
	TabScreen,
	useTabIndex,
	useTabNavigation,
} from "react-native-paper-tabs";
import { setModal } from "../store/model";
import { StatusBar } from "expo-status-bar";
import { IconButton, ProgressBar, useTheme } from "react-native-paper";
import AppContext from "../store/AppContext";
import { DARKGREY, MAGENTA, WHITE, NAVYBLUE } from "../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import About from "./profile/About";
import Prompts from "./profile/Pompts";
import Posts from "./profile/Posts";
import Projects from "./profile/Projects";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { getStorage, uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { db } from "../config/firebase";
import User from "../services/User";
import Block from "../services/Block";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/user";
import { useRoute } from "@react-navigation/native";
import Placeholder from "../components/Placeholder";
import { doc, getFirestore } from "firebase/firestore";
const ViewProfile = () => {
	const context = useContext(AppContext);
	const { colors } = useTheme();
	const [image, setImage] = useState(null);
	const [cover, setCoverImage] = useState(null);
	const [progress, setProgress] = useState(0);
	const loginUserId = useSelector((state) => state?.user?.user?.userId);
	const [loginUser, setLoginUser] = useState(null);
	const [isSending, setSending] = useState(false);
	const [isRemoving, setRemoving] = useState(false);
	const [isFriend, setFriend] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const dispatch = useDispatch();
	const nav = useRoute();

	React.useEffect(() => {
		getUsersProfile();
	}, []);


	const getUsersProfile = async () => {
		try {
			const friend = await User.getUser(nav.params.uid);
			const user = await User.getUser(loginUserId);

			console.log("getUsersProfile", { user, friend });
			setCurrentUser(friend);
			setLoginUser(user);
		} catch (error) {
			console.log(error);
		}
	};

	const sendReq = async (uid) => {
		try {
			setSending(true);
			await User.friendRequest(uid, loginUser, "request");
			await getUsersProfile();
		} catch (error) {
			console.log(error);
		}
		finally {
			setSending(false);
		}
	};

	const removeFriend = async () => {
		const friendId = currentUser.userId;
		setRemoving(true);
		try {
			await User.removeFriend(loginUserId, friendId);
			await getUsersProfile();
		} catch (error) {
			console.log(error);
		}
		finally {
			setRemoving(false);
		}
	}

	const profileId = nav.params.uid;
	const twoButtonAlert = () => {
		Alert.alert(
			"Block",
			"Are you sure you want to block this user",
			[
				{
					text: "No"
				}
				, {
					text: "Yes",
					onPress: () => Block.blockuser(profileId, loginUserId)
				}
			]
		)
	}
	if (!currentUser) return <Placeholder />;
	return (
		<View style={styles.container}>

			<ImageBackground source={{ uri: `${cover ? cover.uri : currentUser.backgroundPic}`, }} resizeMode="cover" style={styles.coverContainer}>

				<View style={styles.profilePic}>
					<ImageBackground
						style={styles.profilePicInner}
						source={{ uri: `${currentUser.avatar}` }}
						resizeMode="cover"
					></ImageBackground>
				</View>
			</ImageBackground>

			<View style={styles.profileDetails}>
				<View style={styles.profileNames}>
					<Text style={{ fontSize: 20, color: DARKGREY, fontWeight: "700" }}>{currentUser.name}</Text>
					<View>
						<Text style={{ fontSize: 12 }}>@{currentUser.username}</Text>
					</View>
					<View>
						<Text style={styles.blockText} onPress={twoButtonAlert}>Block</Text>
					</View>
				</View>
				<View style={styles.userInfo}>
					<Text>{currentUser.bio}</Text>
				</View>
				<View style={styles.userInfo2}>
					<View style={styles.sec1}>
						<Image source={require("../assets/location.png")} />
						<Text style={{ marginLeft: 10, }}>{currentUser.location}</Text>
					</View>
					{/* <View style={styles.sec1}>
						<FontAwesome name="institution" size={20} color={MAGENTA} />
						<Text style={{marginLeft: 10}}>{currentUser.role}</Text>
					</View> */}
					<View style={styles.sec1}>
						<Image source={require("../assets/org.png")} />
						<Text style={{ marginLeft: 10 }}>{currentUser.organization}</Text>
					</View>
				</View>
				<View style={styles.friendsBtn}>
					{loginUser?.friends.includes(currentUser.userId) ? (
						<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
							<Button disabled={isRemoving} onPress={removeFriend} mode="contained" color={colors.accent} loading={isRemoving}>
								Remove
							</Button>
							<Button color={colors.primary} mode="contained">{currentUser.friends.length} Friends</Button>
						</View>

					) : (
						<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
							<Button disabled={isSending} onPress={() => sendReq(currentUser.userId)} mode="contained" color={colors.accent} loading={isSending}>
								{currentUser.friendRequests.includes(loginUserId)
									? "Pending"
									: "Add Friend"}
							</Button>
							<Button color={colors.primary} mode="contained">{currentUser.friends.length} Friends</Button>
						</View>
					)}
				</View>
				<Tabs style={{ backgroundColor: WHITE, marginTop: 10, elevation: 0, }}
					mode="scrollable"
					disableSwipe={true}
					uppercase={false}
					styles={styles.tabsArea}
					defaultIndex={0}
					showLeadingSpace={false}
				>
					<TabScreen label="About">
						<About canModify={false} friend={currentUser} />
					</TabScreen>
					<TabScreen label="Prompts">
						<Prompts canModify={false} friend={currentUser} />
					</TabScreen>
					<TabScreen label="Posts">
						<Posts canModify={false} friend={currentUser} />
					</TabScreen>
					<TabScreen label="Projects">
						<Projects canModify={false} friend={currentUser} />
					</TabScreen>
				</Tabs>
			</View>
			<TouchableOpacity
				onPress={() => dispatch(setModal(true))}
				style={{ backgroundColor: NAVYBLUE, width: 65, height: 65, borderRadius: 50, position: "absolute", bottom: 15, alignItems: "center", flexDirection: "row", right: 10, justifyContent: "center" }}>
				<View>
					<Image style={{ alignSelf: "center" }} source={require("../assets/logo-ic.png")} />
				</View>
			</TouchableOpacity>
		</View>
	);
};
export default ViewProfile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: WHITE,
		paddingTop: StatusBar.currentHeight,
		paddingBottom: StatusBar.currentHeight,
	},
	coverContainer: {
		height: 200,
		width: "100%",
		position: "relative",
		alignItems: "center",
	},
	profilePic: {
		width: 100,
		height: 100,
		position: "absolute",
		bottom: -50,
	},

	profilePicInner: {
		width: 100,
		height: 100,
		position: "relative",
	},
	profileDetails: {
		marginTop: 55,
		flex: 1,
	},
	profileNames: {
		alignItems: "center",
	},
	userInfo: {
		marginTop: 5,
		width: "80%",
		textAlign: "center",
		marginLeft: "10%",
		paddingTop: 10,
		paddingBottom: 10,
	},
	userInfo2: {
		marginHorizontal: 10,
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: 10,
	},
	sec1: {
		flexDirection: "row",
	},
	friendsBtn: {
		marginTop: 10,
		marginHorizontal: "20%",
	},
	blockText: {
		marginTop: 8,
		fontSize: 20,
		fontWeight: "bold"
	}
});