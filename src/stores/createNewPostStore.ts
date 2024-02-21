import { makeAutoObservable, runInAction } from "mobx";
import { defaultUser } from "./generalCustomTypes";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";

import {
  StorageReference,
  UploadTask,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { initializeApp } from "firebase/app";
import { db, postsCol } from "@/app/firebase/FireBase-config";

type NewPostType = {
  author: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };

  description: string;
  media: string;
  mediaType: string;

  timestamp: {
    created: {
      time: number;
      date: string;
    };
    updated: {
      time: number;
      date: string;
    };
  };
  likes: [];
  comments: [];
};

export class newPost {
  isPostUploaded: boolean = false;
  isUploading: boolean = false;
  inputComment: string = "";
  emojiClicked: boolean = false;
  selectedMediaUrl: string = "";
  selectedMediaType: string = "";
  selectedMediaObj: File = {} as File;

  totalMediaProgress: number = 0;

  private mediaReference: StorageReference = {} as StorageReference;

  constructor() {
    makeAutoObservable(this);
  }

  resetAllStates = () => {
    this.selectedMediaUrl = "";
    this.selectedMediaType = "";
    this.selectedMediaObj = {} as File;
    this.inputComment = "";
    this.emojiClicked = false;
    this.isUploading = false;
    this.isPostUploaded = false;
  };

  back = () => {
    this.selectedMediaUrl = "";
  };

  private uploadTheMedia = async () => {
    if (this.selectedMediaUrl === null) return;
    const storage = getStorage();
    const mediaRef = ref(
      storage,
      `/images/${this.selectedMediaObj.name + uuidv4()}`
    );

    runInAction(() => {
      this.mediaReference = mediaRef;
    });

    console.log("this is file size : ", this.selectedMediaObj.size);

    const uploadMediaTask = uploadBytesResumable(
      mediaRef,
      this.selectedMediaObj
    );

    // this.uploadedMediaTask = uploadMedia;

    uploadMediaTask.on("state_changed", (snapshot) => {
      runInAction(() => {
        this.totalMediaProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      });
    });

    return uploadMediaTask;

    // .then((uploadResult) => {
    //   alert("media uploaded successfully");
    //   this.isUploading = false;
    // })
    // .catch((err) => {
    //   this.isUploading = false;
    //   alert("error occur while uploading media");
    //   console.log(err);
    // });
  };

  private addTheNewPost = async (
    userID: string,
    userName: string,
    userAvatar: string,
    userEmail: string,
    mediaDownloadUrl: string
  ) => {
    runInAction(() => {
      this.isPostUploaded = false;
    });
    const postDate = new Date();

    const newPost = {
      author: {
        id: userID,
        name: userName,
        avatar: userAvatar,
        email: userEmail,
      },

      description: this.inputComment,
      media: mediaDownloadUrl,
      mediaType: this.selectedMediaType,

      timestamp: {
        created: {
          time: postDate.getTime(),
          date: postDate.toLocaleDateString(),
        },
        updated: {
          time: postDate.getTime(),
          date: postDate.toLocaleDateString(),
        },
      },
      likes: [],
      comments: [],
    };

    // const firebaseConfig = {
    //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
    //   authDomain: "memo-19919.firebaseapp.com",
    //   projectId: "memo-19919",
    //   storageBucket: "memo-19919.appspot.com",
    //   messagingSenderId: "6628085493",
    //   appId: "1:6628085493:web:7a9669b9a6f5f308b03fbc",
    //   measurementId: "G-0J5TGQ0J70",
    // };

    // const app = initializeApp(firebaseConfig);

    // const db = getFirestore(app);

    // const postsCol = collection(db, "posts");

    // console.log("333333");

    await setDoc(doc(db, "posts", `${uuidv4()}`), newPost)
      .then((result) => {
        console.log("44444");
        console.log("44444 result :", result);

        runInAction(() => {
          this.isPostUploaded = true;
          this.isUploading = false;
        });
      })
      .catch((err) => {
        console.log("error from post after uploading image : ", err);
      });
  };

