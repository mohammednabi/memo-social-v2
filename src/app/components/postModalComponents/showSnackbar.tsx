"use client ";
import { Alert, Snackbar } from "@mui/material";

export const showSnackbar = (
  openState: boolean | undefined,
  alertMessage: string
) => {
  console.log("this is snakbar alert message ", alertMessage);
  return (
    <Snackbar open={openState} autoHideDuration={6000}>
      {alertMessage === "success" ? (
        <Alert
          severity="success"
          sx={{ width: "100%", background: "#68c468", color: "white" }}
        >
          Comment Added
        </Alert>
      ) : (
        <Alert
          severity="error"
          sx={{ width: "100%", background: "#ba3439", color: "white" }}
        >
          failed to add Comment
        </Alert>
      )}
    </Snackbar>
  );
};
