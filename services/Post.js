import {
  doc,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
class Post {
  addPost = async (postData) => {
    postData.timestamp = serverTimestamp();

    return await addDoc(collection(db, "posts"), postData);
  };
  addComment = async (comment) => {
    console.log(comment);
    comment.timestamp = serverTimestamp();

    const postRef = doc(db, "posts", `${comment.postKey}`);
    const commsRef = collection(db, "comments");
    let snap = await getDoc(postRef);
    let commentCount = snap.data().commentCount + 1;
    await setDoc(
      doc(db, `posts`, `${comment.postKey}`),
      {
        commentCount,
      },
      {
        merge: true,
      }
    );
    return await addDoc(commsRef, comment);
  };
  deletePost = async (ky) => {
    await deleteDoc(doc(db, "posts", ky));
  };
  addReply = async (comment) => {
    console.log(comment);
    comment.timestamp = serverTimestamp();
    comment.isReply = true;

    const postRef = doc(db, "comments", `${comment.commKey}`);

    const commsRef = collection(db, "comments");
    let snap = await getDoc(postRef);
    let commentCount = snap.data().commentCount + 1;
    await setDoc(
      doc(db, `comments`, `${comment.commKey}`),
      {
        commentCount,
      },
      {
        merge: true,
      }
    );
    return await addDoc(commsRef, comment);
  };

  doUpdateComment = async (postKey) => {
    await setDoc(
      doc(db, `posts`, `${postKey}`),
      {
        likes: likes,
      },
      {
        merge: true,
      }
    );
  };
  fetchPosts = async () => {
    const querySnapshot = await getDocs(
      collection(db, "posts"),
      orderBy("createdAt", (descending = true))
    );
    return querySnapshot;
  };
  fetchUserPosts = async (uid) => {
    //get posts attached to a user
    const postsRef = collection(db, "posts");
    const postQuery = query(postsRef, where("uid", "==", uid));
    return await getDocs(postQuery);
  };
  fetchPost = async (postKey) => {
    //get a single post
    const docRef = doc(db, "posts", postKey);
    const docSnap = await getDoc(docRef);
    return docSnap;
  };
  like = async (post, uid, postKey) => {
    let likes = [];

    const docRef = doc(db, "posts", postKey);
    const docSnap = await getDoc(docRef);
    if (docSnap.data().likes) {
      likes = [...docSnap.data().likes];
      if (likes.includes(uid)) {
        let rest = likes.filter((l) => l !== uid);
        likes = rest;
        console.log("unliked");
      } else {
        likes.push(uid);
        console.log("liked");
      }
    } else {
      likes.push(uid);
      console.log("liked");
    }
    return await setDoc(
      doc(db, `posts`, `${postKey}`),
      {
        likes: likes,
      },
      {
        merge: true,
      }
    );
  };
  likeComment = async (key, uid) => {
    let likes = [];

    const docRef = doc(db, "comments", key);
    const docSnap = await getDoc(docRef);
    if (docSnap.data().likes) {
      likes = [...docSnap.data().likes];
      if (likes.includes(uid)) {
        let rest = likes.filter((l) => l !== uid);
        likes = rest;
        console.log("unliked");
      } else {
        likes.push(uid);
        console.log("liked");
      }
    } else {
      likes.push(uid);
      console.log("liked");
    }
    return await setDoc(
      doc(db, `comments`, `${key}`),
      {
        likes: likes,
      },
      {
        merge: true,
      }
    );
  };
  report = async (post) => {
    return await addDoc(collection(db, "reports"), post);
  };

  getUsersPosts = (blockList) => {
    // console.log("blocked list ", blockList);
    if (blockList.length > 0) {
      return query(
        collection(db, "posts"),
        orderBy("uid"),
        where("uid", "not-in", blockList)
      );
    }
    return query(
      collection(db, "posts"),
      orderBy("uid")
      // where("uid", "not-in", blockList)
    );
  };
}
export default new Post();
