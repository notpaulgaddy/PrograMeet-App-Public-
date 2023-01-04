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
import moment from "moment";
import EventBox from "../components/EventBox";
const Event = ({ navigation }) => {
	const { params } = useRoute();

	const { user } = useSelector((state) => state.user);

	console.log(".......", params);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<View style={styles.cardBody}>
					<ScrollView>
						<List.Subheader>{params.event.eventType}</List.Subheader>
						<EventBox
							navigation={RootNavigation}
							userType={user.accessLevel}
							eventType={params.event.eventType}
							eventName={params.event.eventTitle}
							eventDate={params.event.eventDate}
							eventKey={params.eventKey}
							eventTime={moment(params.event.createdAt).format("llll")}
							eventDescription={params.event.eventDescription}
							createdAt={params.event.createdAt}
						/>
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
});

export default Event;
