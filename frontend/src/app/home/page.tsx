import HeroText from "@/components/HeroText";
import { AnimatePresence } from "motion/react";
import React from "react";



function Home() {
  return(<AnimatePresence mode="wait">
    <div className="flex flex-row w-full h-full justify-evenly">
      <div className="flex flex-col justify-center items-center  h-1/3 w-1/2">
            <HeroText />
      
      </div>
      <div className="flex h-1/3">
      </div>
      <div className="flex h-1/3"></div>

    </div>
    </AnimatePresence>);

}

export default Home;
