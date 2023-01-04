import React from "react";
import { useState, useEffect } from "react";
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
} from "../config/Constants";
import { Feather, Entypo } from "@expo/vector-icons";
import SearchBox from "../components/SearchBox";
import SpotifyDisplaySongs from "../components/SpotifyDisplaySongs";
import StorageService from "../services/StorageService";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../store/search";
import SpotifyDisplayArtists from "../components/SpotifyDisplayArtists";
import SpotifyService from "../services/SpotifyService";
import { setSearchTerm } from "../store/searchq";
import { List } from "react-native-paper";

const SpotifyArtist = () => {
	const { q } = useSelector((state) => state.q);
	const { searchData } = useSelector((state) => state.search);
	const [results, setResults] = React.useState(null);
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(setSearchTerm(""));
	}, []);
	if (
		searchData.type == "SPOTIFY_SEARCH_ARTISTS" &&
		searchData.q !== "" &&
		searchData.q &&
		searchData.q.length >= 3
	) {
		SpotifyService.searchArtists(searchData.q, 10).then((res) => {
			console.log("search artists results  ", res.artists.items);
			setResults(res.artists.items);
		});
	} else {
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<View style={styles.cardBody}>
					<SearchBox
						type={`SPOTIFY_SEARCH_ARTISTS`}
						placeholderText="Search for artists"
					/>

					<ScrollView>
						<List.Subheader>Favorite Artist</List.Subheader>
						<SpotifyDisplayArtists artists={results} />
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

export default SpotifyArtist;
