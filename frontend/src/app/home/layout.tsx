import NavBar from "@/components/navbar";
import { Footer } from "@/components/Footer";
import React from 'react'

export default function HomeLayout({children}:{children: React.ReactNode})  {
    return(
     
        <div className="flex flex-col min-h-screen overflow-hidden">
        <NavBar />
        {children}
        <Footer />
        </div>
    );
}  
