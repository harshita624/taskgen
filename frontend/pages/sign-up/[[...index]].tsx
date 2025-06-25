"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const storeTokenAndRedirect = async () => {
      try {
        if (isSignedIn) {
          const token = await getToken();
          if (token) {
            localStorage.setItem("clerk-token", token);
            console.log("Token stored after sign-up");
            router.push("/dashboard"); // Redirect after sign-up
          }
        }
      } catch (err) {
        console.error("Error storing token after sign-up:", err);
      }
    };

    storeTokenAndRedirect();
  }, [isSignedIn, getToken, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <SignUp routing="path" path="/signup" signInUrl="/sign-in" />
    </div>
  );
}
