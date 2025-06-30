'use client'
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FloatingDock } from './ui/floating-dock';
import { FaXTwitter } from 'react-icons/fa6';

interface Link {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const links: Link[] = [
  {title: 'Facebook',
  icon: (<FaFacebook size={100} className="hover:text-blue-900" />),
  href: 'https://www.facebook.com',
  },
  {title: 'Twitter',
    icon: (<FaXTwitter size={100} className="hover:text-blue-900" />),
    href: 'https://www.twitter.com',
  },
  {title: 'Instagram',
    icon: (<FaInstagram size={100} className="hover:text-blue-900" />),
    href: 'https://www.instagram.com',
  },
  {title: 'Linkedin',
    icon: (<FaLinkedin  size={100} className="hover:text-blue-900" />),
    href: 'https://www.linkedin.com',
  }
]




export function Footer() {
  return (
    <footer className="flex flex-row absolute bottom-0 w-full bg-blueColor  text-white py-6 ">
      <div className="container mx-auto px-4 flex flex-row justify-evenly items-center">
        <div className="flex w-1/3 mb-4 md:mb-0">
          <ul className="flex flex-col px-4">
            <li>
              <Link href="/" className="hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-gray-400">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex  w-1/3 space-x-4 text-xl">

          <FloatingDock items={links} mobileClassName="invisible" desktopClassName='flex flex-row bg-blueColor text-blueColor' />
        </div>
        <div className="flex w-1/3 mt-4 md:mt-0 justify-end">
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} 3dverse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
