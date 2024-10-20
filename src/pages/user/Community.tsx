import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../Slices/userSlice/userSlice';
import axiosInstance from '../../services/userServices/axiosInstance';
import { toast } from 'sonner';
import CommunityTitleCard from '../../components/User/community/CommunityTitleCard';
import { FaEdit, FaListAlt, FaPlus } from 'react-icons/fa';
import ImageUploadModal from '../../components/Common/ImageUploadModal';
import Post from '../../components/User/common/Post';
import EditCommunity from '../../components/User/community/EditCommunity';
import { useLoading } from '../../context/LoadingContext';
import io from 'socket.io-client';


interface CommunityData {
  _id: string;
  name: string;
  description?: string;
  createdBy: string;
  followers: string[];
  posts: any[]; 
  postPermission: 'admin' | 'anyone';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface FollowerCountUpdate {
  communityId: string;
  followerCount: number;
}

const Community: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setLoading } = useLoading();
  const [followStatus, setFollowStatus] = useState<boolean>(false);
  const [postCount, setPostCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);

  const owner = useAppSelector(selectUser);
  const userName = owner?.username;

  const fetchCommunityDetails = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`fetch-community/${communityId}`);
      setCommunity(data);
      setPostCount(data.posts.length);
      setFollowersCount(data.followers.length);
      checkFollowStatus();
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [communityId, owner?.id]);

  useEffect(() => {
    fetchCommunityDetails();
  }, [fetchCommunityDetails]);

  useEffect(() => {
    const socket = io('http://localhost:3000'); // Replace with your server URL

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('joinCommunity', communityId);
    });

    socket.on('updateFollowerCount', ({ communityId: updatedCommunityId, followerCount }: FollowerCountUpdate) => {
      if (updatedCommunityId === communityId) {
        setFollowersCount(followerCount);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [communityId]);

  const checkFollowStatus = async () => {
    try {
      const { data } = await axiosInstance.get(`/follower/${owner?.id}/community/${communityId}`);
      setFollowStatus(data.isFollowing);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/follow/${communityId}/user/${owner?.id}`);
      setFollowStatus(true);
      // We'll let the socket update handle the follower count
      toast.success("Successfully followed the community");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  const handleUnfollow = async () => {
    try {
      await axiosInstance.delete(`/unfollow/${communityId}/user/${owner?.id}`);
      setFollowStatus(false);
      // We'll let the socket update handle the follower count
      toast.success("Successfully unfollowed the community");
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  const handlePostCreation = async (croppedImage: string, _isProfileImage?: boolean, description?: string) => {
    setLoading(true);
    try {
      const base64String = croppedImage.split(",")[1];
      const result = await axiosInstance.post(`community-post`, { userName, croppedImage: base64String, description, communityId });
      if (result.status === 200) {
        toast.success("Post added successfully");
        const { data } = await axiosInstance.get(`fetch-community/${communityId}`);
        setCommunity(data);
        setPostCount(data.posts.length);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityUpdate = (updatedCommunity: any) => {
    setCommunity(updatedCommunity);
    setIsAdminView(true); 
  };

  const handleRemovePost = async (postId: string) => {
    try {
      await axiosInstance.delete(`/community-post/${postId}`);
      setCommunity((prevCommunity) => {
        if (prevCommunity) {
          const updatedPosts = prevCommunity.posts.filter((post) => post._id !== postId);
          setPostCount(updatedPosts.length);
          return {
            ...prevCommunity,
            posts: updatedPosts,
          };
        }
        return prevCommunity;
      });
      toast.success("Post removed successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative p-4 h-[91vh] flex flex-col">
      <div className="flex-shrink-0">
        <CommunityTitleCard
          image={community?.image}
          name={community?.name}
          description={community?.description}
          postCount={postCount}
          followersCount={followersCount}
          isFollowing={followStatus}
          onFollowToggle={followStatus ? handleUnfollow : handleFollow}
        />
      </div>

        {/* Admin Control Bar */}
        {owner?.id === community?.createdBy && (
          <div className="flex justify-center my-4 space-x-4">
            <button
              className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 transform ${isAdminView
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              onClick={() => setIsAdminView(true)}
            >
              <FaListAlt className="mr-2" />
              Posts
            </button>
            <button
              className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 transform ${!isAdminView
                ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              onClick={() => setIsAdminView(false)}
            >
              <FaEdit className="mr-2" />
              Edit Community
            </button>
          </div>
        )}

        {/* Floating Create Post Button */}
        {(community?.postPermission === 'anyone' || owner?.id === community?.createdBy) && (
          <button
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 transform"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="text-2xl" />
          </button>
        )}

        <div className="flex-grow">
          {owner?.id === community?.createdBy ? (
            isAdminView ? (
              <div style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} className="col-span-3 overflow-y-scroll h-[53vh]">
                {community?.posts.map((post) => (
                  <Post
                    key={post._id}
                    user={post.author}
                    post={post}
                    removePost={handleRemovePost}
                  />
                ))}
              </div>
            ) : (
              community && (
                <div style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} className="col-span-3 overflow-y-scroll h-[53vh]">
                  <EditCommunity
                    community={community}
                    onCommunityUpdate={handleCommunityUpdate}
                  />
                </div>
              )
            )
          ) : (
            <div style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} className="col-span-3 overflow-y-scroll h-[53vh]">
              {community?.posts.map((post) => (
                <Post
                  key={post._id}
                  user={post.author}
                  post={post}
                  removePost={handleRemovePost}
                />
              ))}
            </div>
          )}
        </div>
        
        {isModalOpen && (
          <ImageUploadModal
            isOpen={isModalOpen}
            profile={false}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handlePostCreation}
            isPost={true}
          />
        )}
      </div>
    );
  };

  export default Community;