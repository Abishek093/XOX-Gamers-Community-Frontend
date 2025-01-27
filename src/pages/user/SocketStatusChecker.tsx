import React, { useState, useEffect } from 'react';
import { useSockets } from '../../../src/context/socketContext'; 

const SocketStatusChecker: React.FC = () => {
  const { userSocket, streamSocket, connectSockets } = useSockets();
  const [userSocketStatus, setUserSocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [streamSocketStatus, setStreamSocketStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    if (!userSocket || !streamSocket) {
      connectSockets();
    }

    const checkUserSocketStatus = () => {
      if (userSocket?.connected) {
        setUserSocketStatus('connected');
      } else {
        setUserSocketStatus('disconnected');
      }
    };

    const checkStreamSocketStatus = () => {
      if (streamSocket?.connected) {
        setStreamSocketStatus('connected');
      } else {
        setStreamSocketStatus('disconnected');
      }
    };

    // Initial check
    checkUserSocketStatus();
    checkStreamSocketStatus();

    // Set up event listeners
    userSocket?.on('connect', checkUserSocketStatus);
    userSocket?.on('disconnect', checkUserSocketStatus);

    streamSocket?.on('connect', checkStreamSocketStatus);
    streamSocket?.on('disconnect', checkStreamSocketStatus);

    // Periodic status checks
    const statusCheckInterval = setInterval(() => {
      checkUserSocketStatus();
      checkStreamSocketStatus();
    }, 5000); // Check every 5 seconds

    // Test socket communication
    const testSocketCommunication = () => {
      // User socket test
      userSocket?.emit('create_chat', { 
        type: 'connectivity_test', 
        timestamp: new Date().toISOString() 
      });

      // Streaming socket test
      streamSocket?.emit('send_comment', { 
        type: 'connectivity_test', 
        timestamp: new Date().toISOString() 
      });
    };

    // Perform initial communication test
    testSocketCommunication();

    // Perform communication test periodically
    const communicationTestInterval = setInterval(testSocketCommunication, 30000); // Test every 30 seconds

    // Cleanup
    return () => {
      clearInterval(statusCheckInterval);
      clearInterval(communicationTestInterval);

      userSocket?.off('connect', checkUserSocketStatus);
      userSocket?.off('disconnect', checkUserSocketStatus);

      streamSocket?.off('connect', checkStreamSocketStatus);
      streamSocket?.off('disconnect', checkStreamSocketStatus);
    };
  }, [userSocket, streamSocket, connectSockets]);

  const getStatusColor = (status: 'connecting' | 'connected' | 'disconnected') => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-red-500';
      case 'connecting': return 'text-yellow-500';
    }
  };

  const reconnectSockets = () => {
    connectSockets();
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Socket Connection Status</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">User Socket</h3>
          <p className={`font-medium ${getStatusColor(userSocketStatus)}`}>
            Status: {userSocketStatus.charAt(0).toUpperCase() + userSocketStatus.slice(1)}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold">Streaming Socket</h3>
          <p className={`font-medium ${getStatusColor(streamSocketStatus)}`}>
            Status: {streamSocketStatus.charAt(0).toUpperCase() + streamSocketStatus.slice(1)}
          </p>
        </div>

        <button 
          onClick={reconnectSockets}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reconnect Sockets
        </button>
      </div>
    </div>
  );
};

export default SocketStatusChecker;