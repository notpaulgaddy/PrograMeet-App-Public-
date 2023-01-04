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
	SectionList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
	BLACK,
	DARKGREY,
	LIGHTGREY,
	MAGENTA,
	NAVYBLUE,
	WHITE,
} from "../../config/Constants";
import { ActivityIndicator, Chip, FAB, List, Title } from "react-native-paper";
import { SectionGrid } from "react-native-super-grid";
import Toast from "react-native-root-toast";
import User from "../../services/User";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/user";
import { useRoute } from "@react-navigation/native";
import UserHobbies from "../../components/UserHobbies";

let count = 0;
let isDone = false;
let userHobbies = [];
const Hobbies = () => {
	const { user } = useSelector((state) => state.user);
	const [selectedHobbies, setSelectedHobbies] = useState([]);
	const r = useRoute();
	const [hobbies, setHobbies] = React.useState([
		{
			title: "Sports",
			data: [
				{ name: "Basketball", isSelected: false },
				{ name: "Football", isSelected: false },
				{ name: "eSports", isSelected: false },
				{ name: "Soccer", isSelected: false },
				{ name: "MMA", isSelected: false },
				{ name: "Boxing", isSelected: false },
				{ name: "Tennis", isSelected: false },
				{ name: "Baseball", isSelected: false },
				{ name: "Hockey", isSelected: false },
				{ name: "Swimming", isSelected: false },
				{ name: "Cricket", isSelected: false },
				{ name: "Volleyball", isSelected: false },
				{ name: "NASCAR", isSelected: false },
				{ name: "Golf", isSelected: false },
				{ name: "Track and Field", isSelected: false },
				{ name: "Lacrosse", isSelected: false },
				{ name: "Rugby", isSelected: false },
			],
		},
		{
			title: "Games",
			data: [
				{
					name: "League of Legends",
					isSelected: false,
				},
				{
					name: "Elden Ring",
					isSelected: false,
				},
				{
					name: "Fortnite",
					isSelected: false,
				},
				{
					name: "Destiny",
					isSelected: false,
				},
				{
					name: "Minecraft",
					isSelected: false,
				},
				{
					name: "Valorant",
					isSelected: false,
				},
				{
					name: "Call of Duty",
					isSelected: false,
				},
				{
					name: "World of Warcraft",
					isSelected: false,
				},
				{
					name: "Batman Arkham Series",
					isSelected: false,
				},
				{
					name: "GTA",
					isSelected: false,
				},
				{
					name: "Dead by Daylight",
					isSelected: false,
				},
				{
					name: "Overwatch",
					isSelected: false,
				},
				{
					name: "Roblox",
					isSelected: false,
				},
				{
					name: "Animal Crossing",
					isSelected: false,
				},
				{
					name: "Halo",
					isSelected: false,
				},
				{
					name: "Sims",
					isSelected: false,
				},
				{
					name: "Escape From Tarkov",
					isSelected: false,
				},
				{
					name: "Mortal Kombat",
					isSelected: false,
				},
				{
					name: "Madden",
					isSelected: false,
				},
				{
					name: "NBA 2K",
					isSelected: false,
				},
				{
					name: "FIFA",
					isSelected: false,
				},
				{
					name: "Red Dead",
					isSelected: false,
				},
				{
					name: "Genshin Impact",
					isSelected: false,
				},
				{
					name: "Rainbow Six Siege",
					isSelected: false,
				},
				{
					name: "Apex Legends",
					isSelected: false,
				},
				{
					name: "Dungeons and Dragons",
					isSelected: false,
				},
				{
					name: "Rust",
					isSelected: false,
				},
				{
					name: "inFamous Second Son",
					isSelected: false,
				},
			],
		},
		{
			title: "TV Shows",
			data: [
				{
					name: "Stranger Things",
					isSelected: false,
				},
				{
					name: "Shameless",
					isSelected: false,
				},
				{
					name: "Daredevil",
					isSelected: false,
				},
				{
					name: "Family Guy",
					isSelected: false,
				},
				{
					name: "The 100",
					isSelected: false,
				},
				{
					name: "The Boys",
					isSelected: false,
				},
				{
					name: "Dexter",
					isSelected: false,
				},
				{
					name: "Mad Men",
					isSelected: false,
				},
				{
					name: "Sons of Anarchy",
					isSelected: false,
				},
				{
					name: "Sopranos",
					isSelected: false,
				},
				{
					name: "The Boondocks",
					isSelected: false,
				},
				{
					name: "#blackAF",
					isSelected: false,
				},
				{
					name: "Silicon Valley",
					isSelected: false,
				},
				{
					name: "Friends",
					isSelected: false,
				},
				{
					name: "Titans",
					isSelected: false,
				},
				{
					name: "Teen Titans",
					isSelected: false,
				},
				{
					name: "The Punisher",
					isSelected: false,
				},
				{
					name: "Wandavision",
					isSelected: false,
				},
				{
					name: "Moon Knight",
					isSelected: false,
				},
				{
					name: "House of Cards",
					isSelected: false,
				},
				{
					name: "Jane the Virgin",
					isSelected: false,
				},
				{
					name: "Black Mirror",
					isSelected: false,
				},
				{
					name: "Vampire Diaries",
					isSelected: false,
				},
				{
					name: "Teen Wolf",
					isSelected: false,
				},
				{
					name: "Modern Family",
					isSelected: false,
				},
				{
					name: "The Office",
					isSelected: false,
				},
				{
					name: "Breaking Bad",
					isSelected: false,
				},
				{
					name: "New Girl",
					isSelected: false,
				},

				{
					name: "Community",
					isSelected: false,
				},
				{
					name: "Atlanta",
					isSelected: false,
				},
			],
		},
	]);
	const [showFab, setFab] = React.useState(false);
	const [isSaving, setSaving] = React.useState(false);
	const dispatch = useDispatch();

	const setHobby = (title, hobby) => {
		if (user.hobbies.length > 5) {
			Toast.show("Select at most 5 hobbies", {
				duration: Toast.durations.LONG,
			});
			return;
		}
		User.getUser(user.userId)
			.then((user) => {
				if (user.hobbies.length === 5) {
					Toast.show("Select at most 5 hobbies", {
						duration: Toast.durations.LONG,
					});
				} else {
					User.updateHobbies(hobby, user.userId, "add")
						.then((snp) => {
							Toast.show("Hobby added", {
								duration: Toast.durations.LONG,
							});
						})
						.catch((error) => {});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	React.useEffect(() => {}, [selectedHobbies]);

	const updateAbout = async () => {
		let cleanObj = {};
		setSaving(true);
		hobbies.map((hobby) => {
			let dt = [];
			hobby.data.map((item) => {
				if (item.isSelected) {
					dt.push(item.name);
					cleanObj[hobby.title] = dt;
				}
			});
		});

		let profile = {
			...user,
		};
		profile.hobbies = [cleanObj];

		User.updateProfile(profile, user.userId)
			.then((user) => {
				dispatch(setUser(profile));
				setSaving(false);
			})
			.catch((error) => {
				console.log(error);
				setSaving(false);
			});
	};

	let i = 0;
	const Item = ({ hobby, header }) => {
		i = i + 1;

		if (header === "Sports")
			return (
				<Chip
					key={i}
					style={{
						backgroundColor: hobby.isSelected ? MAGENTA : "#95f2d9",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => setHobby(header, hobby.name)}
				>
					{hobby.name}
				</Chip>
			);

		if (header === "Games")
			return (
				<Chip
					key={hobby.name}
					style={{
						backgroundColor: hobby.isSelected ? MAGENTA : "#1cfeba",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => setHobby(header, hobby.name)}
				>
					{hobby.name}
				</Chip>
			);
		if (header === "TV Shows")
			return (
				<Chip
					key={i}
					style={{
						backgroundColor: hobby.isSelected ? MAGENTA : "#b8cdf8",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => setHobby(header, hobby.name)}
				>
					{hobby.name}
				</Chip>
			);
		if (header === "Anime")
			return (
				<Chip
					key={i}
					style={{
						backgroundColor: hobby.isSelected ? MAGENTA : "#F15BB5",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => setHobby(header, hobby.name)}
				>
					{hobby.name}
				</Chip>
			);
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<ScrollView>
					<View style={styles.cardBody}>
						<>
							<View
								style={{
									flexDirection: "row",
									marginTop: 10,
									flexWrap: "wrap",
								}}
							>
								<UserHobbies uid={user.userId} />
							</View>
						</>

						{hobbies.map((hob) => {
							return (
								<View key={hob.title}>
									<List.Subheader>
										<Title>{hob.title}</Title>
									</List.Subheader>
									<View
										style={{
											flexDirection: "row",
											flexWrap: "wrap",
										}}
									>
										{hob.data.map((item) => {
											return <Item hobby={item} header={hob.title} />;
										})}
									</View>
								</View>
							);
						})}
					</View>
				</ScrollView>
				{showFab ? (
					<FAB
						onPress={updateAbout}
						label="Save"
						icon={isSaving ? "loading" : "check"}
						style={{
							position: "absolute",
							margin: 10,
							bottom: 0,
							alignSelf: "center",
						}}
					/>
				) : (
					<></>
				)}
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
		flex: 1,
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

export default Hobbies;
