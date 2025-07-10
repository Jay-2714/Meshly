import HeroPage from "@/components/HeroPage";
import HeroContent from "@/components/HeroText";
import { AnimatePresence } from "motion/react";
import React from "react";



function Home() {
  return(<AnimatePresence mode="wait">
    <div className="flex flex-row w-full h-full justify-around">
      <div className="flex flex-col justify-center items-center  h-3/5 w-1/2">
            <HeroContent />
      
      </div>
      <div className="flex h-full w-1/2">
      <HeroPage />
      </div>
      <div className="flex h-1/3"></div>

    </div>
    </AnimatePresence>);

}

export default Home;
