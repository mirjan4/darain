import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, UPLOADS_BASE_URL } from '../utils/api';

// Default fallback values (used if API is unreachable)
const DEFAULT_SETTINGS = {
    logo: null,
    favicon: null,
    phone: '+91 62381 86495',
    whatsapp: '916238186495',
    email: 'fd786darain@gmail.com',
    address: 'Kottakkal, Malappuram, Kerala, India',
    business_hours: '9:00 AM – 9:00 PM',
    map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31317.06059905973!2d75.98774052069675!3d10.998495632007823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b161f5cce121%3A0x6bba4da34947dc16!2sKottakkal%2C%20Kerala!5e0!3m2!1sen!2sin!4v1710505809786!5m2!1sen!2sin',
    theme: 'default',
};

const SettingsContext = createContext(DEFAULT_SETTINGS);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const loadSettings = async () => {
        try {
            const res = await getSettings();
            const data = res.data.data || {};
            const updatedSettings = { ...DEFAULT_SETTINGS, ...data };
            setSettings(updatedSettings);

            if (updatedSettings.favicon) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }
                link.href = `${UPLOADS_BASE_URL}/${updatedSettings.favicon}`;
            }
        } catch (e) {
            console.error("Settings load failed", e);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ ...settings, refreshSettings: loadSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

// Hook for easy consumption
export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
