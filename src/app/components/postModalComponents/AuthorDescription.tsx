"use client";
import { MoreHoriz } from "@mui/icons-material";
import { Avatar, Divider, IconButton, Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import PostSettingsModal from "./PostSettingsModal";
import { StoreContext } from "@/app/contexts/StoreContext";

interface authorProps {
  name: string;
  avatar: string;
  content: string;
}

const AuthorDescription = ({ name, avatar, content }: authorProps) => {
  const { posts, currentUser, editModal, settingsModal } =
    useContext(StoreContext);

  return (
    <Stack spacing={1}>
      <Stack direction={"row"} className="items-center justify-between">
        <Stack direction={"row"} spacing={2} className="items-center">
          <Stack spacing={0.5}>
            <Stack direction={"row"} spacing={2} className="items-center">
              <Avatar src={avatar} className="w-10 h-10" />
              <h1>{name}</h1>

              <h2 className="text-white/50 text-xs">(author)</h2>
            </Stack>
            <h3 className="pl-14 text-sm  text-white w-full">{content}</h3>
          </Stack>
        </Stack>

        {currentUser.signedUser.uid === posts.targetPost.author.id && (
          <IconButton
            onClick={() => {
              settingsModal.handleOpen();
            }}
          >
            <MoreHoriz className="text-white" />
          </IconButton>
        )}

        <PostSettingsModal post={posts.targetPost} />
      </Stack>

      <Divider className="w-full  bg-stone-900" />
    </Stack>
  );
};

export default observer(AuthorDescription);
