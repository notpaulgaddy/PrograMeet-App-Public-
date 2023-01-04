import React, { useState } from "react";

import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	Button,
	StyleSheet,
	TextInput,
	Text,
	Image,
	useColorScheme,
	View,
	TouchableOpacity,
	Alert,
} from "react-native";
import Checkbox from "expo-checkbox";

import Toast from "react-native-root-toast";
import {
	getAuth,
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";
import {
	collection,
	getDocs,
	getFirestore,
	query,
	where,
	doc,
	setDoc,
} from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import * as RootNavigation from "../helpers/RootNavigation";

import {
	DARKGREY,
	LIGHTGREY,
	MAGENTA,
	NAVYBLUE,
	WHITE,
} from "../config/Constants";
import { auth, db } from "../config/firebase";
import { Chip, Colors } from "react-native-paper";

const Signup = ({ navigation }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [disabled, setDisabled] = useState(false);

	const [isTermsChecked, setTermsChecked] = useState(true);
	const [isAgeChecked, setAgeChecked] = useState(true);
	const [isEmailListChecked, setEmailListChecked] = useState(true);
	const [isHidden, setHidden] = useState(true);

	const [suggestions, setSuggestions] = useState([]);
	const [isTaken, setTaken] = useState(false);

	const createUser = async () => {
		let userData = {
			name,
			email,
			username,
			password,
		};

		if (
			userData.name !== "" &&
			userData.email !== "" &&
			(userData.username !== "") & (userData.password !== "")
		) {

			userData.username = username.toLowerCase();

			setDisabled(true);
			const usersRef = collection(db, "userInfo");
			const usernameQ = query(usersRef, where("username", "==", username));

			getDocs(usernameQ)
				.then((snap) => {
					if (!snap.empty) {
						snap.forEach((usr) => {
							console.log(usr.id);
							setDisabled(false);
						});
						//TODO: doSuggest
						doSuggestUsername(name, username, email);
						Toast.show("Username taken, please try a another one", {
							duration: Toast.durations.LONG,
						});
					} else {
						setDisabled(false);
						createUserWithEmailAndPassword(auth, email, password)
							.then((resp) => {
								const uid = resp.user.uid;
								sendEmailVerification(resp.user).then(() => {
									saveUser({ name, email, username, uid });
								});
							})
							.catch((error) => {
								console.log(JSON.stringify(error));
								Toast.show(error.message, {
									duration: Toast.durations.LONG,
								});
							});
					}
				})
				.catch((error) => {
					if (error.code === "permission-denied") {
						Toast.show("Data access denied", {
							duration: Toast.durations.LONG,
						});
					}
					console.log(JSON.stringify(error));
					setDisabled(false);
				});
		} else {
			Toast.show("Please fill all the fields", {
				duration: Toast.durations.LONG,
			});
		}

		if (
			userData.name !== "" &&
			userData.email !== "" &&
			(userData.username !== "") & (userData.password !== "")
		) {
			setDisabled(true)
				.then((snap) => {
					setDisabled(false);
					createUserWithEmailAndPassword(auth, email, password)
						.then((resp) => {
							const uid = resp.user.uid;
							saveUser({ name, email, username, uid });
						})

						.catch((error) => {
							console.log(JSON.stringify(error));
							Toast.show(error.message, {
								duration: Toast.durations.LONG,
							});
						});
				})
				.catch((error) => {
					if (error.code === "permission-denied") {
						Toast.show("Data access denied", {
							duration: Toast.durations.LONG,
						});
					}
					console.log(JSON.stringify(error));
					setDisabled(false);
				});
		}
	};

	const doSuggestUsername = async (name, username, email) => {
		let suggArr = [];
		let suggestion1 = "";
		let suggestion2 = "";
		let suggestion3 = "";
		let suggestion4 = "";
		let suggestion5 = "";
		let suggestion6 = "";

		suggestion1 = name
			.split(" ")
			.map((item) => {
				return item.trim();
			})
			.join("")
			.toLowerCase();

		suggestion2 = name
			.split(" ")
			.map((item) => {
				return item.trim();
			})
			.join(".")
			.toLowerCase();
		if (suggestion2 !== "") {
			suggestion3 = suggestion2 + `${genRandomNumber()}`;
		}
		if (suggestion3 !== "") {
			suggestion4 = suggestion1 + `${genRandomNumber()}`;
		}
		if (email !== "") {
			suggestion5 = email.split("@")[0].toLowerCase();
			suggestion6 = email.split("@")[0] + `${genRandomNumber()}`;
		}
		if (!suggArr.includes(suggestion1)) {
			suggArr.push(suggestion1);
		}
		if (!suggArr.includes(suggestion2)) {
			suggArr.push(suggestion2);
		}
		if (!suggArr.includes(suggestion3)) {
			suggArr.push(suggestion3);
		}
		if (!suggArr.includes(suggestion4)) {
			suggArr.push(suggestion4);
		}
		if (!suggArr.includes(suggestion5)) {
			suggArr.push(suggestion5);
		}
		if (!suggArr.includes(suggestion6)) {
			suggArr.push(suggestion6);
		}

		let arr = suggArr.filter((it) => it !== "");
		suggArr = arr;

		const usersRef = collection(db, "userInfo");
		const usernameQ = query(usersRef, where("username", "in", suggArr));

		getDocs(usernameQ)
			.then((snap) => {
				console.log(snap.empty);
				if (!snap.empty) {
					// a user with the suggested username exists
					snap.forEach((item) => {
						let arr = suggArr.filter((s) => s !== item.username);
						suggArr = arr;
					});
				}
				setSuggestions(suggArr);
				setTaken(true);
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const checkUsername = () => {
		if (username !== "") {
			//  doSuggestUsername(name, username, email);
		}
	};

	const genRandomNumber = () => {
		return Math.floor(Math.random() * (1000 - 1 + 1) + 1);
	};
	const favSongs = new Map([]);
	const saveUser = (data) => {
		let usrname = data.username.toLowerCase();
		const user = {
			email: data.email,
			username: usrname,
			name: data.name,
			friends: [],
			friendRequests: [],
			favArtists: [],
			prompts: [],
			skills: [],
			favSongs: [],
			hobbies: [],
			interests: [],
			accessLevel: "user",
			bio: "",
			organization: "",
			location: "",
			projects: "",
			backgroundPic: "https://wallpapercave.com/wp/wp2780420.jpg",
			avatar:
				"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.HLOr38Y1RZQoGz-y98QmEQHaHa%26pid%3DApi&f=1",
			userId: data.uid,
		};

		setDoc(doc(db, "userInfo", data.uid), user)
			.then(() => {
				if (isEmailListChecked) {
					addToMailList(data.email, data.name, data.uid);
				} else {
					Toast.show("Successful signup", {
						duration: Toast.durations.LONG,
					});
					setDisabled(false);
					// navigation.navigate("Login");
					RootNavigation.navigate("Verify Email");
				}
			})
			.catch((error) => {
				console.log(JSON.stringify(error));
				Toast.show(error.message, {
					duration: Toast.durations.LONG,
				});
			});
		const block = {
			blockedUserId: []
		}
		setDoc(doc(db, "block", data.uid), block)
	};

	const addToMailList = (email, name, uid) => {
		setDoc(doc(db, "emailList", uid), { email, name })
			.then(() => {
				Toast.show("success.", {
					duration: Toast.durations.LONG,
				});
				setDisabled(false);
				navigation.navigate("Verify Email");
			})
			.catch((error) => {
				console.log(JSON.stringify(error));
				Toast.show(error.message, {
					duration: Toast.durations.LONG,
				});
			});
	};
	const goToLogin = () => {
		navigation.navigate("Login");
	};
	return (
		<>
			<SafeAreaView style={styles.container}>
				<View style={styles.logoContainer}>
					<Image style={styles.logo} source={require("../assets/Logo.png")} />
				</View>
				<View>
					<Text style={styles.title}>Sign Up</Text>
				</View>

				<View style={styles.formArea}>
					<View style={styles.textInputArea}>
						<View style={styles.iconArea}>
							<FontAwesome name="user" size={20} color={DARKGREY} />
						</View>
						<View style={styles.inputArea}>
							<TextInput
								style={styles.placeholderText}
								placeholder="Name"
								onChangeText={(n) => setName(n)}
								placeholderTextColor="#003f5c"
							/>
						</View>
					</View>

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
							<FontAwesome name="user-o" size={20} color={DARKGREY} />
						</View>
						<View style={styles.inputArea}>
							<TextInput
								style={styles.placeholderText}
								placeholder="Username"
								onChangeText={(u) => setUsername(u)}
								placeholderTextColor="#003f5c"
								defaultValue={username}
								onBlur={checkUsername}
							/>
						</View>
					</View>
					{isTaken ? (
						<Text style={{ color: Colors.red300, marginLeft: 5 }}>
							Username already taken, you can choose from the following
						</Text>
					) : (
						<></>
					)}
					{suggestions.length > 0 ? (
						<View
							style={{
								flexDirection: "row",
								marginLeft: 5,
								flexWrap: "wrap",
							}}
						>
							{suggestions.map((su, i) => {
								return (
									<Chip
										onPress={() => {
											setUsername(su);
											setTaken(false);
										}}
										key={i}
										style={{
											marginLeft: 5,
											marginTop: 5,
											backgroundColor: Colors.amber100,
										}}
									>
										{su}
									</Chip>
								);
							})}
						</View>
					) : (
						<></>
					)}

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
						<View>
							{/* <FontAwesome
                onPress={() => setHidden(!isHidden)}
                name={isHidden ? "eye" : "eye-slash"}
                size={20}
                color={DARKGREY}
              /> */}
						</View>
					</View>

					<View style={styles.section}>
						<Checkbox
							style={styles.checkbox}
							value={isTermsChecked}
							onValueChange={setTermsChecked}
							color={isTermsChecked ? MAGENTA : undefined}
						/>
						<Text style={styles.paragraph}>
							I agree to terms and conditions.
						</Text>
					</View>
					<View style={styles.section}>
						<Checkbox
							style={styles.checkbox}
							value={isAgeChecked}
							onValueChange={setAgeChecked}
							color={isTermsChecked ? MAGENTA : undefined}
						/>
						<Text style={styles.paragraph}>
							I certify that I am at least 13 years old.
						</Text>
					</View>
					<View style={styles.section}>
						<Checkbox
							style={styles.checkbox}
							value={isEmailListChecked}
							onValueChange={setEmailListChecked}
							color={isEmailListChecked ? MAGENTA : undefined}
						/>
						<Text style={styles.paragraph}>
							I would like to join PrograMeet's emailing list.
						</Text>
					</View>
				</View>
				<TouchableOpacity
					disabled={disabled}
					style={styles.authBtnArea}
					onPress={createUser}
				>
					{disabled ? (
						<Text styles={styles.loginText}>Signing up...</Text>
					) : (
						<Text styles={styles.loginText}>Sign up</Text>
					)}
				</TouchableOpacity>
				<Text
					style={{
						marginTop: 10,
					}}
				>
					Don't have an account ?{" "}
					<Text onPress={goToLogin} style={styles.signupTxt}>
						Login
					</Text>
				</Text>
			</SafeAreaView>
		</>
	);
};

export default Signup;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: LIGHTGREY,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		paddingHorizontal: 15,
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
	},

	title: {
		fontWeight: "700",
		fontSize: 25,
		color: "black",
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
		width: "70%",
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
});