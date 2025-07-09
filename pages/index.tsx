import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import FormDialogLogin from "@/src/api/components/formDialogLogin";
import MenuLogo from "@/src/api/components/menuLogo";

const Home: React.FC = () => {
  const [loginText, setLoginText] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setLoginText("login");
    if (getCookie("access_token")) {
      setLoginText("book");
    }
  }, [getCookie("access_token")]);

  const handleClickOpen = async () => {
    if (getCookie("access_token")) {
      await router.push("/book");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="container">
      <div className="h-element">
        <MenuLogo />
        <div className="menu-login" onClick={handleClickOpen}>
          {loginText}
        </div>
      </div>
      <div className="body">
        <div className="wp-image-40" />
      </div>
      <FormDialogLogin open={open} handleClose={handleClose} />
    </div>
  );
};

export default Home;
