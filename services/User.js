import { database, db } from "../config/firebase";
import {
  doc,
  getDoc,
  query,
  getDocs,
  collection,
  where,
  updateDoc,
  setDoc,
  getFirestore,
  arrayUnion,
  arrayRemove,
  addDoc,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  child,
  set,
  get,
  query as qry,
  push,
  onValue,
  remove,
  update,
  equalTo,
  orderByChild,
  off,
} from "firebase/database";
import Notification from "./Notification";
import PushNotification from "./PushNotification";

class User {
  getUser = async (uid) => {
    const userRef = doc(db, "userInfo", uid);
    const docSnap = await getDoc(userRef);
    return docSnap.data();
  };

  getUsers = async (uid) => {
    const q = query(collection(db, "userInfo"), where("userId", "!=", uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot;
  };
  getAllUsers = async (uid) => {
    const q = collection(db, "userInfo");
    const querySnapshot = await getDocs(q);

    return querySnapshot;
  };

  friendRequest = async (friendId, loginUser, type) => {
    try {
      const docRef = doc(db, "userInfo", friendId);

      const data = {
        type: "FRIEND_REQUEST",
        isRead: false,
        timestamp: Date.now(),
        sender: loginUser.userId,
        receiver: friendId,
      };

      data.senderData = {
        email: loginUser.email,
        name: loginUser.name,
        avatar: loginUser.avatar,
      };

      if (type === "request") {
        await updateDoc(docRef, {
          friendRequests: arrayUnion(loginUser.userId),
        });
        PushNotification.retrieveFcmSubscription(friendId)
          .then((snap) => {
            if (snap.val()) {
              PushNotification.sendPushNotificationFcm(
                snap.val().fcmToken,
                "Friend Request",
                `New friend request from ${loginUser.username}`,
                loginUser.avatar
              );
              console.log("snap key ", snap.val().pushToken);
            }
          })
          .catch((err) => {
            console.log(err);
          });

        await Notification.addNotification(data, friendId, "FRIEND_REQUEST");
      } else if (type === "undo") {
        await updateDoc(docRef, {
          friendRequests: arrayRemove(loginUser.userId),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  acceptFriendReqst = async (uid, friendId) => {
    await updateDoc(doc(db, "userInfo", friendId), {
      friends: arrayUnion(uid),
    });
    const docRef = doc(db, "userInfo", uid);

    await updateDoc(docRef, {
      friendRequests: arrayRemove(friendId),
    });

    return await updateDoc(doc(db, "userInfo", uid), {
      friends: arrayUnion(friendId),
    });
  };

  rejectRequest = async (uid, friendId) => {
    const docRef = doc(db, "userInfo", uid);
    updateDoc(docRef, {
      friendRequests: arrayRemove(friendId),
    });
  };

  removeFriend = async (uid, friendId) => {
    const userDocRef = doc(db, "userInfo", uid);
    const friendDocRef = doc(db, "userInfo", friendId);

    await updateDoc(userDocRef, {
      friends: arrayRemove(friendId),
    });

    await updateDoc(friendDocRef, {
      friends: arrayRemove(uid),
    });
  };

  updateFavSongs = async (uid, actionType, data) => {
    const docRef = doc(db, "userInfo", uid);
    return updateDoc(docRef, {
      favSong: data,
    });
  };

  updateFavArts = async (uid, actionType, data) => {
    const docRef = doc(db, "userInfo", uid);
    return updateDoc(docRef, {
      favArtists: data,
    });
  };

  updateProfile = async (profileData, uid) => {
    const uRef = doc(db, "userInfo", uid);
    return setDoc(uRef, profileData, { merge: true });
  };

  updateHobbies = async (data, uid, action) => {
    const docRef = doc(db, "userInfo", uid);
    if (action === "add") {
      return updateDoc(docRef, {
        hobbies: arrayUnion(data),
      });
    } else {
      return updateDoc(docRef, {
        hobbies: arrayRemove(data),
      });
    }
  };

  updateInterests = async (data, uid, action) => {
    const docRef = doc(db, "userInfo", uid);
    if (action === "add") {
      return updateDoc(docRef, {
        interests: arrayUnion(data),
      });
    } else {
      return updateDoc(docRef, {
        interests: arrayRemove(data),
      });
    }
  };
  updateSkills = async (data, uid) => {
    const docRef = doc(db, "userInfo", uid);
    return updateDoc(docRef, {
      skills: data,
    });
  };

  setOnlineStatus = async (uid) => {
    const usersRef = ref(database, `onlineUsers/${uid}`);
    set(usersRef, "online");
  };

  setOfflineStatus = async (uid) => {
    const usersRef = ref(database, `onlineUsers/${uid}`);
    return set(usersRef, null);
  };
  t;
  searchFriend = async (queryTerm) => {
    const usersRef = collection(db, "userInfo");
    const qury = query(
      usersRef,
      // orderBy("username"),
      orderBy("name"),
      startAt(queryTerm),
      endAt(queryTerm + "\uf8ff")
    );

    return await getDocs(qury);
  };
}
export default new User();