  uploadTheWholePost = async (
    userId: string,
    userEmail: string,
    userName: string,
    userAvatar: string
  ) => {
    runInAction(() => {
      this.isUploading = true;
    });
    await this.uploadTheMedia()
      .then((uploadedMedia) => {
        console.log(
          "this is uploaded media from uploading media : ",
          uploadedMedia
        );
        console.log(
          "this is uploaded media full path from uploading media : ",
          uploadedMedia?.ref.fullPath
        );

        if (uploadedMedia?.ref.fullPath) {
          console.log("11111");
          getDownloadURL(this.mediaReference)
            .then((url) => {
              console.log("22222");
              console.log("this is url of media : ", url);
              this.addTheNewPost(userId, userName, userAvatar, userEmail, url);
            })
            .catch((err) => {
              console.log("error from get download url function : ", err);
            });
        }
      })
      .catch((err) => {
        runInAction(() => {
          this.isUploading = false;
        });
        console.log("error from uploading image : ", err);
      });
  };

  uploadTheMediaAndThePost(
    userID: string,
    userName: string,
    userAvatar: string,
    userEmail: string
  ) {
    if (this.selectedMediaUrl === null) return;
    const storage = getStorage();
    const mediaRef = ref(
      storage,
      `/images/${this.selectedMediaObj.name + uuidv4()}`
    );

    const postDate = new Date();

    const uploadMediaTask = uploadBytesResumable(
      mediaRef,
      this.selectedMediaObj
    );

    runInAction(() => {
      this.isPostUploaded = false;
      this.isUploading = true;
    });
    // this.uploadedMediaTask = uploadMedia;

    uploadMediaTask.on("state_changed", (snapshot) => {
      runInAction(() => {
        this.totalMediaProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      });
    });

    uploadMediaTask

      .then((uploadedMedia) => {
        console.log(
          "this is uploaded media from uploading media : ",
          uploadedMedia
        );
        console.log(
          "this is uploaded media full path from uploading media : ",
          uploadedMedia?.ref.fullPath
        );

        if (uploadedMedia?.ref.fullPath) {
          console.log("11111");
          getDownloadURL(mediaRef)
            .then((url) => {
              console.log("22222");
              console.log("this is url of media : ", url);

              const newPost = {
                author: {
                  id: userID,
                  name: userName,
                  avatar: userAvatar,
                  email: userEmail,
                },

                description: this.inputComment,
                media: url,
                mediaType: this.selectedMediaType,

                timestamp: {
                  created: {
                    time: postDate.getTime(),
                    date: postDate.toLocaleDateString(),
                  },
                  updated: {
                    time: postDate.getTime(),
                    date: postDate.toLocaleDateString(),
                  },
                },
                likes: [],
                comments: [],
              };

              // this.addTheNewPost(userId, userName, userAvatar, userEmail, url);

              setDoc(doc(db, "posts", `${uuidv4()}`), newPost)
                .then((result) => {
                  console.log("44444");
                  console.log("44444 result :", result);

                  runInAction(() => {
                    this.isPostUploaded = true;
                    this.isUploading = false;
                  });
                })
                .catch((err) => {
                  console.log("error from post after uploading image : ", err);
                });
            })
            .catch((err) => {
              console.log("error from get download url function : ", err);
            });
        }
      })
      .catch((err) => {
        runInAction(() => {
          this.isUploading = false;
        });
        console.log("error from uploading image : ", err);
      });
  }

  // function created by gemini

