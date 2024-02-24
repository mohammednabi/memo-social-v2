import { makeAutoObservable, runInAction } from "mobx";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  getDoc,
  doc,
  addDoc,
} from "firebase/firestore";

// import { db } from "../firebase/FireBase-config";
// import { db } from "@/app/firebase/FireBase-config";
// import { postsCol } from "@/app/firebase/FireBase-config";
import { db, postsCol, postsCol2 } from "../app/firebase/FireBase-config";

import { defaultUser, post } from "./generalCustomTypes";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export class postsStore {
  allPosts: post[] = [];

  userPosts: post[] = [];

  userPostsLength: number = 0;

  targetPost: post = {
    id: "",
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
  };

  isPostUploaded: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // getAllPosts() {
  //   const q = query(postsCol, orderBy("timestamp.created.time", "desc"));

  //   // cancel this snapshot because it make some issues
  //   onSnapshot(q, (querySnapshot) => {
  //     let postList: post[] = [];
  //     querySnapshot.forEach((doc) => {
  //       postList.push({
  //         id: doc.id,
  //         author: {
  //           avatar: "",
  //           email: "",
  //           id: "",
  //           name: "",
  //         },
  //         comments: [],
  //         description: "",
  //         likes: [],
  //         media: "",
  //         mediaType: "",
  //         timestamp: {
  //           created: {
  //             date: "",
  //             time: 0,
  //           },
  //           updated: {
  //             date: "",
  //             time: 0,
  //           },
  //         },
  //         ...doc.data(),
  //       });
  //     });

  //     // this.allPosts = postList;
  //     this.setAllPosts = postList;
  //   });
  // }

  getAllPosts2 = async () => {
    const q = query(postsCol, orderBy("timestamp.created.time", "desc"));

    const querySnapshot = await getDocs(q);
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

    this.setAllPosts = postList;
  };

  // getting all user posts

  getUserPosts = async (uid: string) => {
    const q = query(
      postsCol,
      where("author.id", "==", `${uid}`),
      orderBy("timestamp.created.time", "desc")
    );

    const querySnapshot = await getDocs(q);
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
  };

  // get target post

  getTargetPost(targetPostId: string) {
    const docRef = doc(db, "posts", targetPostId);

    getDoc(docRef)
      .then((docSnapshot) => {
        this.targetPost = {
          id: docSnapshot.id,
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
          ...docSnapshot.data(),
        };
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // save post list values with an action function

  set setAllPosts(val: post[]) {
    this.allPosts = val;
  }

  //

  set setTargetPost(val: post) {
    this.targetPost = val;
  }

  // add post

  addPost = (
    user: defaultUser,
    media: string,
    mediaType: string,
    caption: string
  ) => {};

  // private methods

  // private uploadImage = (image) => {};
}
