/* eslint-disable @next/next/no-img-element */
"use client ";

import React, { useContext, useEffect, useRef, useState } from "react";
import TimeOfPost from "./TimeOfPost";
import { post } from "../../../stores/generalCustomTypes";

import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import {
  BookmarkBorderOutlined,
  ChatBubbleOutlineOutlined,
  Favorite,
  FavoriteBorderOutlined,
  PlayArrow,
  SentimentSatisfiedOutlined,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { StoreContext } from "@/app/contexts/StoreContext";
import { showSnackbar } from "../postModalComponents/showSnackbar";

interface iprops {
  post: post;
  handleOpen: () => void;

  user: any;
}

const Post = ({
  post,
  handleOpen,

  user,
}: iprops) => {
  const { posts, currentUser } = useContext(StoreContext);

  const [videoPaused, setVideoPaused] = useState(true);
  const [videoAudioMuted, setVidepAudioMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const addComment = () => {
    currentUser.setCommentLoading = true;

    currentUser
      .addComment(post)
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

  const toggleVideoPause = () => {
    if (videoPaused) {
      videoRef.current?.pause();
    }

    if (!videoPaused) {
      videoRef.current?.play();
    }
    setVideoPaused(!videoPaused);
  };
  const toggleVideoAudio = () => {
    if (videoAudioMuted) {
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
    if (!videoAudioMuted) {
      if (videoRef.current) {
        videoRef.current.muted = false;
      }
    }
    setVidepAudioMuted(!videoAudioMuted);
  };

  useEffect(() => {
    setTimeout(() => {
      currentUser.setAlertMessage = "";
    }, 6000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.alertMessage]);

  return (
    <Stack
      spacing={2}
      sx={{
        fontFamily: "insta",
        width: "30rem",
      }}
    >
      {currentUser.alertMessage.length > 0 &&
        showSnackbar(true, currentUser.alertMessage)}
      <Stack direction={"row"} className="     items-center" spacing={1}>
        <Avatar src={post.author.avatar} />
        <h1 className="text-stone-950 dark:text-white font-semibold">
          {post.author.name}
        </h1>
        <Stack direction={"row"} spacing={0.5}>
          <h2 className="text-stone-950/50 dark:text-white/25 ">● </h2>
          {/* {calculateTime()} */}

          <TimeOfPost
            createdTime={post.timestamp.created.time}
            createdDate={post.timestamp.created.date}
          />
        </Stack>
      </Stack>
      <div className="w-112 aspect-square">
        {post.mediaType.slice(0, 5) === "image" && (
          <img
            className="w-full h-full object-cover rounded-md"
            alt=""
            src={post.media}
            loading="lazy"
          />
        )}
        {post.mediaType.slice(0, 5) === "video" && (
          <div className="cursor-pointer grid place-items-center w-full aspect-square relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              className="w-full h-full object-contain "
              onClick={() => {
                toggleVideoPause();
              }}
            >
              <source src={post.media} type="video/mp4" />
            </video>

            <IconButton
              className={`absolute  transition-all ${
                !videoPaused ? "opacity-100" : "opacity-0"
              }    z-10`}
              onClick={() => {
                toggleVideoPause();
              }}
            >
              <PlayArrow className="text-7xl text-white" />
            </IconButton>

            <IconButton
              className={`absolute bottom-0 right-0 transition-all   z-10 bg-stone-800`}
              onClick={toggleVideoAudio}
            >
              {!videoAudioMuted && (
                <VolumeOff className="text-3xl  text-white" />
              )}
              {videoAudioMuted && <VolumeUp className="text-3xl  text-white" />}
            </IconButton>
          </div>
        )}
      </div>
      <Stack
        direction={"row"}
        className="text-stone-950 dark:text-white justify-between items-center"
      >
        <Stack
          direction={"row"}
          spacing={1}
          className="justify-center items-center"
        >
          {!post?.likes.includes(`${user?.uid}`) ? (
            <IconButton
              onClick={() => {
                currentUser.toggleLove(post);
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
                currentUser.toggleLove(post);
              }}
            >
              <Favorite
                className="cursor-pointer transition-colors text-red-800 hover:text-red-800/50"
                sx={{ fontSize: "2rem" }}
              />
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              handleOpen();

              posts.setTargetPost = post;
            }}
          >
            <ChatBubbleOutlineOutlined
              className="cursor-pointer transition-colors text-stone-950  dark:text-white  hover:text-stone-950/50 dark:hover:text-white/50"
              sx={{ fontSize: "1.6rem" }}
            />
          </IconButton>
          {/* <IconButton>
            <SendOutlinedIcon
              className="cursor-pointer transition-colors text-white hover:text-white/50"
              sx={{ fontSize: "1.6rem" }}
            />
          </IconButton> */}
        </Stack>

        <IconButton>
          <BookmarkBorderOutlined
            className="cursor-pointer text-stone-950  dark:text-white transition-colors hover:text-stone-950/50 dark:hover:text-white/50"
            sx={{ fontSize: "2rem" }}
          />
        </IconButton>
      </Stack>
      <Stack spacing={1}>
        <h2 className="text-stone-950/95 dark:text-white/95">
          {post.likes.length} likes
        </h2>
        <h1 className="text-stone-950/95 dark:text-white/95 w-full">
          {post.description}
        </h1>
        {post.comments.length > 0 && (
          <Stack spacing={-1} className="w-full">
            <Stack direction={"row"} spacing={1} className="w-full">
              <Avatar
                src={post.comments[post.comments.length - 1].author.avatar}
                className="w-8 h-8"
              />
              <h1 className="text-stone-950 dark:text-white text-lg">
                {post.comments[post.comments.length - 1].author.name}
              </h1>
            </Stack>
            <p className="text-stone-950/60 dark:text-white/60 pl-10">
              {post.comments[post.comments.length - 1].content}
            </p>
          </Stack>
        )}
        <h2
          className="text-stone-950/60 dark:text-white/60 cursor-pointer"
          onClick={() => {
            handleOpen();
            // handleTargetPost(post);
            posts.setTargetPost = post;
          }}
        >
          View all {post.comments.length > 0 && post.comments.length} comments
        </h2>
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
                onClick={addComment}
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
                // setEmojiClicked(!emojiClicked);
                currentUser.setEmojiclicked = !currentUser.emojiClicked;
              }}
            >
              <SentimentSatisfiedOutlined className="text-stone-950 dark:text-white text-lg cursor-pointer" />
            </IconButton>
            {currentUser.emojiClicked && (
              <Box sx={{ position: "absolute", right: "50%" }}>
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
    </Stack>
  );
};

export default Post;