  uploadMediaAndSavePost = async (
    mediaFile: File,
    newPostData: NewPostType
  ) => {
    const fileName = `posts/${new Date().getTime()}-${mediaFile.name}`;

    const storage = getStorage();
    // Create a reference to the media file in Cloud Storage
    const storageRef = ref(storage, fileName);

    try {
      // Check for valid media file
      if (!mediaFile) {
        throw new Error("Media file is required");
      }

      runInAction(() => {
        this.isPostUploaded = false;
        this.isUploading = true;
      });
      // Generate a unique file name (recommended for better organization)

      // Upload the media file to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, mediaFile);

      // Wait for the upload to complete and get the download URL
      // const downloadURL = await uploadTask.then((snapshot) =>
      //   getDownloadURL(snapshot.ref)
      // );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          runInAction(() => {
            this.totalMediaProgress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          });
        },
        (error) => {
          console.log("this is the error of uploading : ", error);
        },
        () => {
          // Complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            newPostData.media = downloadURL; // Assign the URL here
            newPostData.description = this.inputComment; // updating the description
            // newPostData.mediaType = this.selectedMediaType; // updating the mediatype

            // Proceed with saving the post data to Firestore
            const firestoreRef = collection(getFirestore(), "posts");
            const docRef = await addDoc(firestoreRef, newPostData);

            runInAction(() => {
              this.isPostUploaded = true;
              this.isUploading = false;
            });

            // Return the generated document ID

            return docRef.id;
          });
        }
      );
    } catch (error) {
      runInAction(() => {
        this.isPostUploaded = false;
        this.isUploading = false;
      });
      console.error("Error uploading media and saving post:", error);
      // Handle errors appropriately, e.g., display an error message to the user
      throw error; // Re-throw the error for potential error handling in the calling code
    }
  };

  // createFakePost = async () => {
  //   // fake media url
  //   //

  //   const postDate = new Date();

  //   const newPost = {
  //     author: {
  //       id: `fakeUser${uuidv4()}`,
  //       name: `fake user`,
  //       avatar:
  //         "https://firebasestorage.googleapis.com/v0/b/memo-19919.appspot.com/o/images%2Fsec3.pngc4ce451f-c1ec-4ce8-ad68-84a42b5282d6?alt=media&token=9666911d-dd67-4718-896e-6f0303ac1ecd",
  //       email: `fake email`,
  //     },

  //     description: "this is  a fake post ",
  //     media:
  //       "https://firebasestorage.googleapis.com/v0/b/memo-19919.appspot.com/o/images%2Fsec3.pngc4ce451f-c1ec-4ce8-ad68-84a42b5282d6?alt=media&token=9666911d-dd67-4718-896e-6f0303ac1ecd",
  //     mediaType: "image/png",

  //     timestamp: {
  //       created: {
  //         time: postDate.getTime(),
  //         date: postDate.toLocaleDateString(),
  //       },
  //       updated: {
  //         time: postDate.getTime(),
  //         date: postDate.toLocaleDateString(),
  //       },
  //     },
  //     likes: [],
  //     comments: [],
  //   };

  //   console.log("333333");

  //   alert("creating fake post now ");

  //   await setDoc(doc(db, "posts", `${uuidv4()}`), newPost)
  //     .then((result) => {
  //       console.log("44444");
  //       console.log("44444 result :", result);

  //       alert("fake post uploaded");
  //     })
  //     .catch((err) => {
  //       alert("fake post error occur see console");
  //       console.log("error from fake post : ", err);
  //     });
  // };

  // calculateUploadProgress = () => {
  //   const totalProgress = this.uploadedMediaTask
  // };

  setSelectedMediaUrl(val: string) {
    this.selectedMediaUrl = val;
  }

  setSelectedMediaType(val: string) {
    this.selectedMediaType = val;
  }

  setSelectedMediaobj(val: File) {
    this.selectedMediaObj = val;
  }

  setInputComment(val: string) {
    this.inputComment = val;
  }

  setEmojiClicked(val: boolean) {
    this.emojiClicked = val;
  }

  setIsUploading(val: boolean) {
    this.isUploading = val;
  }

  setIsPostUploaded(val: boolean) {
    this.isPostUploaded = val;
  }
}
