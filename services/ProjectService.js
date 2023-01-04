import {
	doc,
	collection,
	setDoc,
	addDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
class ProjectService {
	#db;
	constructor() {
		this.#db = db;
	}
	add = async (project) => {
		project.createdAt = Date.now();
		return await addDoc(collection(this.#db, "projects"), project);
	};
	update = async (project, ky) => {
		return await setDoc(doc(this.#db, "projects", ky), project);
	};
	delete = async (key) => {
		return await deleteDoc(doc(this.#db, "projects", key));
	};
}
export default new ProjectService();
