import React, { useEffect, useState } from 'react';
import { useServerHealth } from '../../store/ServerStatusProvider';

const ServerStatusIndicator: React.FC = () => {
  const { status } = useServerHealth();
  const [isVisible, setIsVisible] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false); // To handle initial delay

  useEffect(() => {
    // Show indicator immediately if connecting or offline, wait 3 seconds to hide when connected
    if (status === 'ONLINE') {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
      setShowIndicator(true);
    }
  }, [status]);

  if (!isVisible && !showIndicator) return null;

  const getStatusDetails = () => {
    switch (status) {
      case 'ONLINE':
        return {
          color: 'bg-green-500',
          title: 'WorkSphere Online',
          subtitle: 'HR services are ready',
          dotColor: 'bg-green-400'
        };
      case 'CONNECTING':
        return {
          color: 'bg-yellow-500',
          title: 'Initializing WorkSphere Services',
          subtitle: 'Preparing employee management workspace...',
          dotColor: 'bg-yellow-400'
        };
      case 'OFFLINE':
      default:
        return {
          color: 'bg-red-500',
          title: 'Connection Issue',
          subtitle: 'Reconnecting services automatically',
          dotColor: 'bg-red-400'
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transition-all duration-500 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-4 border border-white/20 flex items-center gap-4 w-80">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-50/50">
          <div className={`w-3 h-3 rounded-full ${details.dotColor} ${status === 'CONNECTING' ? 'animate-ping absolute' : ''}`}></div>
          <div className={`w-3 h-3 rounded-full ${details.color} relative z-10`}></div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">{details.title}</span>
          <span className="text-xs text-gray-500 truncate max-w-[200px]">{details.subtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default ServerStatusIndicator;
