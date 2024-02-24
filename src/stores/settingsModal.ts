import { makeAutoObservable } from "mobx";

export class settingsModalStore {
  open: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  handleOpen() {
    this.open = true;
  }
  handleClose() {
    this.setOpen = false;
  }

  set setOpen(val: boolean) {
    this.open = val;
  }
}
