import { makeAutoObservable } from "mobx";

export class deleteModalStore {
  open: boolean = false;
  loadingDelete: boolean = false;
  confirmDelete: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  handleOpen() {
    this.open = true;
  }
  handleClose() {
    this.open = false;
  }

  set setOpen(val: boolean) {
    this.open = val;
  }
  set setLoadingDelete(val: boolean) {
    this.loadingDelete = val;
  }
  set setConfirmDelete(val: boolean) {
    this.confirmDelete = val;
  }
}
