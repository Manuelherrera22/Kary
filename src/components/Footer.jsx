import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, FileText, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

const ilyrAILogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/41c6e2cc-d964-4a03-87ae-a9b8c21bef72/ddbce9be23e4812e2006a55abdb9b506.jpg";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { nameKey: 'footer.social.facebook', url: 'https://www.facebook.com/karyeduca', icon: <Facebook size={20} className="text-gray-400 group-hover:text-pink-400 transition-colors"/> },
    { nameKey: 'footer.social.instagram', url: 'https://www.instagram.com/karyeduca', icon: <Instagram size={20} className="text-gray-400 group-hover:text-pink-400 transition-colors"/> },
    { nameKey: 'footer.social.linkedin', url: 'https://www.linkedin.com/company/ilyr-ai', icon: <Linkedin size={20} className="text-gray-400 group-hover:text-pink-400 transition-colors"/> },
  ];

  const footerNav = [
    { nameKey: 'footer.privacyPolicy', url: '#', icon: <ShieldCheck size={16} className="mr-2 opacity-80 group-hover:opacity-100 transition-opacity" /> },
    { nameKey: 'footer.termsOfService', url: '#', icon: <FileText size={16} className="mr-2 opacity-80 group-hover:opacity-100 transition-opacity" /> },
    { nameKey: 'footer.contactUs', url: '#contacto', icon: <Mail size={16} className="mr-2 opacity-80 group-hover:opacity-100 transition-opacity" /> },
  ];

  const contactInfo = [
    { nameKey: 'footer.address', textKey: 'footer.addressText', icon: <MapPin size={18} className="text-pink-400 mr-3 flex-shrink-0" /> },
    { nameKey: 'footer.phone', textKey: 'footer.phoneNumber', icon: <Phone size={18} className="text-pink-400 mr-3 flex-shrink-0" /> },
    { nameKey: 'footer.email', textKey: 'footer.supportEmail', icon: <Mail size={18} className="text-pink-400 mr-3 flex-shrink-0" />, isEmail: true },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-br from-slate-900 via-black to-slate-800 text-gray-300 py-16 sm:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          <div className="md:col-span-2 lg:col-span-1">
            <motion.img
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              src={ilyrAILogoUrl}
              alt={t('footer.ilyrAILogoAlt', 'ILYR AI Logo')}
              className="h-12 sm:h-14 w-auto mb-4"
            />
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-gray-400 leading-relaxed"
            >
              {t('footer.ilyrAIDescription')}
            </motion.p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-5">{t('footer.quickLinks', 'Quick Links')}</h3>
            <ul className="space-y-3">
              {footerNav.map((item, index) => (
                <motion.li 
                  key={item.nameKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <a href={item.url} className="text-sm text-gray-400 hover:text-pink-400 transition-colors duration-300 flex items-center group">
                    {item.icon}
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{t(item.nameKey)}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-5">{t('footer.contactInfo', 'Contact Info')}</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <motion.li 
                  key={item.nameKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start text-sm"
                >
                  {item.icon}
                  {item.isEmail ? (
                    <a href={`mailto:${t(item.textKey)}`} className="text-gray-400 hover:text-pink-400 transition-colors duration-300">
                      {t(item.textKey)}
                    </a>
                  ) : (
                    <span className="text-gray-400">{t(item.textKey)}</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-5">{t('footer.connectWithUs', 'Connect With Us')}</h3>
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((link, index) => (
                <motion.a 
                  key={link.nameKey} 
                  href={link.url} 
                  aria-label={t(link.nameKey)} 
                  className="text-gray-400 hover:text-pink-400 transition-colors duration-300 group"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <span className="sr-only">{t(link.nameKey)}</span>
                  <div className="w-10 h-10 border-2 border-gray-700 rounded-full flex items-center justify-center group-hover:border-pink-400 group-hover:bg-pink-500/10 transition-all duration-300">
                    {React.cloneElement(link.icon, { className: "text-gray-400 group-hover:text-pink-400 transition-colors"})}
                  </div>
                </motion.a>
              ))}
            </div>
            <p className="text-xs text-gray-500 italic">
              {t('footer.socialMediaPrompt', 'Follow us on social media for the latest updates!')}
            </p>
          </div>

        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border-t border-gray-700/50 pt-8 mt-12 text-center"
        >
          <p className="text-sm text-gray-400">
            &copy; {currentYear} {t('footer.ilyrAIFullText', 'ILYR AI Holding S.A.S.')} {t('footer.rightsReserved', 'All rights reserved.')}
          </p>
           <p className="text-xs text-gray-500 mt-2">
            {t('footer.tagline', 'Innovation that inspires tomorrow.')}
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;