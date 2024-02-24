import { doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase/FireBase-config";
import { v4 as uuidv4 } from "uuid";
import { User, getAuth, updateProfile } from "firebase/auth";

export const deletePost = (postId: string, postMedia: any) => {
  const commentRef = doc(db, "posts", postId);

  deleteDoc(commentRef);

  return deletePostMedia(postMedia);
};

const deletePostMedia = (postMedia: any) => {
  const storage = getStorage();
  const mediaRef = ref(storage, `${postMedia}`);

  return deleteObject(mediaRef);
};

export const updatePost = (postDescription: any, postId: any) => {
  const postRef = doc(db, "posts", `${postId}`);

  return updateDoc(postRef, {
    description: postDescription,
  });
};

export const editUserProfile = (username: any, photoURL: any) => {
  const auth = getAuth();
  return updateProfile(auth.currentUser ?? ({} as User), {
    displayName: username,
    photoURL: photoURL,
  });
};

export const addUser = (
  userId: any,
  data: {
    displayName: any;
    uid: any;
    userName: any;
    bio: any;
    photoURL: any;
    link: any;
    followers: any;
    following: any;
  }
) => {
  const userRef = doc(db, "users", `${userId}`);
  const userData = { data };
  return setDoc(userRef, userData);
};

export const uploadAvatarImage = (imageObj: File) => {
  if (imageObj === null) return;
  const storage = getStorage();
  const imageRef = ref(storage, `/avatars/${imageObj.name + uuidv4()}`);

  return uploadBytes(imageRef, imageObj);
  // .then((uploadedImg) => {

  //   if (uploadedImg.ref._location.path_ !== null) {
  //     getDownloadURL(imageRef).then((url) => {
  //       addPost(user, url, inputComment);
  //     });
  //   }
  //   console.log("this is the uploaded img : ", uploadedImg);
  // })
  // .catch((error) => {
  //   setIsUploading(false);
  //   alert("Failed to upload media", error);
  // });
};

export const updateUserImage = (userId: any, imgUrl: string, data: any) => {
  const userRef = doc(db, "users", `${userId}`);
  const auth = getAuth();
  updateProfile(auth.currentUser ?? ({} as User), {
    photoURL: imgUrl,
  });
  return updateDoc(userRef, {
    data: {
      ...data,
      photoURL: imgUrl,
    },
  });
};
