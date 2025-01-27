import React from 'react';
import StreamingList from '../../components/User/Streaming/StreamingList';
import { useNavigate } from 'react-router-dom';

const Streaming: React.FC = () => {
    const navigate = useNavigate()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Live Streams</h1>
        <button 
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
          onClick={() => {navigate('/go-live')}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Go Live
        </button>
      </div>
      <StreamingList />
    </div>
  );
};

export default Streaming;


