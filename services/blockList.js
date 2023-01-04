import { doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
class blockList {
	getBlockUsers = async (userId) => {
		try {
			const blockListRef = doc(db, "block", userId);
			const blockListSnapshot = await getDoc(blockListRef);

			if (blockListSnapshot.exists()) {
				return blockListSnapshot.data().blockedUserId;
			}

			return [];
		} catch (error) {
			console.log("error", error);
			return [];
		}
	}
}

export default new blockList();