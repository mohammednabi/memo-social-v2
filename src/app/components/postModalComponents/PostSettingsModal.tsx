"use client";
// import { deletePost } from "@/app/functions/updateDocument";

import { Divider, Modal, Paper, Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import EditModal from "./EditModal";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/app/contexts/StoreContext";
import DeleteModal from "./DeleteModal";

interface postSettingProps {
  post: any;
}

const PostSettingsModal = ({ post }: postSettingProps) => {
  const { editModal, deleteModal, settingsModal } = useContext(StoreContext);

  const handleClose = () => {
    settingsModal.handleClose();
  };

  return (
    <>
      <Modal
        open={settingsModal.open}
        onClose={handleClose}
        className="
      grid place-items-center border-none outline-none
    "
      >
        <Paper
          className={`bg-stone-950 font-insta  text-2xl   text-white rounded-md   h-auto border-none outline-none  py-5  w-auto`}
        >
          <Stack spacing={2} className="items-center justify-center ">
            <button
              className="text-white/75 capitalize px-20"
              onClick={() => {
                editModal.handleOpen();
              }}
            >
              edit
            </button>
            <Divider className="w-full  bg-stone-900" />
            <button
              className="text-red-600 capitalize px-20"
              onClick={() => {
                deleteModal.handleOpen();
              }}
            >
              delete
            </button>
          </Stack>

          {/* confirm delete dialog  */}

          {deleteModal.open && <DeleteModal post={post} />}

          {/* === confirm delete dialog === */}
        </Paper>
      </Modal>
      {editModal.open && <EditModal post={post} />}
    </>
  );
};

export default observer(PostSettingsModal);
