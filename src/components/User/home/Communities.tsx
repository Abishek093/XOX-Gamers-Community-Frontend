import React, { useEffect, useState } from 'react';
import CommunityCard from './CommunityCard';
import axiosInstance from '../../../services/userServices/axiosInstance';
import { ICommunityWithCounts } from '../../../interfaces/userInterfaces/apiInterfaces';
import { toast } from 'sonner';
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon
import { useNavigate } from 'react-router-dom';

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<ICommunityWithCounts[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const { data } = await axiosInstance.get<ICommunityWithCounts[]>('fetch-all-communities');
        setCommunities(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchCommunities();
  }, []);

  const handleViewMore = () => {
    navigate('/community-list');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl text-gray-900">Our Communities</h2>
        <button
          onClick={handleViewMore}
          className="flex items-center text-orange-500 hover:text-orange-600 font-medium"
        >
          View More
          <FaArrowRight className="ml-2" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4 h-4/5">
        {communities.slice(0, 4).map((community) => (
          <CommunityCard
            key={community._id}
            communityId={community._id}
            name={community.name}
            posts={community.postCount}
            members={community.followerCount}
            imageUrl={community.image || '/default-image.jpg'}
          />
        ))}
      </div>
    </div>
  );
};

export default Communities;
