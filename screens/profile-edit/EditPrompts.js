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
	TouchableOpacity,
	Modal,
	Pressable,
	Alert,
} from "react-native";

import {
	Button,
	Card,
	FAB,
	IconButton,
	List,
	Paragraph,
	Divider,
	Surface,
	Title,
} from "react-native-paper";
import { DARKGREY, LIGHTGREY, MAGENTA, WHITE } from "../../config/Constants";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AppContext from "../../store/AppContext";
import Prompt from "../../services/Prompt";
import User from "../../services/User";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/user";
import Ionicons from "@expo/vector-icons/Ionicons";

const EditPrompts = () => {
	const prompts = [
		{
			id: 1,
			title: "What makes me smile is",
		},
		{
			id: 2,
			title: "Don't hate me but",
		},
		{
			id: 3,
			title: "What I want in a friend is",
		},
		{
			id: 4,
			title: "I take pride in",
		},
		{
			id: 5,
			title: "I'm convinced that",
		},
		{
			id: 6,
			title: "My most rational fear is",
		},
		{
			id: 7,
			title: "My most irrational fear is",
		},
		{
			id: 8,
			title: "Why I'd be a great friend",
		},
		{
			id: 9,
			title: "A random cool fact is",
		},
		{
			id: 10,
			title: "I wish more people knew that",
		},
		{
			id: 11,
			title: "Two truths and a lie",
		},
		{
			id: 12,
			title: "Never have I ever",
		},
		{
			id: 13,
			title: "An overshare:",
		},
		{
			id: 14,
			title: "My most embarassing moment is",
		},
		{
			id: 15,
			title: "My biggest pet peeve is",
		},
		{
			id: 16,
			title: "A project I really wanna work on is",
		},
		{
			id: 17,
			title:
				"What would you do for the rest of your life if money was never an issue?",
		},
		{
			id: 18,
			title: "In the future, I would like to work on",
		},
		{
			id: 19,
			title: "My strengths include",
		},
		{
			id: 20,
			title: "Where do you see yourself in 5 years?",
		},
		{
			id: 21,
			title: "My dream career is",
		},
		{
			id: 22,
			title: "This year, I'm looking forward to",
		},
		{
			id: 23,
			title: "My favorite travel location is",
		},
		{
			id: 24,
			title: "My ultimate goal in life is",
		},
		{
			id: 24,
			title: "My ultimate goal in life is",
		},
		{
			id: 25,
			title: "One of my favorite games of all time is",
		},
		{
			id: 26,
			title: "My favorite thing to do in my free time is",
		},
		{
			id: 27,
			title: "My favorite line from a movie is",
		},
		{
			id: 28,
			title: "I’m the type of texter who",
		},
		{
			id: 29,
			title: "Cats or dogs?",
		},
		{
			id: 30,
			title: "The secret to getting to know me is",
		},
	];
	const [modalVisible, setModalVisible] = React.useState(false);
	const ctxt = React.useContext(AppContext);
	const [selectedPrompts, setPrompts] = React.useState([]);
	const [selectedUPrompts, setUPrompts] = React.useState([]);
	const [saving, setSaving] = React.useState(false);
	const [isValid, setValid] = React.useState(false);
	const inputRef = React.useRef("");
	const currentUser = useSelector((state) => state.user);
	const dispatch = useDispatch();

	let prompts2 = [];
	const setPrompt = (p) => {
		if (!selectedPrompts.includes(p)) {
			prompts2 = [...selectedPrompts];
			prompts2.push(p);
		} else {
			let newArr = selectedPrompts.filter((pid) => pid !== p);

			prompts2 = newArr;
		}
		setPrompts(prompts2);
	};

	const savePrompt = () => {
		let selectP = [];

		selectedPrompts.forEach((prompt) => {
			prompts.forEach((pro) => {
				if (pro.id === prompt) {
					selectP.push(pro);
				}
			});
		});
		setUPrompts(selectP);

		setModalVisible(!modalVisible);
	};

	const getAnswer = (ans, p) => {
		setTimeout(() => {
			selectedUPrompts.map((pro) => {
				if (pro.id === p.id) {
					pro.answer = ans;
				}
			});
		}, 1500);
	};

	useFocusEffect(
		React.useCallback(() => {
			User.getUser(currentUser.user.userId).then((user) => {
				console.log(user);
			});

			return () => {};
		})
	);

	const savePrompts = () => {
		if (
			selectedUPrompts.length > 0 &&
			selectedUPrompts.every((it) => it.answer !== "")
		) {
			setSaving(true);
			Prompt.addPrompt(selectedUPrompts, currentUser.user.userId)
				.then((res) => {
					setSaving(false);
					User.getUser(currentUser.user.userId).then((user) => {
						dispatch(setUser(user));
						Toast.show("Saved !", {
							duration: Toast.durations.LONG,
						});
					});
				})
				.catch((error) => {
					console.log(error);
					Toast.show(JSON.stringify(error), {
						duration: Toast.durations.LONG,
					});
					setSaving(false);
				});
		} else {
			Toast.show("Please answer all the prompts", {
				duration: Toast.durations.LONG,
			});
			setSaving(false);
		}
	};

	const remPrompt = (pr) => {
		let newArr = [];
		newArr = currentUser.user.prompts.filter((prmt) => prmt.id !== pr.id);
		Prompt.remPrompt(newArr, currentUser.user.userId)
			.then((snap) => {
				User.getUser(currentUser.user.userId).then((user) => {
					dispatch(setUser(user));
					Toast.show("deleted !", {
						duration: Toast.durations.LONG,
					});
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};
	return (
		<ScrollView style={styles.container}>
			{selectedUPrompts.length > 0 ? (
				<Title
					style={{
						color: DARKGREY,
					}}
				>
					Selected prompts
				</Title>
			) : (
				<></>
			)}

			{currentUser.user &&
				currentUser.user.prompts &&
				currentUser.user.prompts.map((pr, i) => {
					return (
						<Surface
							key={i}
							style={{
								marginTop: 10,
								padding: 10,
								position: "relative",
								borderRadius: 20,
							}}
						>
							<View>
								<View>
									<Title
										style={{
											fontSize: 15,
										}}
									>
										{pr.title}
									</Title>
									<Paragraph>{pr.answer}</Paragraph>
								</View>
								<View></View>
							</View>
							<IconButton
								onPress={() => remPrompt(pr)}
								style={{
									position: "absolute",
									right: -10,
									top: -20,
									zIndex: 999,
								}}
								icon={"close-circle-outline"}
							/>
						</Surface>
					);
				})}

			<TouchableOpacity
				onPress={() => setModalVisible(true)}
				style={{
					padding: 15,
					backgroundColor: WHITE,
					width: "50%",
					marginTop: 10,
					width: "100%",
					borderRadius: 20,
				}}
			>
				<View
					style={{
						backgroundColor: WHITE,
						flexDirection: "row",
						flexWrap: "wrap",
						alignItems: "center",
					}}
				>
					<Text>
						<Ionicons name="add-circle" size={20} color={DARKGREY} />
					</Text>
					<Text style={{ marginLeft: 20 }}>Add New</Text>
				</View>
			</TouchableOpacity>

			{selectedUPrompts.length > 0 ? (
				selectedUPrompts.map((promp, i) => {
					return (
						<Surface key={i} style={{ marginTop: 10, padding: 10 }}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									borderRadius: 20,
								}}
							>
								<View>
									<Title
										style={{
											fontSize: 15,
										}}
									>
										{promp.title}
									</Title>
								</View>
								<View>
									<IconButton icon={"circle-edit-outline"} />
								</View>
							</View>
							<TextInput
								onChangeText={(ans) => getAnswer(ans, promp)}
								ref={inputRef}
								placeholder="Answer"
							/>
						</Surface>
					);
				})
			) : (
				<></>
			)}

			{selectedUPrompts.length > 0 ? (
				<View>
					<Pressable
						disabled={saving}
						style={{
							backgroundColor: MAGENTA,
							color: LIGHTGREY,
							padding: 10,
						}}
						onPress={() => savePrompts()}
					>
						{saving ? (
							<Text
								style={{
									alignSelf: "center",
									color: LIGHTGREY,
								}}
							>
								Saving...
							</Text>
						) : (
							<Text
								style={{
									alignSelf: "center",
									color: LIGHTGREY,
								}}
							>
								Save
							</Text>
						)}
					</Pressable>
				</View>
			) : (
				<View></View>
			)}

			<Modal
				animationType="slide"
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View
						style={{
							position: "relative",
							marginTop: 30,
						}}
					>
						<List.Subheader>Select prompts</List.Subheader>
						<IconButton
							onPress={() => setModalVisible(!modalVisible)}
							style={{
								position: "absolute",
								right: 0,
							}}
							icon={"close"}
						/>
					</View>
					<ScrollView style={styles.modalView}>
						{prompts.map((prompt, i) => {
							return (
								<Pressable onPress={() => setPrompt(prompt.id)}>
									<List.Item
										right={(props) => {
											return (
												<List.Icon
													{...props}
													icon={
														selectedPrompts.includes(prompt.id)
															? "check-circle"
															: "chevron-right"
													}
												/>
											);
										}}
										title={prompt.title}
									/>
									<Divider />
								</Pressable>
							);
						})}
					</ScrollView>
				</View>
				{selectedPrompts.length > 0 ? (
					<FAB
						style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
						icon="arrow-right"
						onPress={() => savePrompt()}
					/>
				) : (
					<></>
				)}
			</Modal>
		</ScrollView>
	);
};

export default EditPrompts;

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 10,
		backgroundColor: LIGHTGREY,
		marginTop: 10,
		padding: 5,
	},
});
