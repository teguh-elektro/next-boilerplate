'use client';
import ProfileImage from '@/lib/avatar';
import { generateBackgroundColor } from '@/lib/util';
import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import PayPalModal from './PaypalModal';

const Navbar = () => {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPaypalModalOpen, setIsPaypalModalOpen] = useState(false);
  const [avatarURL, setAvatarURL] = useState('');
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const fileMenuRef = useRef<HTMLDivElement | null>(null);
  const helpMenuRef = useRef<HTMLDivElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (session) {
      const { backgroundColor, textColor } = generateBackgroundColor(session.user.email as string);
      const avatar = new ProfileImage(session.user.name || 'User', {
        textColor,
        backgroundColor,
        fontFamily: 'Verdana',
        fontWeight: 'bold'
      });
      setAvatarURL(avatar.png());
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (fileMenuRef.current && !fileMenuRef.current.contains(target) && !target.closest('.file-button')) {
      setIsFileMenuOpen(false);
    }
    if (helpMenuRef.current && !helpMenuRef.current.contains(target) && !target.closest('.help-button')) {
      setIsHelpMenuOpen(false);
    }
    if (accountMenuRef.current && !accountMenuRef.current.contains(target) && !target.closest('.account-button')) {
      setIsAccountMenuOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleaAccountMenuToggle = () => {
    setIsAccountMenuOpen(prev => !prev);
    // update({...session})
  };

  const handleFileMenuToggle = () => {
    setIsFileMenuOpen(prev => !prev);
    if (isHelpMenuOpen) {
      setIsHelpMenuOpen(false); // Tutup menu bantuan jika menu file dibuka
    }
  };

  const handleHelpMenuToggle = () => {
    setIsHelpMenuOpen(prev => !prev);
    if (isFileMenuOpen) {
      setIsFileMenuOpen(false); // Tutup menu file jika menu bantuan dibuka
    }
  };

  const handlePayment = () => {
    setIsAccountMenuOpen(false);
    setIsPaypalModalOpen(true); // Open the PayPal modal
  };

  return (
    <>
      <nav className="fixed top-0 right-0 w-full flex justify-between items-center bg-gray-800 p-4 h-14">
        <div className="flex items-center space-x-4">
          <button className="text-white md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {/* Hamburger icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div className="hidden md:flex space-x-4">
            {/* File Menu */}
            <div className="relative" ref={fileMenuRef}>
              <button onClick={handleFileMenuToggle} className={`text-white file-button transition duration-200 ease-in-out ${isFileMenuOpen ? 'underline underline-offset-4' : ''} hover:underline`}>
                File
              </button>
              {isFileMenuOpen && (
                <div className="absolute left-0 top-8 py-2 w-[120px] bg-white rounded-md shadow-lg">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">New</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Open</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Save</li>
                  </ul>
                </div>
              )}
            </div>
            {/* Help Menu */}
            <div className="relative" ref={helpMenuRef}>
              <button onClick={handleHelpMenuToggle} className={`text-white file-button transition duration-200 ease-in-out ${isHelpMenuOpen ? 'underline underline-offset-4' : ''} hover:underline`}>
                Help
              </button>
              {isHelpMenuOpen && (
                <div className="absolute left-0 top-8 py-2 w-[120px] bg-white rounded-md shadow-lg">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Home</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Guide</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Feedback</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`relative ${status !== 'unauthenticated' && 'h-8'}`} ref={accountMenuRef}>
            <button onClick={handleaAccountMenuToggle} className="text-white account-button">
              {status === 'loading' ? (
                <svg className="animate-spin -ml-1 w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                session ? (
                  <img src={avatarURL} alt="Avatar" className="w-8 h-8 rounded-full" />
                ) : (
                  <button onClick={() => router.push('/login')} className="text-white file-button transition duration-200 ease-in-out hover:underline">
                    Login
                  </button>
                )
              )}
            </button>
            {isAccountMenuOpen && session && (
              <div className="absolute right-0 top-8 mt-2 w-[220px] bg-white rounded-md shadow-lg">
                <p className="ml-4 mt-4 mb-1 font-semibold">{session.user.name}</p>
                <p className="ml-4 mb-4 text-sm">{session.user.email}</p>
                <ul className='border-t p-4'>
                  <li className="p-2 text-[red] hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer" onClick={handleLogout}>
                    Log out
                  </li>
                </ul>
                {
                  session.user.subscribe !== 'premium' ?
                    <div className='border-t text-center'>
                      <button className="m-4 p-2 w-[180px] text-white bg-gray-800 hover:bg-gray-100 hover:text-gray-800 transition duration-200 ease-in-out rounded-md cursor-pointer" onClick={handlePayment}>
                        Upgrade
                      </button>
                    </div>
                    :
                    null
                }
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="absolute top-16 left-0 w-full bg-gray-800 text-white md:hidden">
            <div className="flex flex-col">
              <div className="relative">
                <button onClick={handleFileMenuToggle} className="p-4 file-button">
                  File
                </button>
                {isFileMenuOpen && (
                  <div className="bg-white rounded-md shadow-lg">
                    <ul>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">New</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">Open</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">Save</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={handleHelpMenuToggle} className="p-4 help-button">
                  Help
                </button>
                {isHelpMenuOpen && (
                  <div className="bg-white rounded-md shadow-lg">
                    <ul>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">Home</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">Guide</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer">Feedback</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* PayPal Modal */}
      {isPaypalModalOpen && <PayPalModal onClose={() => setIsPaypalModalOpen(false)} email={session?.user.email as string} isOpen={isPaypalModalOpen} />}
    </>
  );
};

export default Navbar;
