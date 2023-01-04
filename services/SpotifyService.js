import StorageService from "./StorageService";
import SpotifyWebAPI from "spotify-web-api-js";
import { spToken } from "../api/spotify";

class SpotifyService {
	constructor() {}
	searchTracks = async (queryTerm, limit) => {
		var spt = new SpotifyWebAPI();
		let token = await spToken();
		spt.setAccessToken(token);
		return spt.searchTracks(queryTerm, { limit });
	};

	searchArtists = async (queryTerm, limit) => {
		var spt = new SpotifyWebAPI();
		let token = await spToken();
		spt.setAccessToken(token);
		return spt.searchArtists(queryTerm, { limit });
	};
}
export default new SpotifyService();
