import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    dashboard: 'Dashboard',
    koytas: 'Koytas',
    musters: 'Musters',
    advances: 'Advances',
    khade: 'Khade',
    settlement: 'Settlement',
    ledger: 'Ledger',
    total_koytas: 'Total Koytas',
    active_musters: 'Active Musters',
    total_advances: 'Total Advances',
    total_balance: 'Total Balance',
    today_entry: 'Today\'s Entry',
    search: 'Search...',
    new_koyta: 'New Koyta',
    koyta_no: 'Koyta No.',
    husband_name: 'Husband Name',
    wife_name: 'Wife Name',
    mobile: 'Mobile',
    village: 'Village',
    actions: 'Actions',
    new_muster: 'New Muster',
    start_date: 'Start Date',
    end_date: 'End Date',
    status: 'Status',
    new_advance: 'New Advance',
    amount: 'Amount (₹)',
    remark: 'Remark',
    log_khade: 'Log Khade',
    select_muster: 'Select Muster',
    select_koyta: 'Select Koyta',
    khade_count: 'Khade Count (Days)',
    save: 'Save',
    cancel: 'Cancel',
    calculate: 'Calculate Settlement',
    base_share: 'Base Share',
    khade_fine: 'Khade Fine (-)',
    advance_deduction: 'Advance (-)',
    bonus: 'Bonus (+)',
    final_balance: 'Final Balance',
    date: 'Date',
    description: 'Description',
    credit: 'Credit (+)',
    debit: 'Debit (-)',
    balance: 'Balance'
  },
  mr: {
    dashboard: 'डॅशबोर्ड',
    koytas: 'कोयता व्यवस्थापन',
    musters: 'मस्टर व्यवस्थापन',
    advances: 'उचल नोंद',
    khade: 'खाडे नोंद',
    settlement: 'अंतिम हिशोब',
    ledger: 'खातेवही (Ledger)',
    total_koytas: 'एकूण कोयते',
    active_musters: 'चालू मस्टर',
    total_advances: 'एकूण उचल',
    total_balance: 'एकूण बाकी',
    today_entry: 'आजची नोंद',
    search: 'शोधा...',
    new_koyta: 'नवीन कोयता',
    koyta_no: 'कोयता नं.',
    husband_name: 'नवऱ्याचे नाव',
    wife_name: 'बायकोचे नाव',
    mobile: 'मोबाईल',
    village: 'गाव',
    actions: 'कृती',
    new_muster: 'नवीन मस्टर',
    start_date: 'सुरुवात तारीख',
    end_date: 'शेवट तारीख',
    status: 'स्थिती',
    new_advance: 'नवीन उचल',
    amount: 'रक्कम (₹)',
    remark: 'कारण',
    log_khade: 'खाडे नोंदवा',
    select_muster: 'मस्टर निवडा',
    select_koyta: 'कोयता निवडा',
    khade_count: 'खाडे (दिवस)',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    calculate: 'हिशोब करा',
    base_share: 'धंदा (Base Share)',
    khade_fine: 'खाडा दंड (-)',
    advance_deduction: 'उचल (-)',
    bonus: 'बोनस (+)',
    final_balance: 'अंतिम बाकी',
    date: 'तारीख',
    description: 'तपशील',
    credit: 'जमा (+)',
    debit: 'नावे (-)',
    balance: 'बाकी'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('mr'); // Default to Marathi

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'mr' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
