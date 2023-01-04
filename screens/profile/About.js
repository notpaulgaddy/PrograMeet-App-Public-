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
} from "react-native";
import { Avatar, Chip, Title } from "react-native-paper";
import { DARKGREY, LIGHTGREY, WHITE } from "../../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import AppContext from "../../store/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { doc, getFirestore } from "firebase/firestore";
import { db } from "../../config/firebase";
import Placeholder from "../../components/Placeholder";
import { useDocument } from "react-firebase-hooks/firestore";
import UserFavSong from "../../components/UserFavSong";
import UserHobbiesUnchanged from "../../components/UserHobbiesUnchanged";
import UserInterestsUnchanged from "../../components/UserInterestsUnchanged";

const About = ({ uid, friend, canModify }) => {

	const [user, loading, error] = useDocument(
		doc(
			db,
			"userInfo",
			`${canModify ? uid : friend.userId}`
		),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	React.useEffect(() => { }, []);

	if (loading) {
		return <Placeholder />;
	}

	return (
		<ScrollView style={styles.container}>
			<View
				style={{
					marginTop: 10,
					marginBottom: 10,
				}}
			>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Title
						style={{
							fontSize: 15,
							color: DARKGREY,
						}}
					>
						Favorite Song
					</Title>
					<FontAwesome
						style={{
							paddingLeft: 10,
						}}
						size={20}
						color={DARKGREY}
						name="music"
					/>
				</View>
				<View
					style={{
						marginTop: 10,
						flexDirection: "row",
						flexWrap: "wrap",
					}}
				>
					<UserFavSong canModify={false} uid={user.data().userId} />
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Title
						style={{
							fontSize: 15,
							color: DARKGREY,
						}}
					>
						Favorite Spotify Artists
					</Title>
					<FontAwesome
						style={{
							paddingLeft: 10,
						}}
						size={20}
						color={DARKGREY}
						name="spotify"
					/>
				</View>
				<ScrollView
					style={{
						marginTop: 10,
						flex: 1,
						flexDirection: "row",
					}}
					horizontal={true}
				>
					{user.data().favArtists && user.data().favArtists.length > 0 ? (
						user.data().favArtists.map((artist, i) => {
							return (
								<Chip
									key={`${artist}-${i}`}
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
								>
									{artist.name}
								</Chip>
							);
						})
					) : (
						<></>
					)}
				</ScrollView>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Title
						style={{
							fontSize: 15,
							color: DARKGREY,
						}}
					>
						Hobbies
					</Title>
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
						marginTop: 10,
						marginBottom: 10,
						flexWrap: "wrap",
					}}
				>
					<UserHobbiesUnchanged uid={user.data().userId} />
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Title
						style={{
							fontSize: 15,
							color: DARKGREY,
						}}
					>
						Interests
					</Title>
				</View>
				<View
					style={{
						flexDirection: "row",
						marginTop: 10,
						marginBottom: 10,
						flexWrap: "wrap",
					}}
				>
					<UserInterestsUnchanged uid={user.data().userId} />
				</View>

				<Text style={{ marginTop: 5, fontWeight: "700", color: DARKGREY }}>
					Skills
				</Text>
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						marginBottom: 15,
					}}
				>
					{canModify &&
						user.data().skills &&
						user.data().skills.map((skl, i) => {
							return (
								<Chip
									key={i}
									style={{
										marginTop: 10,
										marginHorizontal: 5,
									}}
								>
									{skl}
								</Chip>
							);
						})}
				</View>
				<View
					style={{
						marginTop: 10,
						flexDirection: "row",
						flexWrap: "wrap",
					}}
				>
					{!canModify &&
						friend &&
						friend.skills !== "" &&
						friend.skills.map((skl, i) => {
							return (
								<Chip
									key={i}
									style={{
										marginTop: 10,
										marginHorizontal: 5,
									}}
								>
									{skl}
								</Chip>
							);
						})}
				</View>
			</View>
		</ScrollView>
	);
};

export default About;

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 10,
		backgroundColor: LIGHTGREY,
		marginTop: 10,
		padding: 5,
	},
});
