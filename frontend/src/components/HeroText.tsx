"use client";
import React from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export default function HeroText() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center _3dtext text-shadow-xl font-extrabold text-blueColor/70 text-9xl _dosis">
          MESHLY
        </div>
        <div className="flex items-center justify-center font-normal text-blueColor text-4xl pt-4 _dosis">
          Where Creators Mesh and Buyers Match!
        </div>
        {/* <div className="flex items-center justify-center align-middle font-thin text-blueColor text-3xl pt-4 _dosis">
          A vibrant 3D models marketplace connecting talented artists with those
          seeking premium, ready-to-use designs.
        </div> */}
              <PlaceholdersAndVanishInput
              className="_3d mt-4 text-blueColor"
              placeholders={[]}
              onChange={(e) => console.log(e.target.value)}
              onSubmit={() => {}}
            />
      </div>
    </>
  );
}
