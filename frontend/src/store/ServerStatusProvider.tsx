import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export type ServerStatus = 'ONLINE' | 'CONNECTING' | 'OFFLINE';

interface ServerStatusContextType {
  status: ServerStatus;
}

const ServerStatusContext = createContext<ServerStatusContextType | undefined>(undefined);

export const ServerStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ServerStatus>('CONNECTING');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkServerHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        // the endpoint is /api/health
        const response = await axios.get(`${apiUrl.replace('/api', '')}/api/health`, { timeout: 5000 });
        
        if (response.data.status === 'online') {
          setStatus('ONLINE');
          // Heartbeat check every 60 seconds
          timeoutId = setTimeout(checkServerHealth, 60000);
        } else {
          setStatus('OFFLINE');
          timeoutId = setTimeout(checkServerHealth, 5000);
        }
      } catch (error) {
        setStatus('OFFLINE');
        timeoutId = setTimeout(checkServerHealth, 5000);
      }
    };

    checkServerHealth();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <ServerStatusContext.Provider value={{ status }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerHealth = () => {
  const context = useContext(ServerStatusContext);
  if (context === undefined) {
    throw new Error('useServerHealth must be used within a ServerStatusProvider');
  }
  return context;
};
