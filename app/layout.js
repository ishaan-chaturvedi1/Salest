import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar"
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Salest - Sales Manager",
  description: "Salest is one of the best sales management tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <Navbar />
          {children}
        </SessionWrapper>
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
        <script src="https://cdn.lordicon.com/lordicon.js"></script>
      </body>
    </html>
  );
}
