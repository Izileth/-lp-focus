import { motion } from "framer-motion";
import { IconWhatsapp } from "./Icons";

export function WhatsAppBadge() {
  const whatsappUrl = "https://chat.whatsapp.com/D5araq1cWrS18jcaon0fnX";

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-3 py-3 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors duration-300 group"
    >
      <IconWhatsapp size={24}/>
      <span className="font-semibold text-sm max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
        Comunidade WhatsApp
      </span>
    </motion.a>
  );
}
