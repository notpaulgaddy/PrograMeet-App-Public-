import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
class Prompt {
	addPrompt = async (data, uid) => {
		const uRef = doc(db, "userInfo", uid);
		console.log("data to save", data);
		return setDoc(
			uRef,
			{
				prompts: data,
			},
			{ merge: true }
		);
	};
	remPrompt = async (data, uid) => {
		const uRef = doc(db, "userInfo", uid);
		console.log("data to save", data);
		return setDoc(
			uRef,
			{
				prompts: data,
			},
			{ merge: true }
		);
	};
}
export default new Prompt();
