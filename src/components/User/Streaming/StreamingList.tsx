import axiosInstance from '../../../../src/services/userServices/axiosInstance';
import React, { useEffect, useState } from 'react';
import { TbLivePhotoFilled } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface UserDto {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
}

export interface StreamDto {
  id?: string;
  title: string;
  description: string;
  game: string;
  thumbnailUrl: string | null;
  isLive: boolean;
  user: UserDto;
}

interface StreamCardProps extends StreamDto {}

const StreamCard: React.FC<StreamCardProps> = ({ id, thumbnailUrl, title, description, isLive, user }) => {
  const navigate = useNavigate(); // Add navigation hook here

  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300'>
      <div className='relative'>
        <img
          className='w-full h-48 object-cover rounded-t-xl'
          src={thumbnailUrl || '/api/placeholder/400/300'}
          alt={`${user.displayName}'s stream`}
        />
        {isLive && (
          <div className='absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center'>
            <TbLivePhotoFilled className="mr-1" />
            LIVE
          </div>
        )}
      </div>
      <div className='p-4'>
        <div className='flex items-center mb-3'>
          <img
            className='w-12 h-12 rounded-full mr-3 border-2 border-gray-200'
            src={user.profileImage || '/api/placeholder/130/130'}
            alt={`${user.displayName}'s avatar`}
          />
          <div>
            <p className='font-semibold text-gray-800'>{user.displayName}</p>
            <p className='text-sm text-gray-500'>@{user.username}</p>
          </div>
        </div>
        <div className='mb-2'>
          <h3 className='font-bold text-lg text-gray-800'>{title}</h3>
          <p className='text-sm text-gray-600 mt-1'>{description}</p>
        </div>
        <button
          onClick={() => navigate(`stream/${id}`)} // Use navigate from the hook
          className={`mt-4 w-full text-white font-semibold py-2 px-4 rounded transition duration-300 ${
            isLive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLive ? 'Watch Live' : 'View Profile'}
        </button>
      </div>
    </div>
  );
};

const StreamingList: React.FC = () => {
  const [streams, setStreams] = useState<StreamDto[]>([]); // Use StreamDto for typing

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axiosInstance.get('streaming/get-streams');
        console.log(response)
        console.log(response.data)
        const streamsData: StreamDto[] = response.data; 
        setStreams(streamsData);
      } catch (error) {
        toast.error("Failed to fetch streams");
      }
    };

    fetchStreams();
  }, []);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {streams
        .filter((stream) => stream.isLive) 
        .map((stream) => (
          <StreamCard key={stream.id} {...stream} />
        ))}
    </div>
  );
};

export default StreamingList;