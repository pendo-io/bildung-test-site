import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { generateUserInfo, generateUserInfoByIndex, UserInfo } from '@/lib/userGenerator';
import { initializePendo, updatePendoVisitor } from '@/lib/pendo';

interface UserContextType {
  userInfo: UserInfo;
  refreshUser: () => void;
  setUserByIndex: (index: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<UserInfo>(() => generateUserInfo());
  const pendoInitialized = useRef(false);

  const refreshUser = useCallback(() => {
    setUserInfo(generateUserInfo());
  }, []);

  const setUserByIndex = useCallback((index: number) => {
    setUserInfo(generateUserInfoByIndex(index));
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

  // Initialize Pendo on first load
  useEffect(() => {
    if (!pendoInitialized.current) {
      initializePendo(userInfo);
      pendoInitialized.current = true;
    }
  }, []);

  // Update Pendo when user changes
  useEffect(() => {
    if (pendoInitialized.current) {
      updatePendoVisitor(userInfo);
    }
  }, [userInfo]);

  return (
    <UserContext.Provider value={{ userInfo, refreshUser, setUserByIndex }}>
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
