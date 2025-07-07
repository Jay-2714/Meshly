'use client'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FloatingDock } from './ui/floating-dock';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'motion/react';

interface SocialLink {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const socialLinks: SocialLink[] = [
  {
    title: 'Facebook',
    icon: (<FaFacebook size={100} className="hover:text-blue-900" />),
    href: 'https://www.facebook.com',
  },
  {
    title: 'Twitter',
    icon: (<FaXTwitter size={100} className="hover:text-blue-900" />),
    href: 'https://www.twitter.com',
  },
  {
    title: 'Instagram',
    icon: (<FaInstagram size={100} className="hover:text-blue-900" />),
    href: 'https://www.instagram.com',
  },
  {
    title: 'Linkedin',
    icon: (<FaLinkedin size={100} className="hover:text-blue-900" />),
    href: 'https://www.linkedin.com',
  }
];

// const navLinks = [
//   { title: 'Home', href: '/' },
//   { title: 'About', href: '/about' },
//   { title: 'Services', href: '/services' },
//   { title: 'Contact', href: '/contact' },
// ];

export function Footer() {
  return (
    <motion.footer 
      initial={{
        scaleX: 0,
        opacity: 0,
        transformOrigin: "right center",
      }}
      animate={{
        scaleX: 1,
        opacity: 1,
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "tween",
      }}
      className="flex flex-row absolute bottom-0 w-full bg-blueColor text-white py-6 align-center justify-center"
    >
      <div className="container mx-auto px-4 flex flex-row justify-evenly items-center">
        {/* <div className="flex w-1/3 mb-4 md:mb-0">
          <ul className="flex flex-col px-4">
            {navLinks.map(link => (
              <motion.li
              initial={{

                  scale: 0,
                  
                  opacity: 0,
                }}
                animate={{
                
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                  type:"spring",
                  ease: "easeInOut",
                  delay:1 +
                  navLinks.findIndex((el) => el.title === link.title) *
                  0.07,

                }}
                 key={link.title}>
                <Link href={link.href} className="hover:text-gray-400">
                  {link.title}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div> */}
        <div className="flex w-1/3 space-x-4 text-xl justify-center">
          <FloatingDock 
        
           items={socialLinks} mobileClassName="invisible" desktopClassName='flex flex-row bg-blueColor text-blueColor' />
           
        </div>
 
      </div>
    </motion.footer>
  );
}

export default Footer;
