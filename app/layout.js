import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Electro",
  description: "E-Commerce with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html 
        lang="en" 
        data-locator-target="vscode" 
      >
        <body
          data-new-gr-c-s-check-loaded="14.1238.0"
          data-gr-ext-installed=""
          data-new-gr-c-s-loaded="14.1231.0"
          className={`${outfit.className} antialiased text-gray-700`}
        >
          <Toaster />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
