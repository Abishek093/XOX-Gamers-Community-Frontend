import React from 'react';

interface CommunityTitleCardProps {
  image?: string;
  name?: string;
  description?: string;
  postCount?: number;
  followersCount?: number;  
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

const CommunityTitleCard: React.FC<CommunityTitleCardProps> = ({ image, name, description, postCount, followersCount, isFollowing, onFollowToggle }) => {
  const titleImageUrl = 'https://img.freepik.com/free-vector/alien-night-planet-landscape-space-game-background_107791-12914.jpg?t=st=1723388140~exp=1723391740~hmac=c10426085c8d06667f2ac76cb6e6fe643f5a47d9a07668738b68d8e1871ac7a5&w=1380';

  return (
    <div
      className="relative flex flex-col w-full h-72 justify-center items-center p-4 bg-cover bg-center rounded-xl shadow-lg"
      style={{
        backgroundImage: `url(${titleImageUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-95  rounded-xl"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-[100px] h-[100px] rounded-full bg-white relative overflow-hidden shadow-lg border-4 border-white">
          <img
            src={image}
            className="object-cover w-full h-full"
            alt="Community"
          />
        </div>
        <h1 className="text-white text-3xl font-bold">
          {name || "Community Name"}
        </h1>
        <p className="text-white text-center text-base  px-4">
          {description || "This is a brief description of the community."}
        </p>
        <div className="flex space-x-6 text-white mb-2">
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">{postCount || 0}</span>
            <span className="text-sm">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-semibold">{followersCount || 0}</span>
            <span className="text-sm">Followers</span>
          </div>
        </div>
        <button
          onClick={onFollowToggle}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
            isFollowing ? 'bg-red-500 text-white' : 'bg-white text-red-500'
          }`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    </div>
  );
}

export default CommunityTitleCard;
