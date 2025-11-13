import { useEffect, useState } from "react";
import { LoginResponse } from "../shared/types";
import { GENERATE_TOKEN_URL } from "../shared/constants";
import { Button } from "@mui/material";

export default function Login() {
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogle);
        initializeGoogle();
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, []);

  function initializeGoogle() {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    setGoogleLoaded(true);
  }

  function handleGoogleLogin() {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  }

  async function handleCredentialResponse(response: LoginResponse) {
    const idToken = response.credential;

    const res = await fetch(GENERATE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    const data = await res.json();
    console.log(data);
    localStorage.setItem("authToken", data.token);
    window.location.reload();
  }

  return (
    <Button
      variant="outlined"
      id="google-login-btn"
      onClick={handleGoogleLogin}
      disabled={!googleLoaded}
    >
      sign in
    </Button>
  );
}