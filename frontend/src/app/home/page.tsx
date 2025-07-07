import HeroText from "@/components/HeroText";
import { AnimatePresence } from "motion/react";
import React from "react";



function Home() {
  return(<AnimatePresence mode="wait">
    <div className="flex flex-row w-full h-full justify-between">
      <div className="flex justify-center items-center  w-1/2 ">
            <HeroText />
      </div>
      <div className="flex w-1/2"></div>

    </div>
    </AnimatePresence>);

}

export default Home;
