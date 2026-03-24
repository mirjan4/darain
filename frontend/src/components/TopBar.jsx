import React from "react";
import { Phone, Mail, Clock } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const TopBar = () => {
  const { phone, email, business_hours } = useSettings();

  return (
    <div className="bg-[#2F468C] text-white text-[11px] tracking-[0.2em] font-semibold border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">

        {/* Email */}
        {email && (
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-white/70" />
            <span className="hidden sm:inline">
              <a href={`mailto:${email}`} className="hover:opacity-80 transition">
                {email}
              </a>
            </span>
          </div>
        )}

        {/* Business Hours */}
        {business_hours && (
          <div className="hidden md:flex items-center gap-2">
            <Clock size={14} className="text-white/70" />
            <span>{business_hours}</span>
          </div>
        )}

        {/* Phone */}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Phone size={14} className="text-white/70" />
            <span>Call / WhatsApp: {phone}</span>
          </a>
        )}

      </div>
    </div>
  );
};

export default TopBar;