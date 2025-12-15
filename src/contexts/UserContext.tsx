import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateUserInfo, UserInfo } from '@/lib/userGenerator';

interface UserContextType {
  userInfo: UserInfo;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>(() => generateUserInfo());

  const refreshUser = useCallback(() => {
    setUserInfo(generateUserInfo());
  }, []);

  // Auto-refresh every 30 seconds to simulate different visitors
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshUser]);

  // Store in window for global access (like the original script)
  useEffect(() => {
    (window as any).userInfo = userInfo;
  }, [userInfo]);

  return (
    <UserContext.Provider value={{ userInfo, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
