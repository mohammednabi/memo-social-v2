import { makeAutoObservable, runInAction } from "mobx";

import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// import { db, postsCol } from "@/app/firebase/FireBase-config";
import { db, postsCol } from "../app/firebase/FireBase-config";

import { defaultUser, post } from "./generalCustomTypes";

import { v4 as uuidv4 } from "uuid";

export class currentUser {
  signedUser: defaultUser = {
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
    data: {
      bio: "",
      followers: [],
      following: [],
      link: "",
      username: "",
    },
  };
  userPosts: post[] = [];
  userPostsLength: number = 0;

  // user states that related to post

  inputComment: string = "";
  emojiClicked: boolean = false;
  commentLoading: boolean = false;
  alertMessage: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  saveCurrentUser(current: defaultUser) {
    getDoc(doc(db, "users", `${current.uid}`)).then((result) => {
      const newUser = { ...current, data: { ...result.data()?.data } };

      runInAction(() => {
        this.signedUser = newUser;
      });
    });
  }

  getUserPosts(uid: any) {
    const q = query(
      postsCol,
      where("author.id", "==", `${uid}`),
      orderBy("timestamp.created.time", "desc")
    );

    onSnapshot(q, (querySnapshot) => {
      let postList: post[] = [];
      querySnapshot.forEach((doc) => {
        postList.push({
          id: doc.id,
          author: {
            avatar: "",
            email: "",
            id: "",
            name: "",
          },
          comments: [],
          description: "",
          likes: [],
          media: "",
          mediaType: "",
          timestamp: {
            created: {
              date: "",
              time: 0,
            },
            updated: {
              date: "",
              time: 0,
            },
          },
          ...doc.data(),
        });
      });

      runInAction(() => {
        this.userPosts = postList;
        this.userPostsLength = postList.length;
      });
    });
  }

  addUserToUserCollection(
    userId: string,
    data: {
      data:
        | {
            bio: string;
            followers: string[];
            following: string[];
            link: string;
            username: string;
          }
        | {
            bio: string;
            followers: string[];
            following: string[];
            link: string;
            username: string;
          };
    }
  ) {
    const docRef = doc(db, "users", userId);

    return setDoc(docRef, {
      ...data,
    });
  }

  // personal user functions

  addComment = async (post: post) => {
    const commentRef = doc(db, "posts", post.id);

    const commentData = {
      id: uuidv4(),
      content: this.inputComment,
      author: {
        id: `${this.signedUser.uid}`,
        name: this.signedUser.displayName,
        avatar: this.signedUser.photoURL,
      },
    };

    return updateDoc(commentRef, {
      comments: [...post.comments, commentData],
    });
  };

  addLove() {}

  // all states setting functions

  set setInputComment(val: string) {
    this.inputComment = val;
  }

  set setAlertMessage(val: string) {
    this.alertMessage = val;
  }

  set setEmojiclicked(val: boolean) {
    this.emojiClicked = val;
  }

  set setCommentLoading(val: boolean) {
    this.commentLoading = val;
  }
}
