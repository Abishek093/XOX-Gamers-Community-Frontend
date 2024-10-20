import React from 'react';

const NewsArchive: React.FC = () => {
  return (
    <div className="flex-[3_1_0%] h-80 drop-shadow-sm">
      <h2 className="text-3xl text-gray-900 mb-4">News Archive</h2>
      <div className="bg-white text-gray-900 p-4 rounded-lg h-full flex items-center">
        <div className='w-60 h-30 bg-black'>
          <img src="assets/banner/news.jpg" alt="" className='w-60 h-72' />
        </div>                
        <div className='w-48 h-full p-8'>
          <h3 className="text-xl font-bold">Game of Thrones</h3>
          <p>Warring factions have brought the Origin System to the brink of destruction.</p>
        </div>
      </div>
    </div>
  );
};

export default NewsArchive;
