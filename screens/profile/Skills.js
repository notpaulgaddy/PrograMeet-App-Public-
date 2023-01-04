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
import { StatusBar } from "expo-status-bar";
import {
	BLACK,
	DARKGREY,
	LIGHTGREY,
	MAGENTA,
	NAVYBLUE,
	WHITE,
} from "../../config/Constants";
import { Chip, List, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";
import User from "../../services/User";
import { setUser } from "../../store/user";
const DATA = [
	{
		title: "Computer Science",
		data: [
			"Software engineering",
			"React Native",
			"Java",
			"Python",
			"JavaScript",
			"Vue JS",
			"Angular JS",
			"Database Systems",
			"Data Structures",
			"Game Development",
			"Flutter",
			"Fullstack Development",
			"SQL",
			"Kotlin",
			"MongoDB",
		],
	},
	{
		title: "Media",
		data: [
			"Video editing",
			"Photoshop",
			"Social Media Marketing",
			"Marketing",
			"Graphic design",
		],
	},
];
let skillArr = [];
const Skills = () => {
	const [skills, setSkills] = React.useState([]);
	const { user } = useSelector((state) => state.user);
	const [isAdding, setIsAdding] = React.useState(false);
	const dispatch = useDispatch();

	React.useEffect(() => {}, [skills]);

	const addSkill = (skill) => {
		if (user.skills) {
			skillArr = [...user.skills];
		}
		if (user.skills.length === 5) {
			Toast.show("Upto five skills should be added", {
				duration: Toast.durations.LONG,
			});
			return;
		}
		if (!skillArr.includes(skill)) {
			skillArr.push(skill);
		} else {
			let arr = skillArr.filter((itms) => itms !== skill);
			skillArr = arr;
		}
		setIsAdding(true);

		User.updateSkills(skillArr, user.userId).then(() => {
			User.getUser(user.userId).then((user) => {
				dispatch(setUser(user));
				Toast.show("Skill added", {
					duration: Toast.durations.LONG,
				});
				setIsAdding(false);
			});
		});
	};

	const remSkill = (skill) => {
		if (user.skills) {
			skillArr = [...user.skills];
		}
		let arr = skillArr.filter((itms) => itms !== skill);
		skillArr = arr;
		setIsAdding(true);
		User.updateSkills(skillArr, user.userId).then(() => {
			User.getUser(user.userId).then((user) => {
				dispatch(setUser(user));
				Toast.show("Skill removed", {
					duration: Toast.durations.LONG,
				});
				setIsAdding(false);
			});
		});
	};

	const Item = ({ hobby, header }) => {
		if (header === "Computer Science")
			return (
				<Chip
					style={{
						backgroundColor: skills.includes(hobby) ? MAGENTA : "#ffdd00",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => addSkill(hobby)}
				>
					{hobby}
				</Chip>
			);
		if (header === "Media")
			return (
				<Chip
					style={{
						backgroundColor: skills.includes(hobby) ? MAGENTA : "#ffea00",
						marginTop: 10,
						marginHorizontal: 5,
					}}
					onPress={() => addSkill(hobby)}
				>
					{hobby}
				</Chip>
			);
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<ScrollView>
					<View style={styles.cardBody}>
						{user.skills && user.skills.length > 0 ? (
							<>
								<List.Subheader>
									<Title>Added Skills {user.skills.length}/5</Title>
								</List.Subheader>
								<View
									style={{
										flexDirection: "row",
										flexWrap: "wrap",
									}}
								>
									{user.skills.map((skl, i) => {
										return (
											<Chip
												disabled={isAdding}
												key={i}
												style={{
													backgroundColor: MAGENTA,

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
							</>
						) : (
							<></>
						)}
						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
							}}
						>
							{skills.length > 0 ? (
								skills.map((skl, i) => {
									return (
										<Chip
											disabled={isAdding}
											key={i}
											style={{
												backgroundColor: MAGENTA,

												marginTop: 10,
												marginHorizontal: 5,
											}}
											onPress={() => remSkill(skl)}
										>
											{skl}
										</Chip>
									);
								})
							) : (
								<></>
							)}
						</View>
						{DATA.map((hob) => {
							return (
								<>
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
								</>
							);
						})}
					</View>
				</ScrollView>
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
export default Skills;
