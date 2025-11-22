import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ReadingPage from './pages/Reading';
import HistoryPage from './pages/History';
import ProfilePage from './pages/Profile';
import { UserState, Reading } from './types';

// --- Context Setup ---
interface AppContextType {
  user: UserState;
  addReading: (reading: Reading) => void;
  deductCredit: (amount: number) => boolean;
  updateDailyDraw: () => void;
  resetCredits: () => void; // For demo purposes
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  // Initial State from LocalStorage or Default
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('mara_user');
    return saved ? JSON.parse(saved) : {
      credits: 3, // Free starting credits
      readings: [],
      lastDailyDraw: null
    };
  });

  useEffect(() => {
    localStorage.setItem('mara_user', JSON.stringify(user));
  }, [user]);

  const addReading = (reading: Reading) => {
    setUser(prev => ({
      ...prev,
      readings: [reading, ...prev.readings]
    }));
  };

  const deductCredit = (amount: number): boolean => {
    if (user.credits >= amount) {
      setUser(prev => ({ ...prev, credits: prev.credits - amount }));
      return true;
    }
    return false;
  };

  const updateDailyDraw = () => {
    setUser(prev => ({ ...prev, lastDailyDraw: new Date().toISOString().split('T')[0] }));
  };

  const resetCredits = () => {
    setUser(prev => ({ ...prev, credits: 5 }));
  }

  return (
    <AppContext.Provider value={{ user, addReading, deductCredit, updateDailyDraw, resetCredits }}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/read" element={<ReadingPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
