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
import { base64ToBlob, getPresignedUrl, uploadImageToS3 } from '../../Utils/imageUploadHelper';
import { useSockets } from '../../context/socketContext';

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

// interface FollowerCountUpdate {
//   communityId: string;
//   followerCount: number;
// }

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
  const { contentSocket } = useSockets()

  useEffect(() => {
    if (contentSocket && communityId) {
      contentSocket.emit('join_community', communityId);

      contentSocket.on('community_follower_update', (data: {
        communityId: string;
        followerCount: number;
        followers: any[];
      }) => {
        if (data.communityId === communityId) {
          setFollowersCount(data.followerCount);
        }
      });

      return () => {
        contentSocket.emit('leave_community', communityId);
        contentSocket.off('community_follower_update');
      };
    }
  }, [contentSocket, communityId]);

  // const fetchCommunityDetails = useCallback(async () => {
  //   try {
  //     const { data } = await axiosInstance.get(`content/communities/fetch-community/${communityId}`);
  //     setCommunity(data);
  //     setPostCount(data.posts.length);
  //     // setFollowersCount(data.followers.length);
  //     checkFollowStatus();
  //     fetchCommunityFollowers()
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   }
  // }, [communityId, owner?.id]);

  // useEffect(() => {
  //   fetchCommunityDetails();
  // }, [fetchCommunityDetails]);
  const fetchCommunityDetails = useCallback(async () => {
    if (!communityId) return;

    try {
      const { data } = await axiosInstance.get(`content/communities/fetch-community/${communityId}`);
      if (data) {
        setCommunity(data);
        setPostCount(data.posts?.length || 0);
        checkFollowStatus();
        fetchCommunityFollowers();
      }
    } catch (error: any) {
      toast.error(error.message || 'Error fetching community details');
    }
  }, [communityId]);

  useEffect(() => {
    fetchCommunityDetails();
  }, [fetchCommunityDetails]);




  const checkFollowStatus = async () => {
    try {
      const { data } = await axiosInstance.get(`content/communities/follower/${owner?.id}/community/${communityId}`);
      setFollowStatus(data.isFollowing);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchCommunityFollowers = async () => {
    try {
      const result = await axiosInstance.get(`content/communities/fetchFollowers/${communityId}`)
      console.log('result', result)
      console.log('result.data', result.data.length)
      setFollowersCount(result.data.length)
    } catch (error) {
      toast.error('Error fetching followers')
    }
  }

  // const handleFollow = async () => {
  //   try {
  //     await axiosInstance.post(`content/communities/follow/${communityId}/user/${owner?.id}`);
  //     setFollowStatus(true);
  //     toast.success("Successfully followed the community");
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   }
  // };

  // const handleUnfollow = async () => {
  //   try {
  //     await axiosInstance.delete(`/unfollow/${communityId}/user/${owner?.id}`);
  //     setFollowStatus(false);
  //     toast.success("Successfully unfollowed the community");
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   }
  // };

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`content/communities/follow/${communityId}/user/${owner?.id}`);
      setFollowStatus(true);

      if (contentSocket) {
        contentSocket.emit('community_follow_action', {
          communityId,
          userId: owner?.id,
          action: 'follow'
        });
      }

      toast.success("Successfully followed the community");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.delete(`content/communities//unfollow/${communityId}/user/${owner?.id}`);
      setFollowStatus(false);

      if (contentSocket) {
        contentSocket.emit('community_follow_action', {
          communityId,
          userId: owner?.id,
          action: 'unfollow'
        });
      }

      toast.success("Successfully unfollowed the community");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePostCreation = async (croppedImage: string, _isProfileImage?: boolean, description?: string) => {
    setLoading(true);
    try {
      if (owner?.id) {
        const base64String = croppedImage.split(",")[1];
        const imageBlob = base64ToBlob(base64String, 'image/jpeg');
        const { uploadUrl, key } = await getPresignedUrl(owner?.id, 'community-post', `content/posts/`);
        await uploadImageToS3(uploadUrl, imageBlob);
        const postImageUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
        const result = await axiosInstance.post(`content/communities/community-post`, { userName, postImageUrl, description, communityId });
        if (result.status === 200) {
          toast.success("Post added successfully");
          const { data } = await axiosInstance.get(`content/communities/fetch-community/${communityId}`);
          setCommunity(data);
          setPostCount(data.posts.length);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityUpdate = async (updatedCommunity: any) => {
    setCommunity(updatedCommunity);
    setIsAdminView(true);
    await fetchCommunityDetails();
  };

  const handleRemovePost = async (postId: string) => {
    try {
      await axiosInstance.delete(`content/communities/community-post/${postId}`);
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

  //   return (
  //     <div className="relative p-4 h-[91vh] flex flex-col">
  //       <div className="flex-shrink-0">
  //         <CommunityTitleCard
  //           image={community?.image}
  //           name={community?.name}
  //           description={community?.description}
  //           postCount={postCount}
  //           followersCount={followersCount}
  //           isFollowing={followStatus}
  //           onFollowToggle={followStatus ? handleUnfollow : handleFollow}
  //         />
  //       </div>

  //       {/* Admin Control Bar */}
  //       {owner?.id === community?.createdBy && (
  //         <div className="flex justify-center my-4 space-x-4">
  //           <button
  //             className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 transform ${isAdminView
  //               ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-105'
  //               : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  //               }`}
  //             onClick={() => setIsAdminView(true)}
  //           >
  //             <FaListAlt className="mr-2" />
  //             Posts
  //           </button>
  //           <button
  //             className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 transform ${!isAdminView
  //               ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg hover:scale-105'
  //               : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  //               }`}
  //             onClick={() => setIsAdminView(false)}
  //           >
  //             <FaEdit className="mr-2" />
  //             Edit Community
  //           </button>
  //         </div>
  //       )}

  //       {/* Floating Create Post Button */}
  //       {(community?.postPermission === 'anyone' && followStatus === true || owner?.id === community?.createdBy) && (
  //         <button
  //           className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 transform"
  //           onClick={() => setIsModalOpen(true)}
  //         >
  //           <FaPlus className="text-2xl" />
  //         </button>
  //       )}

  //       <div className="flex-grow">
  //         {owner?.id === community?.createdBy ? (
  //           isAdminView ? (
  //             <div style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} className="col-span-3 overflow-y-scroll h-[53vh]">
  //               {community?.posts.map((post) => (
  //                 <Post
  //                   key={post._id}
  //                   user={post.author}
  //                   post={post}
  //                   removePost={handleRemovePost}
  //                 />
  //               ))}
  //             </div>
  //           ) : (
  //             community && (
  //               <div style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} className="col-span-3 overflow-y-scroll h-[53vh]">
  //                 <EditCommunity
  //                   community={community}
  //                   onCommunityUpdate={handleCommunityUpdate}
  //                 />
  //               </div>
  //             )
  //           )
  //         ) : (
  //           <div style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }} className="col-span-3 overflow-y-scroll h-[53vh]  my-4 space-x-4">
  //             {community?.posts.map((post) => (
  //               <Post
  //                 key={post._id}
  //                 user={post.author}
  //                 post={post}
  //                 removePost={handleRemovePost}
  //               />
  //             ))}
  //           </div>
  //         )}
  //       </div>

  //       {isModalOpen && (
  //         <ImageUploadModal
  //           isOpen={isModalOpen}
  //           profile={false}
  //           onClose={() => setIsModalOpen(false)}
  //           onSubmit={handlePostCreation}
  //           isPost={true}
  //         />
  //       )}
  //     </div>
  //   );
  // };


  return (
    <div className="relative p-4 h-[91vh] flex flex-col">
      <div className="flex-shrink-0">
        {community && (
          <CommunityTitleCard
            image={community.image}
            name={community.name}
            description={community.description}
            postCount={postCount}
            followersCount={followersCount}
            isFollowing={followStatus}
            onFollowToggle={followStatus ? handleUnfollow : handleFollow}
          />
        )}
      </div>

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
      {(community?.postPermission === 'anyone' && followStatus === true || owner?.id === community?.createdBy) && (
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
            <div
              style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
              className="col-span-3 overflow-y-scroll h-[53vh]"
            >
              {community?.posts && community.posts.length > 0 ? (
                community.posts.map((post) => (
                  <Post
                    key={post._id}
                    user={post.author}
                    post={post}
                    removePost={handleRemovePost}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[53vh] bg-white">
                  <img
                    src="/src/assets/NoImages.png"
                    alt="No content available"
                    className="h-20"
                  />
                  <p className="mt-4 text-gray-600 text-md font-sans font-semibold">
                    No posts yet!
                  </p>
                </div>
              )}
            </div>
          ) : (
            community && (
              <div
                style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                className="col-span-3 overflow-y-scroll h-[53vh]"
              >
                <EditCommunity
                  community={community}
                  onCommunityUpdate={handleCommunityUpdate}
                />
              </div>
            )
          )
        ) : (
          <div
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            className="col-span-3 overflow-y-scroll h-[53vh] my-4 space-x-4"
          >
            {community?.posts && community.posts.length > 0 ? (
              community.posts.map((post) => (
                <Post
                  key={post._id}
                  user={post.author}
                  post={post}
                  removePost={handleRemovePost}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[53vh] bg-white">
                <img
                  src="/src/assets/NoImages.png"
                  alt="No content available"
                  className="h-20"
                />
                <p className="mt-4 text-gray-600 text-md font-sans font-semibold">
                  No posts yet!
                </p>
              </div>
            )}
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
}
export default Community;