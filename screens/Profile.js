import React, { useContext, useState } from "react";
import {
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	SafeAreaView,
	Image,
	View,
	ImageBackground,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import {
	Tabs,
	TabScreen,
	useTabIndex,
	useTabNavigation,
} from "react-native-paper-tabs";
import { StatusBar } from "expo-status-bar";
import { IconButton, ProgressBar, useTheme } from "react-native-paper";
import AppContext from "../store/AppContext";
import { BLACK, DARKGREY, MAGENTA, NAVYBLUE, WHITE } from "../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import About from "./profile/About";
import Prompts from "./profile/Pompts";
import Posts from "./profile/Posts";
import Projects from "./profile/Projects";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import {
	getStorage,
	uploadBytesResumable,
	getDownloadURL,
	ref,
} from "firebase/storage";
import { storage } from "../config/firebase";
import User from "../services/User";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/user";
import { setModal } from "../store/model";
import { useNavigation } from "@react-navigation/native";
const Profile = () => {
	const context = useContext(AppContext);
	const { colors } = useTheme();
	const [image, setImage] = useState(null);
	const [cover, setCoverImage] = useState(null);
	const [progress, setProgress] = useState(0);
	const currentUser = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const r = useNavigation();

	React.useEffect(() => { });

	const changePhoto = async (type, uid) => {
		console.log(type);
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
			aspect: type === "avatar" ? [1, 1] : [16, 9],
		});

		if (!result.cancelled) {
			if (type === "avatar") {
				setImage(result);
			} else {
				setCoverImage(result);
			}
			uploadPhoto(type, uid, result);
		}
	};
	const uploadPhoto = async (type, uid, image) => {

		const storageRef = ref(storage, `Images/${Date.now()}`);

		const img = await fetch(image.uri);
		const blob = await img.blob();
		const uploadTask = uploadBytesResumable(storageRef, blob);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = snapshot.bytesTransferred / snapshot.totalBytes;

				// setProgress(progress);
			},
			(error) => {
				console.log(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					if (type === "avatar") {
						User.updateProfile(
							{
								avatar: downloadURL,
							},
							uid
						).then(() => {
							User.getUser(uid)
								.then((user) => {
									//  setProgress(0);
									Toast.show("Profile photo updated", {
										duration: Toast.durations.LONG,
									});
									dispatch(setUser(user));
								})
								.catch((error) => {
									Toast.show(JSON.stringify(error), {
										duration: Toast.durations.LONG,
									});
								});
						});
					} else {
						User.updateProfile(
							{
								backgroundPic: downloadURL,
							},
							uid
						).then(() => {
							User.getUser(uid)
								.then((user) => {
									//  setProgress(0);
									Toast.show("Cover photo updated", {
										duration: Toast.durations.LONG,
									});
									dispatch(setUser(user));
								})
								.catch((error) => {
									Toast.show(JSON.stringify(error), {
										duration: Toast.durations.LONG,
									});
								});
						});
					}
				});
			}
		);
	};
	return (
		<View style={styles.container}>
			<ImageBackground
				source={{
					uri: `${cover ? cover.uri : currentUser.user.backgroundPic}`,
				}}
				resizeMode="cover"
				style={styles.coverContainer}
			>
				<View style={styles.profilePic}>
					{image ? (
						<>
							<ImageBackground
								style={styles.profilePicInner}
								source={{ uri: `${image.uri}` }}
								resizeMode="cover"
							>
								<TouchableOpacity>
									<Ionicons
										color={"gray"}
										style={{
											fontWeight: "700",
										}}
										size={20}
										name="chatbubble-ellipses-outline"
									/>
								</TouchableOpacity>
								<IconButton
									color="white"
									onPress={() => changePhoto("avatar", currentUser.user.userId)}
									style={{
										position: "absolute",
										right: -10,
										top: -10,
										color: "white",
									}}
									icon={"square-edit-outline"}
								/>
							</ImageBackground>
						</>
					) : (
						<>
							<ImageBackground
								style={styles.profilePicInner}
								source={{ uri: `${currentUser.user.avatar}` }}
								resizeMode="cover"
							>
								<IconButton
									onPress={() => changePhoto("avatar", currentUser.user.userId)}
									style={{
										position: "absolute",
										right: -10,
										top: -10,
										color: colors.primary,
									}}
									icon={"square-edit-outline"}
								/>
							</ImageBackground>
						</>
					)}
				</View>
				<IconButton
					onPress={() => changePhoto("cover", currentUser.user.userId)}
					style={{
						position: "absolute",
						left: 10,
						bottom: 0,
						color: colors.primary,
					}}
					icon={"square-edit-outline"}
				/>
			</ImageBackground>
			<View style={styles.profileDetails}>
				<View style={styles.profileNames}>
					<Text
						style={{
							fontSize: 20,
							color: "black",
							fontWeight: "800",
						}}
					>
						{currentUser.user.name}
					</Text>
					<View>
						<Text
							style={{
								fontSize: 15,
							}}
						>
							@{currentUser.user.username}
						</Text>
					</View>
				</View>
				<View style={styles.userInfo}>
					<Text>{currentUser.user.bio}</Text>
				</View>
				<View style={styles.userInfo2}>
					<View style={styles.sec1}>
						{/* <FontAwesome name="map-marker" size={20} color={MAGENTA} /> */}
						<Image source={require("../assets/location.png")} />
						<Text
							style={{
								marginLeft: 10,
							}}
						>
							{currentUser.user.location}
						</Text>
					</View>
					{/* <View style={styles.sec1}>
						<Image source={require("../assets/role.png")} />
						<Text
							style={{
								marginLeft: 10,
							}}
						>
							{currentUser.user.role}
						</Text>
					</View> */}
					<View style={styles.sec1}>
						<Image source={require("../assets/org.png")} />
						<Text
							style={{
								marginLeft: 10,
							}}
						>
							{currentUser.user.organization}
						</Text>
					</View>
				</View>
				<View style={styles.friendsBtn}>
					<Button mode="contained" color={colors.primary}>
						{currentUser.user.friends.length} Friends
					</Button>
				</View>
				{/* tabs */}
				<Tabs
					style={{
						backgroundColor: WHITE,
						marginTop: 10,
						elevation: 0,
					}}
					mode="scrollable"
					disableSwipe={true}
					uppercase={false}
					styles={styles.tabsArea}
					defaultIndex={0}
					showLeadingSpace={false}
				>
					<TabScreen label="About">
						<About
							uid={currentUser.user.userId}
							friend={null}
							canModify={true}
						/>
					</TabScreen>
					<TabScreen label="Prompts">
						<Prompts
							uid={currentUser.user.userId}
							friend={null}
							canModify={true}
						/>
					</TabScreen>
					<TabScreen label="Posts">
						<Posts
							uid={currentUser.user.userId}
							friend={null}
							canModify={true}
						/>
					</TabScreen>
					<TabScreen label="Projects">
						<Projects
							uid={currentUser.user.userId}
							friend={null}
							canModify={true}
						/>
					</TabScreen>
				</Tabs>

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
		</View>
	);
};

export default Profile;

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
});
