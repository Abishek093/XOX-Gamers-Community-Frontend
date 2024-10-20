import React, { useEffect, useState } from 'react';
import CommunityListTitleCard from '../../components/User/community/CommunityListTitleCard';
import CreateCommunityModal from '../../components/User/community/CreateCommunityModal';
import axiosInstance from '../../services/userServices/axiosInstance';
import { toast } from 'sonner';
import CommunityCard from '../../components/User/home/CommunityCard';
import { ICommunityWithCounts } from '../../interfaces/userInterfaces/apiInterfaces'; 
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../Slices/userSlice/userSlice';
import { useLoading } from '../../context/LoadingContext';

const CommunityList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communities, setCommunities] = useState<ICommunityWithCounts[]>([]);
  const [error, setError] = useState<string>('');
  const { setLoading } = useLoading(); 

  const ownUser = useAppSelector(selectUser);
  const userID = ownUser?.id;

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

  const handleSubmit = async (communityName: string, description: string, postPermission: string, uploadedImage: string | null) => {
    if (!communityName || !description || !postPermission || !uploadedImage) {
      setError('Please fill out all fields and upload an image');
      return;
    }
    setError('');
    setLoading(true); 
    try {
      setIsModalOpen(false);
      const response = await axiosInstance.post('create-community', {
        userID,
        communityName,
        description,
        postPermission,
        communityImage: uploadedImage,
      });
      toast.success("Community created successfully")
      setCommunities([...communities, response.data]);
      // setIsModalOpen(false);
    } catch (error: any) {
      console.log('error', error);
      if (error.response && error.response.data) {
        toast.error(error.response.data || 'An error occurred while creating the community');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false); 
    }
  };
  return (
    <div className="relative p-4 h-[91vh] flex flex-col">
      <div className="flex-shrink-0">
        <CommunityListTitleCard
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>

      <div className="flex-grow overflow-y-auto mt-4" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {communities.map((community) => (
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

      {isModalOpen && (
        <CreateCommunityModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default CommunityList;
