import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthSignIn from "@/components/Auth/auth.signin";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import React from "react";

const SigninPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return <AuthSignIn />;
};

export default SigninPage;
