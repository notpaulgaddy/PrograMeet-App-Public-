import {
	doc,
	getFirestore,
	collection,
	addDoc,
	query,
	updateDoc,
	arrayUnion,
	arrayRemove,
	setDoc,
	getDoc
} from "firebase/firestore";
import { db } from "../config/firebase";
class Block {
	blockuser = async (profileId, userId) => {
		const myRef = doc(db, "block", userId);
		const myDoc = await getDoc(myRef);
		const blocked = myDoc.data().blockedUserId;
		const blockedData = {
			blockedUserId: arrayUnion(profileId),
		};
		//console.log(blocked)
		return await updateDoc(doc(db, "block", userId), blockedData)
		//    return await setDoc(collection(db, "block",`${userId}`), blockedData)
		// 		console.log(JSON.stringify(error));
		// });
	}
}

export default new Block();