import React from 'react';

const RecommendedEvents: React.FC = () => {
  return (
    <div className="flex-[7_1_0%] h-80">
      <h2 className="text-3xl text-gray-900 mb-4">Recommended Events</h2>
      <div className="bg-red-600 text-white p-4 flex justify-between items-center rounded-lg border-8 border-white drop-shadow-sm h-full" style={{ backgroundImage: 'url(https://pro-theme.com/html/teamhost/assets/img/t2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      </div>
    </div>
  );
};

export default RecommendedEvents;
