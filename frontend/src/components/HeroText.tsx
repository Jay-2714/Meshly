"use client";
import React, { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { motion } from "motion/react";

export default function HeroContent() {
  const title = "MESHLY";
  const [show3d, setShow3d] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow3d(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div className="flex flex-col h-full items-center justify-center">
        <div className="flex items-center justify-center _3dtext text-shadow-xl font-extrabold text-blueColor/70 text-9xl _dosis">
          {title.split("").map((char, idx) => (
            <motion.span
              key={idx}
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.3,
                type: "spring",
                ease: "easeInOut",
                delay: 1 + 0.1 * idx,
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
            delay: 1,
          }}
          className="flex items-center justify-center font-normal text-blueColor text-4xl pt-4 _dosis"
        >
          Where Creators Mesh and Buyers Match!
        </motion.div>
        {/* <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 1,
            delay: 1,
          }}
          className="flex items-center justify-center align-middle text-blueColor text-3xl pt-4 _dosis"
        >
          A vibrant 3D models marketplace connecting talented artists with those
          seeking premium, ready-to-use designs.
        </motion.div> */}
        <PlaceholdersAndVanishInput
          InputClassName={
            show3d
              ? "_3d ease-initial transition-all duration-500"
              : "transition-all duration-500"
          }
          className="mt-4 bg-blue-50 transition-all duration-500"
          placeholders={[]}
          onChange={(e) => console.log(e.target.value)}
          onSubmit={() => {}}
        />
      </div>
    </>
  );
}
