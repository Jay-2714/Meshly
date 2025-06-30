'use client';
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { FcLike } from "react-icons/fc";
import { LiaComments } from "react-icons/lia";
import { FcShare } from "react-icons/fc";
import { FaShoppingCart } from "react-icons/fa";

// Model preload moved to prevent SSG errors
interface Card {
    title: string;
    description?: string;
  }

export const ModelCard: React.FC<Card> = ({ title,description }) => {
  const { scene } = useGLTF("/models/jay.glb");



  return (
    <div className="flex flex-col md:w-64 md:h-96 w-full h-[500px] bg-blue-50 button rounded-lg p-2 shadow-sm shadow-blue-200 border-1">
      <Canvas shadows className="bg-white rounded-lg">
        <ambientLight intensity={1} />
        <pointLight position={[-10, 0, 10]} intensity={300} />
        {/* <meshStandardMaterial /> */}
        <primitive object={scene} />
        <OrbitControls enableZoom={true} />
      </Canvas>
      <div className="flex flex-col w-full">
        <div className="flex pt-1 text-xl justify-center text-gray-600 ">{title}</div>
        <div className=" text-gray-400 w-auto line-clamp-2">{description}</div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start gap-2">
          <button className="hover:scale-110 transition-transform">
        <FcLike  size={25}/>
        </button>
        <button className="hover:scale-110 transition-transform">
        <LiaComments size={25}/>
        </button>
        <button className="hover:scale-110 transition-transform">
        <FcShare size={25}/>
        </button>

          </div>
          <button className="_3d flex flex-row  items-center gap-2 px-4 py-2  rounded-full bg-blueColor text-white"><FaShoppingCart/>BUY</button>
        </div>
      </div>
    </div>
  );
};
