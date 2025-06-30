import { AnimatePresence } from "motion/react";
import React from "react";



function Home() {
  return(<AnimatePresence mode="wait">
    <div className="flex w-full h-full"></div>
    </AnimatePresence>);

}

export default Home;
