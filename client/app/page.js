"use client";
import { Button } from "@/components/ui/button";
import Typewriter from "typewriter-effect";
import Navbar from "@/components/shared/Navbar";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <div className="flex justify-center items-center w-full h-screen flex-col gap-4">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-8xl">
          Dialogue<span className="text-primary text-9xl">.</span>
        </h1>
        <div className="flex font-mono text-gray-500 text-center">
          With Dialogue&nbsp;
          <span>
            <Typewriter
              options={{
                strings: [
                  "Connect Instantly",
                  "Chat Anywhere, Anytime",
                  "Stay Connected, Collaborate",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </div>

        <div className="flex gap-4">
          <RegisterLink>
            <Button>Start Messaging</Button>
          </RegisterLink>
          <LoginLink>
            <Button variant="outline" className="border-pr">
              Log In
            </Button>
          </LoginLink>
        </div>
      </div>
    </>
  );
}
