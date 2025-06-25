// pages/_app.tsx
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/Layout"; // ✅ Make sure path is correct

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster position="top-right" />
    </ClerkProvider>
  );
}
