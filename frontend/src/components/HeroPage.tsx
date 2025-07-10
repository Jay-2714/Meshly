"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const HeroModel = () => {
  const { scene } = useGLTF("/models/heroPage.glb");
  return <primitive object={scene} />;
};

export default function HeroPage() {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center">
      <Canvas
        camera={{ position: [-20, 20, 20], fov: 50 }}
        style={{ background: "#fff" }} // match website bg
      >
        {/* Normal lighting, not dynamic */}
        <ambientLight intensity={6} />
        <directionalLight position={[5, 10, 7.5]} intensity={0.6} />
        <HeroModel />
        <OrbitControls enableZoom={false}/>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/heroPage.glb");
