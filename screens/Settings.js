import React, { useState, useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";

import { getAuth, signOut } from "firebase/auth";
import {
	View,
	Text,
	Switch,
	ScrollView,
	StyleSheet,
	SafeAreaView,
	Alert,
	Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AppContext from "../store/AppContext";
import { auth, db } from "../config/firebase";
import { DARKGREY, LIGHTGREY, MAGENTA } from "../config/Constants";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as RootNavigation from "../helpers/RootNavigation";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/user";
import User from "../services/User";
import Toast from "react-native-root-toast";
import {
	collection,
	getDocs,
	getFirestore,
	query,
	where,
	doc,
	setDoc,
} from "firebase/firestore";

const Settings = ({ navigation }) => {
	const [isEnabled, setIsEnabled] = useState(false);
	const context = useContext(AppContext);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);

	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
	const menuItems = [
		{
			title: "Our Socials",
			slug: "socials",
			icon: <FontAwesome color={DARKGREY} size={20} name="instagram" />,
			rightIcon: (
				<FontAwesome color={DARKGREY} size={20} name="chevron-right" />
			),
		},
		{
			title: "Account",
			slug: "account",
			icon: <FontAwesome color={DARKGREY} size={20} name="user-o" />,
			rightIcon: (
				<FontAwesome color={DARKGREY} size={20} name="chevron-right" />
			),
		},
		{
			title: "Edit profile",
			slug: "edit-profile",
			icon: <FontAwesome color={DARKGREY} size={20} name="edit" />,
			rightIcon: (
				<FontAwesome color={DARKGREY} size={20} name="chevron-right" />
			),
		},
		{
			title: "Terms & Conditions",
			slug: "terms",
			icon: <FontAwesome color={DARKGREY} size={20} name="info-circle" />,
			rightIcon: (
				<FontAwesome color={DARKGREY} size={20} name="chevron-right" />
			),
		},
		{
			title: "Privacy Policy",
			slug: "privacy",
			icon: <FontAwesome color={DARKGREY} size={20} name="info-circle" />,
			rightIcon: (
				<FontAwesome color={DARKGREY} size={20} name="chevron-right" />
			),
		},
		{
			title: "Cookie Policy",
			slug: "cookies",
			icon: <FontAwesome color={DARKGREY} size={20} name="info-circle" />,
			rightIcon: (
				<FontAwesome color={DARKGREY} size={20} name="chevron-right" />
			),
		},
		{
			title: "Logout",
			slug: "logout",
			icon: <FontAwesome color={DARKGREY} size={20} name="sign-out" />,
			rightIcon: (
				<FontAwesome color={DARKGREY} size={20} name="chevron-right" />
			),
		},
		{
			title: "Delete Account",
			slug: "delete",
			icon: <FontAwesome color={DARKGREY} size={20} name="minus-circle" />,
			rightIcon: (
				<FontAwesome color={DARKGREY} size={20} name="chevron-right" />
			),
		},
	];

	const goToPage = (slug) => {
		if (slug === "logout") {
			Alert.alert("Logout", "Are you sure you want to logout?", [
				{
					text: "Cancel",
					onPress: () => console.log("Cancel pressed"),
					style: "cancel",
				},
				{
					text: "Continue",
					onPress: () => {

						signOut(auth)
							.then(() => {
								User.setOfflineStatus(user.userId)
									.then((snap) => {
										dispatch(setUser(null));

										RootNavigation.navigate("Login");
									})
									.catch((error) => { });
							})
							.catch((error) => {
								console.log("error ", error);
							});
					},
				},
			]);
		} else if (slug === "account") {
			User.getUser(user.userId)
				.then((user) => {
					RootNavigation.navigate("Profile", { user: user });
				})
				.catch((error) => {
					console.log(error);
				});
		} else if (slug === "edit-profile") {
			RootNavigation.navigate("Edit Profile", { uid: user.userId });
		} else if (slug === "socials") {
			Linking.openURL("https://linktr.ee/PrograMeet");
		} else if (slug === "terms") {
			Linking.openURL("https://www.PrograMeet.com/terms.html");
		} else if (slug === "privacy") {
			Linking.openURL("https://www.PrograMeet.com/privacy.html");
		} else if (slug === "cookies") {
			Linking.openURL("https://www.PrograMeet.com/cookies.html");
		} else if (slug === "delete") {
			Alert.alert(
				"Delete Account",
				"Are you sure you want to delete your account?",
				[
					{
						text: "Cancel",
						onPress: () => console.log("Cancel pressed"),
						style: "cancel",
					},
					{
						text: "Yes",
						onPress: () => {
							setDoc(doc(db, "deleteAccount", user.userId), user).then(() => {
								alert(
									"Account marked for deletion, your account will be deleted within 24hrs, thank you for using PrograMeet"
								);
							});
						},
					},
				]
			);
		} else if (slug === "account") {
			RootNavigation.navigate("Profile");
		} else if (slug === "edit-profile") {
			RootNavigation.navigate("Edit Profile", { uid: user.userId });
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<View style={styles.cardBody}>
					<ScrollView>
						{menuItems.map((menu, i) => {
							return (
								<View key={i} style={styles.cardItem}>
									<View style={styles.cardItemInnerLeft}>
										<View>
											<Text onPress={() => goToPage(menu.slug)}>
												{menu.icon}
											</Text>
										</View>
										<View style={{ marginLeft: 7 }}>
											<Text onPress={() => goToPage(menu.slug)}>
												{menu.title}
											</Text>
										</View>
									</View>
									<View>
										<Button onPress={() => goToPage(menu.slug)}>
											{menu.rightIcon}
										</Button>
									</View>
								</View>
							);
						})}
					</ScrollView>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Settings;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flex: 1,
		paddingTop: StatusBar.currentHeight,
		paddingBottom: StatusBar.currentHeight,
		backgroundColor: MAGENTA,
	},
	scrollView: {
		marginHorizontal: 10,
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
	cardItem: {
		height: 65,
		backgroundColor: "#fff",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		marginHorizontal: 10,
		marginTop: 10,
		borderRadius: 15,
	},
	cardItemInnerLeft: {
		flex: 1,
		flexDirection: "row",
		width: "50%",
		alignItems: "center",
	},
});
