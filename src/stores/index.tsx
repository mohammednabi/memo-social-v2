// const { postsStore } = require("./posts");

import { currentUser } from "./currentUser";
import { postsStore } from "./posts";
import { newPost } from "./createNewPostStore";
import { editModalStore } from "./editModal";
import { deleteModalStore } from "./deleteModal";
import { settingsModalStore } from "./settingsModal";

const postsInstance = new postsStore();

const userInstance = new currentUser();

const singleNewPostInstance = new newPost();
const settingsModal = new settingsModalStore();
const editModal = new editModalStore();
const deleteModal = new deleteModalStore();

export const store = {
  posts: postsInstance,
  currentUser: userInstance,
  newPost: singleNewPostInstance,
  settingsModal: settingsModal,
  editModal: editModal,
  deleteModal: deleteModal,
};
