import React, { type ReactNode } from 'react';
import { useServerHealth } from '../../store/ServerStatusProvider';

interface ServerConnectionBlockerProps {
  children: ReactNode;
}

const ServerConnectionBlocker: React.FC<ServerConnectionBlockerProps> = ({ children }) => {
  const { status } = useServerHealth();

  if (status === 'ONLINE') {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Blurred background content */}
      <div className="pointer-events-none opacity-50 blur-sm h-full">
        {children}
      </div>
      
      {/* Overlay overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-lg">
        <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Preparing services...</h3>
            <p className="text-sm text-gray-500 mt-1">Please wait while we connect to the WorkSphere backend.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerConnectionBlocker;
