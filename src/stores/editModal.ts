import { makeAutoObservable } from "mobx";

export class editModalStore {
  open: boolean = false;

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
}
