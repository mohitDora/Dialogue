"use client"
import Navbar from "@/components/shared/Navbar";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <>
    {/* <Navbar></Navbar> */}
     <div className="px-4 md:max-w-screen-md m-auto md:px-0">
      
      {children}
    </div>
    </>
  );
}
