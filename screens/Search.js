import React, { useState, useContext, useCallback } from "react";

import {
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	SafeAreaView,
	Image,
	FlatList,
	TouchableOpacity,
	View,
	ScrollView,
} from "react-native";
import * as RootNavigation from "../helpers/RootNavigation";
import { StatusBar } from "expo-status-bar";
import {
	BLACK,
	DARKGREY,
	LIGHTGREY,
	MAGENTA,
	NAVYBLUE,
	WHITE,
} from "../config/Constants";
import { setModal } from "../store/model";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import User from "../services/User";
import AppContext from "../store/AppContext";
import { Surface, Card, Title } from "react-native-paper";
import Placeholder from "../components/Placeholder";
import { getDatabase, ref, onValue, child, get } from "firebase/database";
import { getFirestore, collection, where, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import DisplayUserSearch from "../components/DisplayUserSearch";
import Ionicons from "@expo/vector-icons/Ionicons";

const Search = (props, navigation) => {
	const ctxt = useContext(AppContext);
	const [clear, showClear] = React.useState(false);
	const inputRef = React.useRef("");
	const [users, setUsers] = useState([]);
	const [friendReqs, setFriendReqs] = useState([]);
	const currentUser = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [isSearching, setSearching] = useState(false);
	const [results, setResults] = useState(null);

	const [fireVal, storeLoading, storeError] = useCollection(
		query(
			collection(db, "userInfo"),
			where("userId", "!=", currentUser.user.userId)
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	React.useEffect(() => {
		// setSearching(false);
	}, []);

	useFocusEffect(
		useCallback(() => {
			// setSearching(false);
		})
	);

	const sendFriendRequest = async (friendId, type) => {
		await User.friendRequest(friendId, currentUser.user.userId, type);
	};

	const doSearch = (q) => {
		if (q.length >= 1) {
			setSearching(true);
			User.searchFriend(q)
				.then((snap) => {
					snap.docs.map((snp) => {
						console.log(snp.data());
					});
					setResults(snap.docs);
				})
				.catch((errors) => {
					console.log(errors);
				});
		} else {
			setSearching(false);
		}
	};

	const renderItem = ({ item }) => {
		{
			return currentUser.user.friends.includes(item.data().email) ? (
				<></>
			) : (
				<Card
					style={{
						flex: 1,
						margin: 5,
						marginBottom: 10,
						flexDirection: "row",
					}}
				>
					<TouchableOpacity
						onPress={() =>
							RootNavigation.navigate("ViewProfile", {
								uid: item.data().userId,
							})
						}
					>
						<Card.Cover
							data={item.data().avatar}
							source={{ uri: item.data().avatar }}
						/>
					</TouchableOpacity>
					<Card.Content>
						<TouchableOpacity
							onPress={() =>
								RootNavigation.navigate("ViewProfile", {
									uid: item.data().userId,
								})
							}
						>
							<Title data={item}>
								{item.data().name} @{item.data().username}
							</Title>
						</TouchableOpacity>
					</Card.Content>
				</Card>
			);
		}
	};
	if (!currentUser.user) {
		return <Placeholder />;
	}
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<View style={styles.cardBody}>
					<View
						style={{
							borderColor: DARKGREY,
							flexDirection: "row",
							alignItems: "center",
							borderWidth: 1,
							borderRadius: 25,
							justifyContent: "space-evenly",
							marginTop: 15,
						}}
					>
						<View
							style={{
								padding: 3,
							}}
						>
							<Ionicons name="search-outline" size={35} color={DARKGREY} />
						</View>
						<View
							style={{
								padding: 3,
								width: "60%",
							}}
						>
							<TextInput
								ref={inputRef}
								onChangeText={(q) => doSearch(q)}
								placeholderTextColor={"black"}
								style={{
									flexGrow: 1,
								}}
								placeholder={`Search for user`}
							/>
						</View>
						{clear ? (
							<View
								style={{
									justifyContent: "flex-end",
								}}
							>
								<Ionicons
									onPress={() => {
										inputRef.current.clear();
										showClear(false);
										dispatch(
											setSearch({
												type: "events",
												results: "",
											})
										);
									}}
									size={20}
									name="close-circle-sharp"
									color={MAGENTA}
								/>
							</View>
						) : (
							<View
								style={{
									padding: 3,
									width: "20%",
								}}
							></View>
						)}
					</View>

					{/* <SearchBox
            type={"SEARCH_FRIENDS"}
            placeholderText="Search for a user"
          /> */}
					<Surface
						style={{
							marginTop: 10,
							padding: 5,
							backgroundColor: LIGHTGREY,
						}}
					></Surface>

					{!storeLoading && !isSearching && (
						<FlatList
							key={2}
							keyExtractor={(item) => item.id}
							data={fireVal.docs}
							renderItem={(item) => renderItem(item)}
							numColumns={2}
						/>
					)}

					{isSearching && results && <DisplayUserSearch data={results} />}
				</View>
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

		width: "100%",
	},
	cardBody: {
		marginHorizontal: 10,

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

export default Search;
