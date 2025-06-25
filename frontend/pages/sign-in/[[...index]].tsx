// app/sign-in/[[...index]].tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const storeToken = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken();
          if (token) {
            localStorage.setItem("clerk-token", token);
            console.log("Token stored successfully.");
            router.push("/dashboard"); // redirect after sign-in
          }
        }
      } catch (error) {
        console.error("Error storing token:", error);
      }
    };

    storeToken();
  }, [getToken, isSignedIn, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;
