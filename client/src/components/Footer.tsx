import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-black text-light-beige py-10 mt-10 ">
      <div className="container mx-auto px-6 md:flex md:justify-between">
      
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Antiq</h2>
          <p className="text-gray-400">Antiq är skapat för amatörer som vill få en priskoll på sina antikviteter.</p>
        </div>

       
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Snabblänkar</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white">Hem</Link></li>
            
            
            
          </ul>
        </div>

        
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Kontakt</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Email: <a className="hover:text-white">Antiq@io.com</a></li>
            <li>Telefon: <a href="tel:+46123456789" className="hover:text-white">+46 123 456 789</a></li>
           
          </ul>
        </div>

        
        <div>
          <h3 className="text-xl font-bold mb-2">Följ oss</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.twitter.com"className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

     
      <div className="text-center text-gray-400 mt-6">
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
