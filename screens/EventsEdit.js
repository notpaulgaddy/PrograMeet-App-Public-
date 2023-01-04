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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
	BLACK,
	DARKGREY,
	LIGHTGREY,
	MAGENTA,
	NAVYBLUE,
	WHITE,
} from "../config/Constants";
import {
	Button,
	IconButton,
	List,
	MD3Colors,
	Menu,
	Surface,
} from "react-native-paper";
import Toast from "react-native-root-toast";
import { useDispatch, useSelector } from "react-redux";
import EventService from "../services/EventService";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as RootNavigation from "../helpers/RootNavigation";
import { useRoute } from "@react-navigation/native";
const EventsEdit = ({ navigation }) => {
	const { params } = useRoute();
	const [eventType, setEventType] = React.useState(params.event.eventType);
	const [eventTitle, setEventTitle] = React.useState(params.event.eventName);
	const [eventDate, setEventDate] = React.useState(params.event.eventDate);
	const [eventLink, setEventLink] = React.useState(params.event.eventLink);
	const [eventDescription, setEventDescription] = React.useState(params.event.eventDescription);
	const [saving, setSaving] = React.useState(false);
	const { user } = useSelector((state) => state.user);
	const [mode, setMode] = React.useState("date");
	const [show, setShow] = React.useState(false);
	const [visible, setVisible] = React.useState(false);
	console.log(params.event);

	const updateEvent = async () => {
		let eventObj = {
			eventType,
			eventTitle,
			eventLink,
			eventDate,
			eventDescription,
			uid: user.userId,
			createdAt: params.event.createdAt,
		};

		if (
			eventObj.eventDate === "" ||
			eventObj.eventTitle === "" ||
			eventObj.eventType === "" ||
			eventObj.eventDescription === "",
			eventObj.eventLink === ""
		) {
			displayToast("Please fill in all the fields !");
			return;
		} else {
			setSaving(true);
			EventService.update(eventObj, params.event.eventKey)
				.then((snap) => {
					displayToast("Event updated");
					navigation.pop();
					setSaving(false);
				})
				.catch((error) => {
					navigation.pop();
					displayToast(JSON.stringify(error));
					setSaving(false);
				});
		}
	};
	// const onChange = (event, selectedDate) => {
	// 	const currentDate = selectedDate;
	// 	setShow(false);
	// 	setEventDate(currentDate);
	// };
	// const showMode = (currentMode) => {
	// 	setShow(true);
	// 	setMode(currentMode);
	// };

	// const showDatepicker = () => {
	// 	showMode("date");
	// };

	// const showTimepicker = () => {
	// 	showMode("time");
	// };

	const openMenu = () => setVisible(true);

	const closeMenu = () => setVisible(false);

	const displayToast = (msg) => {
		Toast.show(msg, {
			duration: Toast.durations.LONG,
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<View style={styles.cardBody}>
					<ScrollView>
						<List.Subheader
							style={{
								fontWeight: "bold",
								color: "black",
								textAlign: "center",
								fontSize: 30,
							}}
						>
							{params.event.eventName} {params.event.eventType}{" "}
						</List.Subheader>

						<Surface
							style={{
								minHeight: 50,
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
									marginTop: 15,
									fontWeight: "700",
									color: DARKGREY,
								}}
							>
								Event Type
							</Text>
							<Menu
								anchor={
									<Button
										uppercase={false}
										onPress={openMenu}
										style={{ marginTop: 10 }}
									>
										Click to Select Event Type
									</Button>
								}
								visible={visible}
								onDismiss={closeMenu}
							>
								<Menu.Item
									onPress={(e) => {
										setEventType("Bootcamp");
										closeMenu();
									}}
									title="Bootcamp"
								/>
								<Menu.Item
									onPress={(e) => {
										setEventType("Game Night");
										closeMenu();
									}}
									title="Game Night"
								/>
								<Menu.Item
									onPress={(e) => {
										setEventType("Movie Night");
										closeMenu();
									}}
									title="Movie Night"
								/>
							</Menu>
						</Surface>
						<Surface
							style={{
								minHeight: 50,
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
									marginTop: 15,
									fontWeight: "700",
									color: DARKGREY,
								}}
							>
								Event Title
							</Text>

							<View style={styles.textInputArea}>
								<View style={styles.inputArea}>
									<TextInput
										defaultValue={params.event.eventName}
										style={{
											height: 50,
											padding: 10,
										}}
										placeholder="Title"
										onChangeText={(title) => setEventTitle(title)}
									/>
								</View>
							</View>
						</Surface>
						<Surface
							style={{
								minHeight: 50,
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
									marginTop: 15,
									fontWeight: "700",
									color: DARKGREY,
								}}
							>
								Google Meet Link
							</Text>

							<View style={styles.textInputArea}>
								<View style={styles.inputArea}>
									<TextInput
										defaultValue={params.event.eventLink}
										style={{
											height: 50,
											padding: 10,
										}}
										placeholder="Google Meet Link"
										onChangeText={(link) => setEventLink(link)}
									/>
								</View>
							</View>
						</Surface>
						<Surface
							style={{
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
								}}
							>
								Date
							</Text>
							<TextInput
								multiline={true}
								numberOfLines={3}
								placeholder="Date Ex.(07/26/22)"
								onChangeText={(date) => setEventDate(date)}
								style={{
									height: 50,
									padding: 10,
								}}
							/>
						</Surface>

						<Surface
							style={{
								marginTop: 5,
							}}
						>
							<Text
								style={{
									paddingLeft: 10,
									paddingTop: 5,
									marginTop: 15,
									fontWeight: "700",
									color: DARKGREY,
								}}
							>
								Description
							</Text>

							<View style={styles.textInputArea}>
								<View style={styles.inputArea}>
									<TextInput
										defaultValue={params.event.eventDescription}
										multiline={true}
										numberOfLines={3}
										placeholder="Event description"
										onChangeText={(desc) => setEventDescription(desc)}
										style={{
											height: 50,
											padding: 10,
										}}
									/>
								</View>
							</View>
						</Surface>
						<TouchableOpacity
							disabled={saving}
							onPress={updateEvent}
							style={{
								marginTop: 10,
								backgroundColor: saving ? DARKGREY : MAGENTA,
								padding: 10,
							}}
						>
							<Text
								style={{
									alignSelf: "center",
									fontSize: 17,
									color: saving ? WHITE : LIGHTGREY,
									fontWeight: "bold",
								}}
							>
								{saving ? "Updating..." : "Update"}
							</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
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
		alignItems: "center",
		flexDirection: "row",
		width: "100%",
	},
	cardBody: {
		marginHorizontal: 10,
		flex: 1,
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
	textInputArea: {
		backgroundColor: WHITE,
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 15,
		marginTop: 10,
	},
	inputArea: {
		backgroundColor: "white",
		borderRadius: 30,
		width: "70%",
		height: 45,
		marginBottom: 20,
		borderRadius: 10,
	},
});

export default EventsEdit;
