import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { AxiosError } from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useRouter } from "next/router";
import { loginApi } from "../../api-client";

interface IFormDialogLogin {
  open: boolean;
  handleClose: () => void;
}

const FormDialogLogin: React.FC<IFormDialogLogin> = ({ open, handleClose }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginStatus, setLoginStatus] = useState<string>("");
  const [clickLoginStatus, setClickLoginStatus] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (getCookie("access_token")) {
      setLoginStatus("");
      setClickLoginStatus(false);
    }
  }, [getCookie("access_token")]);

  const login = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLoginStatus("");
      setClickLoginStatus(true);
      await loginApi({ username, password });
      if (getCookie("access_token")) await router.push("/book");
    } catch (err: unknown | AxiosError) {
      setClickLoginStatus(false);
      setLoginStatus("Network is error cannot to connect api!!");
      if (err instanceof AxiosError) {
        if (err?.response) {
          setLoginStatus(err.response.data?.message);
        }
      }
    }
  };

  const closeDialog = () => {
    handleClose();
    setLoginStatus("");
  };

  return (
    <Dialog className="dialog-login" open={open} onClose={handleClose}>
      <DialogTitle className="title-login">Login</DialogTitle>
      <DialogContent className="dialog-content">
        <DialogContentText className="login-status">
          {loginStatus}
        </DialogContentText>

        {!loginStatus && clickLoginStatus ? (
          <Box sx={{ display: "flex", backgroundColor: "transparent" }}>
            <CircularProgress
              sx={{ textAlign: "center", margin: "auto", marginTop: "15px" }}
            />
          </Box>
        ) : (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="Username"
              fullWidth
              variant="standard"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      {!loginStatus && clickLoginStatus ? null : (
        <DialogActions className="dialog-action">
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={login}>Login</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FormDialogLogin;
