import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const SeasonContext = createContext();

export const SeasonProvider = ({ children }) => {
  const [seasons, setSeasons] = useState([]);
  const [activeSeason, setActiveSeason] = useState(null);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const res = await api.get('/season');
      setSeasons(res.data);
      const active = res.data.find(s => s.isActive);
      if (active) setActiveSeason(active);
    } catch (error) {
      console.error('Failed to fetch seasons', error);
    }
  };

  const changeSeason = async (seasonId) => {
    try {
      await api.put(`/season/${seasonId}/activate`);
      fetchSeasons(); // Refresh the list
    } catch (error) {
      console.error('Failed to change season', error);
    }
  };

  return (
    <SeasonContext.Provider value={{ seasons, activeSeason, changeSeason }}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => useContext(SeasonContext);
