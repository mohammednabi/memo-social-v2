/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import {
  BookmarkBorderOutlined,
  ChatBubbleOutlineOutlined,
  Favorite,
  FavoriteBorderOutlined,
  MoreHoriz,
  SendOutlined,
  SentimentSatisfiedOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  Modal,
  Paper,
  Stack,
  IconButton,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  LinearProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Image from "next/image";
import React, { use, useContext, useEffect, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import PostSettingsModal from "./postModalComponents/PostSettingsModal";
import AuthorDescription from "./postModalComponents/AuthorDescription";
import UserComment from "./postModalComponents/UserComment";
import SuccessfulDeletePost from "./postModalComponents/SuccessfulDeletePost";
import { StoreContext } from "../contexts/StoreContext";
import { defaultUser } from "../../stores/generalCustomTypes";
import { Player } from "video-react";
// import "node_modules/video-react/dist/video-react.css"; // import css
import "video-react/dist/video-react.css"; // import css
import { showSnackbar } from "./postModalComponents/showSnackbar";

interface iProps {
  open: any;
  close: any;
  user: defaultUser;
}

export default function PostModal({ open, close, user }: iProps) {
  const { posts, currentUser, deleteModal } = useContext(StoreContext);

  const addComment = () => {
    currentUser.setCommentLoading = true;

    currentUser
      .addComment(posts.targetPost)
      .then(() => {
        currentUser.setCommentLoading = false;
        currentUser.setAlertMessage = "success";
        currentUser.setInputComment = "";
      })
      .catch((err) => {
        console.log(err);
        currentUser.setCommentLoading = false;
        currentUser.setAlertMessage = "failed";
      });
  };

  useEffect(() => {
    setTimeout(() => {
      currentUser.setAlertMessage = "";
    }, 6000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.alertMessage]);

  const closePostModal = () => {
    close();
    deleteModal.setConfirmDelete = false;
    deleteModal.setLoadingDelete = false;
  };

  return (
    <>
      <Modal
        open={open}
        onClose={closePostModal}
        className="
      grid place-items-center border-none outline-none
    "
      >
        <Paper
          className={`bg-stone-950 font-insta flex flex-col items-center text-white rounded-md  h-auto border-none outline-none  min-w-[30rem] w-auto`}
        >
          {currentUser.alertMessage.length > 0 &&
            showSnackbar(true, currentUser.alertMessage)}
          {posts.targetPost &&
            !deleteModal.confirmDelete &&
            !deleteModal.loadingDelete && (
              <Stack direction={"row"} className="h-[40rem] w-full">
                {posts.targetPost.mediaType?.slice(0, 5) === "image" ? (
                  <img
                    src={open && posts.targetPost.media}
                    alt=""
                    loading="lazy"
                    className="h-full w-auto object-contain aspect-instaPost skeleton"
                  />
                ) : (
                  // <video
                  //   controls
                  //   className="h-full w-auto object-contain aspect-instaPost "
                  // >
                  //   <source
                  //     src={open && posts.targetPost.media}
                  //     type="video/mp4"
                  //   />
                  //   </video>

                  <div className="h-full w-auto object-contain aspect-instaPost grid place-items-center">
                    <Player autoPlay>
                      <source
                        src={open && posts.targetPost.media}
                        type="video/mp4"
                      />
                    </Player>
                  </div>
                )}
                <div
                  className="grid w-[30rem] h-[40rem] aspect-instaPost p-5 text-white   "
                  style={{
                    gridTemplateRows: "auto 1fr auto auto",
                    gridTemplateColumns: "auto",
                  }}
                >
                  <AuthorDescription
                    name={posts.targetPost.author.name}
                    avatar={posts.targetPost.author.avatar}
                    content={posts.targetPost.description}
                  />

                  <Stack spacing={1} className="py-5 h-auto overflow-auto">
                    <Stack className="pl-3  h-auto">
                      {open && posts.targetPost.comments.length > 0 ? (
                        posts.targetPost.comments.map((comment) => (
                          <Stack spacing={1} key={comment.id}>
                            <UserComment
                              name={comment.author.name}
                              avatar={comment.author.avatar}
                              content={comment.content}
                            />
                            <Divider className="w-full  bg-stone-900" />
                          </Stack>
                        ))
                      ) : (
                        <h1 className="pt-5 capitalize text-lg text-white/10">
                          no comments on this post
                        </h1>
                      )}
                    </Stack>
                  </Stack>
                  <Stack spacing={2}>
                    <Divider className="w-full  bg-stone-900" />

                    <Stack
                      direction={"row"}
                      className="text-stone-950 dark:text-white justify-between items-center"
                    >
                      <Stack
                        direction={"row"}
                        spacing={1}
                        className="justify-center items-center"
                      >
                        {!posts.targetPost.likes.includes(`${user.uid}`) ? (
                          <IconButton
                            onClick={() => {
                              currentUser.toggleLove(posts.targetPost);
                            }}
                          >
                            <FavoriteBorderOutlined
                              className="cursor-pointer transition-colors text-red-800 hover:text-red-800/50"
                              sx={{ fontSize: "2rem" }}
                            />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => {
                              currentUser.toggleLove(posts.targetPost);
                            }}
                          >
                            <Favorite
                              className="cursor-pointer transition-colors text-red-800 hover:text-red-800/50"
                              sx={{ fontSize: "2rem" }}
                            />
                          </IconButton>
                        )}
                        <IconButton>
                          <ChatBubbleOutlineOutlined
                            className="cursor-pointer transition-colors text-white hover:text-white/50"
                            sx={{ fontSize: "1.6rem" }}
                          />
                        </IconButton>
                      </Stack>

                      <IconButton>
                        <BookmarkBorderOutlined
                          className="text-white cursor-pointer transition-colors hover:text-white/50"
                          sx={{ fontSize: "2rem" }}
                        />
                      </IconButton>
                    </Stack>
                    <Divider className="w-full  bg-stone-900" />
                  </Stack>
                  <Stack>
                    <Grid2 container>
                      <Grid2 xs={currentUser.inputComment.length > 0 ? 10 : 11}>
                        <input
                          value={currentUser.inputComment}
                          placeholder="Add a comment..."
                          className="w-full h-10 p-3 pl-0 text-stone-950/90 dark:text-white/90 bg-transparent border-none outline-none resize-none"
                          onChange={(e) => {
                            // setInputComment(e.target.value);
                            currentUser.setInputComment = e.target.value;
                          }}
                        />
                      </Grid2>
                      <Grid2
                        xs={currentUser.inputComment.length > 0 ? 2 : 1}
                        container
                        sx={{ display: "flex", gap: "" }}
                      >
                        {currentUser.inputComment.length > 0 && (
                          <button
                            className="text-blue-600 capitalize "
                            onClick={() => {
                              currentUser.setCommentLoading = true;

                              addComment();
                            }}
                          >
                            post
                          </button>
                        )}
                        {currentUser.inputComment.length > 0 &&
                          currentUser.commentLoading && (
                            <Backdrop open={true} className="text-white">
                              <CircularProgress color="inherit" size={100} />
                            </Backdrop>
                          )}
                        <IconButton
                          onClick={() => {
                            currentUser.setEmojiclicked =
                              !currentUser.emojiClicked;
                          }}
                        >
                          <SentimentSatisfiedOutlined className="text-stone-950 dark:text-white text-lg cursor-pointer" />
                        </IconButton>
                        {currentUser.emojiClicked && (
                          <Box
                            sx={{
                              position: "absolute",
                              right: 0,
                              bottom: "20%",
                            }}
                          >
                            <Picker
                              data={data}
                              onEmojiSelect={(e: { native: string }) => {
                                currentUser.setInputComment =
                                  currentUser.inputComment + e.native;
                                currentUser.setEmojiclicked = false;
                              }}
                            />
                          </Box>
                        )}
                      </Grid2>
                    </Grid2>
                  </Stack>
                </div>
              </Stack>
            )}
          {deleteModal.loadingDelete && !deleteModal.confirmDelete && (
            <Stack spacing={2} className="bg-stone-950 h-[20rem] w-full">
              <h1
                className="text-2xl text-center pt-5 capitalize font-insta"
                style={{
                  background:
                    " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                deleting your post{" "}
              </h1>
              <div className="bg-black/75 w-full h-full  ">
                <LinearProgress
                  color="secondary"
                  className=""
                  sx={{
                    background:
                      " linear-gradient(45deg, rgba(0,244,151,1) 0%, rgba(0,243,244,1) 57%, rgba(212,0,244,1) 100%)",
                  }}
                />
              </div>
              <img
                src="https://cdn.dribbble.com/users/224485/screenshots/2125581/deleting.gif"
                className="w-auto h-full"
              />
            </Stack>
          )}
          {!deleteModal.loadingDelete && deleteModal.confirmDelete && (
            <SuccessfulDeletePost />
          )}
        </Paper>
      </Modal>
    </>
  );
}
