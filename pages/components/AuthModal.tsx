"use client";

import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const { error, loading, data } = useContext(AuthenticationContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signIn, signUp } = useAuth();

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (isSignIn) {
      if (inputs.password && inputs.email) {
        return setDisabled((disabled) => (disabled = false));
      }
    } else {
      if (Object.values(inputs).every((value) => value)) {
        return setDisabled((disabled) => (disabled = false));
      }
    }
    setDisabled((disabled) => (disabled = true));
  }, [inputs]);

  const renderContent = (signInContent: string, signUpContent: string) =>
    isSignIn ? signInContent : signUpContent;

  const { email, password } = inputs;

  const handleClick = () => {
    if (isSignIn) {
      signIn({ email, password }, handleClose);
    } else {
      signUp(inputs, handleClose);
    }
  };

  return (
    <div>
      <button
        className={`${renderContent(
          "bg-blue-400 text-white",
          ""
        )} border p-1 px-4 rounded mr-3`}
        onClick={() => handleOpen()}
      >
        {renderContent("Sign In", "Sign Up")}
      </button>
      <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="p-2 h-[500px]">
              {error && (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              )}
              <div className=" uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm">
                  {renderContent("Sign In", "Create account")}
                </p>
                <p>{data?.firstName}</p>
              </div>
              <div className="m-auto ">
                <AuthModalInputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignIn={isSignIn}
                />
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={() => handleClick()}
                >
                  {" "}
                  {renderContent("Sign In", "Create  Account")}
                </button>
                <p>
                  {data?.firstName} {data?.lastName}
                </p>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
