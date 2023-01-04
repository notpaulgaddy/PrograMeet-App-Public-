import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	SafeAreaView,
	Image,
	View,
	ScrollView,
	TouchableHighlight,
	TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import Toast from "react-native-root-toast";
import {
	ActivityIndicator,
	Avatar,
	Button,
	Chip,
	TextInput as MaterialInput,
} from "react-native-paper";

import { Card, IconButton, Paragraph, Title } from "react-native-paper";
import {
	DARKGREY,
	LIGHTGREY,
	MAGENTA,
	NAVYBLUE,
	WHITE,
} from "../../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import AppContext from "../../store/AppContext";
import {
	collection,
	doc,
	getDocs,
	getFirestore,
	query,
	where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import User from "../../services/User";
import { useDispatch, useSelector } from "react-redux";
import * as RootNavigation from "../../helpers/RootNavigation";
import UserHobbies from "../../components/UserHobbies";
import UserInterests from "../../components/UserInterests";
import UserFavSong from "../../components/UserFavSong";
const EditAbout = ({ user }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [location, setLocation] = useState("");
	const [bio, setBio] = useState("");
	const [favSongs, setFavSongs] = useState("");
	const [favSongsA, setFavSongsA] = useState([]);
	const [hobbiesA, setHobbiesA] = useState([]);
	const [interestsA, setInterestsA] = useState([]);
	const [loading, setLoading] = useState(false);
	const [organization, setOrganizaton] = useState(false);
	const [isAdding, setIsAdding] = React.useState(false);
	const dispatch = useDispatch();

	React.useEffect(() => { }, []);

	const remFavSong = (song) => {
		User.updateFavSongs(user.userId, "", null)
			.then((snp) => {
				User.getUser(user.userId).then((user) => {
					dispatch(setUser(user));
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const remFavArtist = (artist) => {
		let newArr = [];
		newArr = user.favArtists.filter((arts) => arts.id !== artist.id);
		User.updateFavArts(user.userId, "", newArr)
			.then((snp) => {
				User.getUser(user.userId).then((user) => {
					dispatch(setUser(user));
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const remSkill = (skill) => {
		let skillArr = [];
		if (user.skills) {
			skillArr = [...user.skills];
		}

		let arr = skillArr.filter((itms) => itms !== skill);
		skillArr = arr;

		setIsAdding(true);

		User.updateSkills(skillArr, user.userId).then(() => {
			User.getUser(user.userId).then((user) => {
				dispatch(setUser(user));
				setIsAdding(false);
				Toast.show("Skill removed", {
					duration: Toast.durations.LONG,
				});
			});
		});
	};

	const addTextChange = () => {
		if (user.favSong ? "1" : 1) {
			return <Text>Edit selection</Text>;
		} else {
			return <Text>Choose artist</Text>;
		}
	};

	const save = () => {
		setLoading(true);
		let profileObj = {
			name,
			email,
			username,
			location,
			bio,
			organization,
		};

		if (name == "") {
			profileObj.name = user.name;
		}
		if (email == "") {
			profileObj.email = user.email;
		}
		if (location == "") profileObj.location = user.location;
		if (bio == "") profileObj.bio = user.bio;
		if (organization == "") profileObj.organization = user.organization;
		if (username == "") {
			profileObj.username = user.username;
		} else {
			const usersRef = collection(db, "userInfo");
			const usernameQ = query(usersRef, where("username", "==", username));

			getDocs(usernameQ)
				.then((snap) => {
					if (!snap.empty) {
						Toast.show("Username taken, please try a another one", {
							duration: Toast.durations.LONG,
						});
						setLoading(false);
					} else {
						//   do save

						User.updateProfile(profileObj, user.userId).then(() => {
							User.getUser(user.userId)
								.then((user) => {
									Toast.show("Profile successfully updated", {
										duration: Toast.durations.LONG,
									});
									setLoading(false);
									dispatch(setUser(user));
								})
								.catch((error) => {
									console.error(error);
								});
						});
					}
				})
				.catch((error) => {
					console.error(error);
					setLoading(false);
				});

			return;
		}

		User.updateProfile(profileObj, user.userId)
			.then((snap) => {
				User.getUser(user.userId).then((user) => {
					Toast.show("Profile successfully updated", {
						duration: Toast.durations.LONG,
					});
					setLoading(false);

					dispatch(setUser(user));
				});
			})
			.then((error) => {
				console.log(error);
				setLoading(false);
			});
	};

	return (
		<ScrollView>
			<View
				style={{
					marginBottom: 15,
				}}
			>
				<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
					Email
				</Text>
				<View style={styles.textInputArea}>
					<View style={styles.iconArea}>
						<FontAwesome name="inbox" size={20} color={DARKGREY} />
					</View>

					<View style={styles.inputArea}>
						<TextInput
							defaultValue={user.email}
							style={styles.placeholderText}
							placeholder="Email address"
							onChangeText={(em) => setEmail(em)}
							keyboardType="email-address"
							placeholderTextColor="#003f5c"
							editable={false}
						/>
					</View>
				</View>

				<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
					Name
				</Text>
				<View style={styles.textInputArea}>
					<View style={styles.iconArea}>
						<FontAwesome name="user" size={20} color={DARKGREY} />
					</View>
					<View style={styles.inputArea}>
						<TextInput
							defaultValue={user.name}
							style={styles.placeholderText}
							placeholder="Name"
							onChangeText={(n) => setName(n)}
							placeholderTextColor="#003f5c"
						/>
					</View>
				</View>

				<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
					Username
				</Text>
				<View style={styles.textInputArea}>
					<View style={styles.iconArea}>
						<FontAwesome name="user-o" size={20} color={DARKGREY} />
					</View>
					<View style={styles.inputArea}>
						<TextInput
							defaultValue={user.username}
							style={styles.placeholderText}
							placeholder="Username"
							onChangeText={(u) => setUsername(u)}
							placeholderTextColor="#003f5c"
						/>
					</View>
				</View>

				<Text
					style={{
						marginTop: 15,
						fontWeight: "700",
						color: DARKGREY,
					}}
				>
					Bio
				</Text>
				<View style={styles.textInputArea}>
					<View style={styles.inputArea}>
						<TextInput
							defaultValue={user.bio}
							style={styles.placeholderText}
							onChangeText={(b) => setBio(b)}
							placeholderTextColor="#003f5c"
							multiline={true}
							numberOfLines={3}
						/>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-evenly",
					}}
				>
					<View
						style={{
							width: "50%",
						}}
					>
						<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
							Location
						</Text>
						<View
							style={{
								backgroundColor: WHITE,
								marginTop: 10,
								padding: 10,
								marginRight: 10,
							}}
						>
							<TextInput
								defaultValue={user.location}
								onChangeText={(u) => setLocation(u)}
								placeholderTextColor="#003f5c"
							/>
						</View>
					</View>
					<View
						style={{
							width: "50%",
						}}
					>
						<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
							School
						</Text>
						<View
							style={{
								backgroundColor: WHITE,
								marginTop: 10,
								padding: 10,
								marginRight: 10,
							}}
						>
							<TextInput
								defaultValue={user.organization}
								onChangeText={(u) => setOrganizaton(u)}
								placeholderTextColor="#003f5c"
							/>
						</View>
					</View>
				</View>
				<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
					Favorite Song {user.favSong ? "1" : "0"}/1
				</Text>
				<View
					style={{
						flexDirection: "row",
						marginTop: 10,
						flexWrap: "wrap",
					}}
				>
					{user.favSong ? (
						<UserFavSong canModify={true} uid={user.userId} />
					) : (
						<></>
					)}
				</View>
				<TouchableOpacity
					onPress={() => RootNavigation.navigate("Favorite Song")}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-start",
							alignItems: "center",
						}}
					>
						<IconButton icon={"plus-circle"} />
						<Text>{addTextChange()}</Text>
					</View>
				</TouchableOpacity>

				<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
					Favorite Spotify Artists {user.favArtists && user.favArtists.length}
					/5
				</Text>
				<View
					style={{
						flexDirection: "row",
						marginTop: 10,
						flexWrap: "wrap",
					}}
				>
					{user.favArtists && user.favArtists.length > 0 ? (
						user.favArtists.map((artist) => {
							return (
								<Chip
									icon={() => (
										<Avatar.Image
											size={25}
											source={{
												uri: artist.cover,
											}}
										/>
									)}
									style={{
										marginLeft: 3,
										marginTop: 5,
									}}
									closeIcon={"close-circle"}
									onClose={() => remFavArtist(artist)}
								>
									{artist.name}
								</Chip>
							);
						})
					) : (
						<></>
					)}
				</View>
				<TouchableOpacity
					onPress={() => RootNavigation.navigate("Spotify Artist")}
					nativeID="addNewButton"
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-start",
							alignItems: "center",
						}}
					>
						<IconButton icon={"plus-circle"} />
						<Text>Add New</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.textInputArea}></View>

				<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
					Hobbies {user.hobbies && user.hobbies.length}/5
				</Text>

				<View
					style={{
						flexDirection: "row",
						marginTop: 10,
						flexWrap: "wrap",
					}}
				>
					<UserHobbies canModify={true} uid={user.userId} />
				</View>
				<TouchableOpacity
					onPress={() =>
						RootNavigation.navigate("Hobbies", {
							user,
						})
					}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-start",
							alignItems: "center",
						}}
					>
						<IconButton icon={"plus-circle"} />
						<Text>Add New</Text>
					</View>
				</TouchableOpacity>

				<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
					Interests {user.interests && user.interests.length}/5
				</Text>

				<View
					style={{
						flexDirection: "row",
						marginTop: 10,
						flexWrap: "wrap",
					}}
				>
					<UserInterests canModify={true} uid={user.userId} />
				</View>
				<TouchableOpacity onPress={() => RootNavigation.navigate("Interests")}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-start",
							alignItems: "center",
						}}
					>
						<IconButton icon={"plus-circle"} />
						<Text>Add New</Text>
					</View>
				</TouchableOpacity>

				<Text style={{ marginTop: 15, fontWeight: "700", color: DARKGREY }}>
					Skills {user.skills && user.skills.length}/5
				</Text>
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
					}}
				>
					{user.skills &&
						user.skills !== " " &&
						user.skills.map((skl, i) => {
							return (
								<Chip
									key={i}
									style={{
										marginTop: 10,
										marginHorizontal: 5,
									}}
									closeIcon={"close-circle"}
									onClose={() => remSkill(skl)}
								>
									{skl}
								</Chip>
							);
						})}
				</View>

				<TouchableOpacity onPress={() => RootNavigation.navigate("Skills")}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-start",
							alignItems: "center",
						}}
					>
						<IconButton icon={"plus-circle"} />
						<Text>Add New</Text>
					</View>
				</TouchableOpacity>

				{loading ? (
					<ActivityIndicator />
				) : (
					<TouchableHighlight
						onPress={save}
						style={styles.button}
						underlayColor={NAVYBLUE}
					>
						<Text style={styles.buttonText}>Save</Text>
					</TouchableHighlight>
				)}
			</View>
		</ScrollView>
	);
};

export default EditAbout;

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 10,
		backgroundColor: LIGHTGREY,
		marginTop: 10,
		padding: 5,
	},
	formArea: {
		marginTop: 15,
	},

	textInputArea: {
		backgroundColor: WHITE,
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 15,
		marginTop: 10,
	},
	iconArea: {
		width: "10%",
		paddingLeft: 10,
	},
	inputArea: {
		backgroundColor: "white",
		borderRadius: 30,
		width: "100%",
		height: 45,
		marginBottom: 20,
		borderRadius: 10,
	},
	placeholderText: {
		marginTop: 25,
		marginRight: 30,
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
	},

	signupTxt: {
		color: NAVYBLUE,
		fontWeight: "700",
	},
	section: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 15,
	},

	checkbox: {
		margin: 4,
	},
	buttonText: {
		fontSize: 18,
		color: "white",
		alignSelf: "center",
	},
	button: {
		height: 36,
		backgroundColor: MAGENTA,
		borderColor: MAGENTA,
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		marginTop: 10,
		alignSelf: "stretch",
		justifyContent: "center",
	},
});
