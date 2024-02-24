"use client";
import { StoreContext } from "@/app/contexts/StoreContext";
import { deletePost } from "@/app/functions/updateDocument";
import { post } from "@/stores/generalCustomTypes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";

interface deleteModalProps {
  post: post;
}

const DeleteModal = ({ post }: deleteModalProps) => {
  const { deleteModal, settingsModal } = useContext(StoreContext);

  const deleteWholePost = () => {
    deleteModal.setLoadingDelete = true;
    deletePost(post.id, post.media)
      .then(() => {
        deleteModal.setLoadingDelete = false;
        deleteModal.setConfirmDelete = true;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    deleteModal.handleClose();

    settingsModal.handleClose();
  };

  return (
    <Dialog
      open={deleteModal.open}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: "rgb(12 10 9)",
          color: "white",
        },
      }}
      // className="bg-stone-950"
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText className="text-white/75">
          Do you want to delete this post , this means that you will not be able
          to retrieve this post again ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            deleteModal.handleClose();
            settingsModal.handleClose();

            deleteWholePost();
          }}
        >
          Delete
        </Button>
        <Button onClick={deleteModal.handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(DeleteModal);
