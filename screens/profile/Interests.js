import React from "react";

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
import UserInterests from "../../components/UserInterests";

let count = 0;
let isDone = false;
const Interests = () => {
	const { user } = useSelector((state) => state.user);
	const [Interests, setInterests] = React.useState([
		{
			title: "Languages",
			data: [
				{ name: "Chinese", isSelected: false },
				{ name: "Hindi", isSelected: false },
				{ name: "Spanish", isSelected: false },
				{ name: "German", isSelected: false },
				{ name: "French", isSelected: false },
				{ name: "Arabic", isSelected: false },
				{ name: "Bengali", isSelected: false },
				{ name: "Russian", isSelected: false },
				{ name: "Portugese", isSelected: false },
				{ name: "Swedish", isSelected: false },
				{ name: "Indonesian", isSelected: false },
				{ name: "Japanese", isSelected: false },
				{ name: "Punjabi", isSelected: false },
				{ name: "Urdu", isSelected: false },
				{ name: "Greek", isSelected: false },
				{ name: "Swahili", isSelected: false },
				{ name: "Turkish", isSelected: false },
				{ name: "Vietnamese", isSelected: false },
				{ name: "Italian", isSelected: false },
				{ name: "Tagalog", isSelected: false },
				{ name: "Thai", isSelected: false },
				{ name: "Afrikaans", isSelected: false },
				{ name: "Creole", isSelected: false },
				{ name: "ASL", isSelected: false },
				{ name: "Somali", isSelected: false },
				{ name: "Igbo", isSelected: false },
				{ name: "Polish", isSelected: false },
			],
		},
		{
			title: "Academic",
			data: [
				{ name: "Computer Science", isSelected: false },
				{ name: "Math", isSelected: false },
				{ name: "Finance", isSelected: false },
				{ name: "Accounting", isSelected: false },
				{ name: "Engineering", isSelected: false },
				{ name: "Architecture", isSelected: false },
				{ name: "Physics", isSelected: false },
				{ name: "Biology", isSelected: false },
				{ name: "Chemistry", isSelected: false },
				{ name: "Marketing", isSelected: false },
				{ name: "Astonomy", isSelected: false },
				{ name: "Criminology", isSelected: false },
				{ name: "Dentistry", isSelected: false },
				{ name: "Education", isSelected: false },
				{ name: "Ecology", isSelected: false },
				{ name: "Economics", isSelected: false },
				{ name: "Health", isSelected: false },
				{ name: "Physiology", isSelected: false },
				{ name: "Pathology", isSelected: false },
				{ name: "Zoology", isSelected: false },
				{ name: "Virology", isSelected: false },
				{ name: "Statistics", isSelected: false },
				{ name: "Robotics", isSelected: false },
			],
		},
		{
			title: "Media",
			data: [
				{ name: "Social Media", isSelected: false },
				{ name: "Social Media Marketing", isSelected: false },
				{ name: "Content Creation", isSelected: false },
				{ name: "Streaming", isSelected: false },
				{ name: "Interviews", isSelected: false },
				{ name: "Songwriting", isSelected: false },
				{ name: "Music Production", isSelected: false },
				{ name: "Podcast", isSelected: false },
				{ name: "Animation", isSelected: false },
			],
		},
		{
			title: "Misc",
			data: [
				{ name: "Cars", isSelected: false },
				{ name: "Cooking", isSelected: false },
				{ name: "Streetwear", isSelected: false },
				{ name: "Fashion", isSelected: false },
				{ name: "Gardening", isSelected: false },
				{ name: "Fitness", isSelected: false },
				{ name: "Art", isSelected: false },
				{ name: "Film/TV", isSelected: false },
			],
		},
	]);
	const [showFab, setFab] = React.useState(false);
	const [isSaving, setSaving] = React.useState(false);
	const dispatch = useDispatch();
	const setInterest = (title, interest) => {
		if (user.interests.length > 5) {
			Toast.show("Select at most 5 Interests", {
				duration: Toast.durations.LONG,
			});
			return;
		}
		User.getUser(user.userId)
			.then((user) => {
				if (user.interests.length === 5) {
					Toast.show("Select at most 5 interests", {
						duration: Toast.durations.LONG,
					});
				} else {
					User.updateInterests(interest, user.userId, "add")
						.then((snp) => {
							Toast.show("Interest added", {
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
	React.useEffect(() => {});

	const updateAbout = async () => {
		let cleanObj = {};
		setSaving(true);
		Interests.map((interest) => {
			let dt = [];
			interest.data.map((item) => {
				if (item.isSelected) {
					dt.push(item.name);
					cleanObj[interest.title] = dt;
				}
			});
		});

		let profile = {
			...user,
		};
		profile.interests = [cleanObj];

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
	const Item = ({ interest, header }) => {
		i = i + 1;

		if (header === "Languages")
			return (
				<Chip
					key={i}
					style={{
						backgroundColor: interest.isSelected ? MAGENTA : "#70e000",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => setInterest(header, interest.name)}
				>
					{interest.name}
				</Chip>
			);

		if (header === "Academic")
			return (
				<Chip
					key={i}
					style={{
						backgroundColor: interest.isSelected ? MAGENTA : "#9ef01a",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => setInterest(header, interest.name)}
				>
					{interest.name}
				</Chip>
			);
		if (header === "Media")
			return (
				<Chip
					key={i}
					style={{
						backgroundColor: interest.isSelected ? MAGENTA : "#ccff33",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => setInterest(header, interest.name)}
				>
					{interest.name}
				</Chip>
			);
		if (header === "Misc")
			return (
				<Chip
					key={i}
					style={{
						backgroundColor: interest.isSelected ? MAGENTA : "#b5e48c",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => setInterest(header, interest.name)}
				>
					{interest.name}
				</Chip>
			);
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<ScrollView>
					<View style={styles.cardBody}>
						<View
							style={{
								flexDirection: "row",
								marginTop: 10,
								flexWrap: "wrap",
							}}
						>
							<UserInterests uid={user.userId} />
						</View>

						{Interests.map((inty) => {
							return (
								<>
									<List.Subheader>
										<Title>{inty.title}</Title>
									</List.Subheader>
									<View
										style={{
											flexDirection: "row",
											flexWrap: "wrap",
											paddingBottom: 10,
										}}
									>
										{inty.data.map((item) => {
											return <Item interest={item} header={inty.title} />;
										})}
									</View>
								</>
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

export default Interests;
