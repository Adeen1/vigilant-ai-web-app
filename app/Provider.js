"use client";
import { AuthProvider } from "./contexts/AuthContext";
import { SessionProvider } from "next-auth/react";

function Provider(props) {
  return (
    <SessionProvider session={props.session}>
      <AuthProvider>{props.children}</AuthProvider>
    </SessionProvider>
  );
}

export default Provider;
