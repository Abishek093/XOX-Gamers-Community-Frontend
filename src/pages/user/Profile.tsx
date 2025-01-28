import React, { useEffect, useState, useCallback } from "react";
import UserTitleCard from "../../components/User/profile/UserTitleCard";
import UserProfileCard from "../../components/User/profile/UserProfileCard";
import PostFeed from "../../components/User/common/PostFeed";
import ProfileTabs from "../../components/User/profile/ProfileTabs";
import InfoComponent from "../../components/User/profile/InfoComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  selectUser,
  updateUser,
  updateTitleImage,
  updateProfileImage,
} from "../../Slices/userSlice/userSlice";
import {
  GoogleUser,
  UserData,
  UserDetails,
} from "../../interfaces/userInterfaces/apiInterfaces";
import axiosInstance from "../../services/userServices/axiosInstance";
import { toast } from "sonner";
import { useLoading } from "../../context/LoadingContext";
import { Skeleton } from "@mui/material";
import { base64ToBlob, getPresignedUrl, uploadImageToS3 } from "../../Utils/imageUploadHelper";

type Tab = "posts" | "info" | "friends" | "groups";

interface FormValues {
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  titleImage: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [user, setUser] = useState<UserData | GoogleUser | UserDetails | null>(
    null
  );
  const [ownProfile, setOwnProfile] = useState<boolean>(false);
  const { username } = useParams<{ username: string }>();
  const loggedInUser = useAppSelector(selectUser);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [posts, setPosts] = useState<any[]>([]);
  const [followStatus, setFollowStatus] = useState<
    "Rejected" | "NotFollowing" | "Requested" | "Accepted"
  >("NotFollowing");
  const API_URL = import.meta.env.VITE_USER_SERVICE_API_URL;

  const fetchUserProfile = useCallback(
    async (username: string) => {
      try {
        const isOwnProfile = loggedInUser?.username === username;
        if (isOwnProfile) {
          setUser(loggedInUser);
          setOwnProfile(true);
        } else {
          const { data } = await axiosInstance.get(`user/users/${username}`);
          setUser(data);
          setOwnProfile(false);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    },
    [loggedInUser]
  );

  useEffect(() => {
    if (username) {
      fetchUserProfile(username);
    }
  }, [username, fetchUserProfile]);

  const handleProfileUpdate = useCallback(
    (newUsername: string) => {
      setLoading(true);
      setOwnProfile(true);

      try {
        if (newUsername !== username) {
          fetchUserProfile(newUsername).then(() => {
            navigate(`/${newUsername}`);
            
          });
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [navigate, username, fetchUserProfile, setLoading]
  );

  const handleRemovePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(updateUser(values));
    if (updateUser.fulfilled.match(result)) {
      handleProfileUpdate(result.payload.user.username);
    }
  };

  const getInitialValues = (
    user: UserData | GoogleUser | UserDetails | null
  ): FormValues => {
    if (!user) {
      return {
        userId: "",
        username: "",
        displayName: "",
        bio: "",
        profileImage: "",
        titleImage: "",
      };
    }
    return {
      userId: user.id || "",
      username: user.username,
      displayName: user.displayName || "",
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      titleImage: user.titleImage || "",
    };
  };

  const initialValues = getInitialValues(user);

  
  const handleProfileImageUpload = async (croppedImage: string) => {
    try {
      const userId = loggedInUser?.id || "";
      
      const base64String = croppedImage.split(",")[1]; 
      const imageBlob = base64ToBlob(base64String, 'image/jpeg'); 
  
      const { uploadUrl, key } = await getPresignedUrl(userId, 'profile', API_URL); // Use 'profile' fileType.

  
      await uploadImageToS3(uploadUrl, imageBlob);
  
      const profileImageUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
      
      await dispatch(updateProfileImage({ userId, profileImageUrl }));
  
      setUser((prevUser) =>
        prevUser ? { ...prevUser, profileImage: profileImageUrl } : prevUser
      );
  
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Image upload failed.");
    }
  };
  
  

  const handleTitleImageUpload = async (croppedImage: string) => {
    try {
      const userId = loggedInUser?.id || "";
  
      const base64String = croppedImage.split(",")[1]; 
      const imageBlob = base64ToBlob(base64String, 'image/jpeg'); 
  
      const { uploadUrl, key } = await getPresignedUrl(userId, 'title', API_URL);

  
      await uploadImageToS3(uploadUrl, imageBlob);
  
      const titleImageUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
  
      await dispatch(updateTitleImage({ userId, titleImageUrl }));
  
      setUser((prevUser) =>
        prevUser ? { ...prevUser, titleImage: titleImageUrl } : prevUser
      );
  
      toast.success("Title image uploaded successfully!");
    } catch (error) {
      console.error("Title image upload failed", error);
      toast.error("Title image upload failed.");
    }
  };

  

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <PostFeed user={user} setPosts={setPosts} posts={posts} removePost={handleRemovePost} />;
      case "info":
        return (
          <InfoComponent onSubmit={onSubmit} initialValues={initialValues} />
        );
      default:
        return <PostFeed user={user} setPosts={setPosts} posts={posts} removePost={handleRemovePost} />;
    }
  };

  const renderSkeleton = () => (
    <div className="flex-1 flex flex-col p-4">
      <Skeleton variant="rectangular" width="100%" height={200} />
      <div className="flex gap-4 mt-4">
        <Skeleton variant="circular" width={100} height={100} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </div>
      </div>
      <Skeleton variant="text" width="100%" height={60} className="mt-4" />
    </div>
  );

  return (
    <div className="flex bg-gray-100">
      {user ? (
        <>
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <UserTitleCard
                  activeTab={activeTab}
                  user={user}
                  onProfileImageUpload={handleProfileImageUpload}
                  onTitleImageUpload={handleTitleImageUpload}
                />
              </div>
              <div className="col-span-3">
                <ProfileTabs
                  setActiveTab={setActiveTab}
                  ownProfile={ownProfile}
                />
              </div>
              <div
                style={{
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                }}
                className="col-span-3 overflow-y-scroll h-[53vh]"
              >
                {renderContent()}
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <UserProfileCard 
              user={user} 
              ownProfile={ownProfile} 
              setPosts={setPosts} 
              posts={posts}
              followStatus={followStatus}
              setFollowStatus={setFollowStatus}
            />
          </div>
        </>
      ) : (
        renderSkeleton()
      )}
    </div>
  );
};

export default Profile;