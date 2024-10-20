import React, { useState, useEffect } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  UserDetails,
  GoogleUser,
  UserData,
} from "../../../interfaces/userInterfaces/apiInterfaces";
import ImageUploadModal from "../../Common/ImageUploadModal";

interface UserTitleCardProps {
  user: UserData | GoogleUser | UserDetails | null;
  activeTab: "posts" | "info" | "friends" | "groups";
  onProfileImageUpload: (croppedImage: string) => void;
  onTitleImageUpload: (croppedImage: string) => void;
}

const UserTitleCard: React.FC<UserTitleCardProps> = ({
  user,
  activeTab,
  onProfileImageUpload,
  onTitleImageUpload,
}) => {
  const defaultProfileImage =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1719396828~exp=1719400428~hmac=3992078a184c24bf98ee7b06afbab8f3bad2a1d00f616f2b7a906e219f974cb1&w=740";
  const defaultTitleImage =
    "https://pro-theme.com/html/teamhost/assets/img/heading3.jpg";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileImage, setIsProfileImage] = useState(true);
  const [localProfileImage, setLocalProfileImage] = useState(
    user?.profileImage || defaultProfileImage
  );
  const [localTitleImage, setLocalTitleImage] = useState(
    user?.titleImage || defaultTitleImage
  );

  useEffect(() => {
    setLocalProfileImage(user?.profileImage || defaultProfileImage);
    setLocalTitleImage(user?.titleImage || defaultTitleImage);
  }, [user]);

  const getCachedImageUrl = (imageUrl?: string) => {
    return imageUrl
      ? `${imageUrl}?t=${new Date().getTime()}`
      : defaultProfileImage;
  };

  return (
    <>
      <div className="h-64 bg-gray-800 p-4 flex flex-col justify-center items-center relative">
        <img
          src={getCachedImageUrl(localTitleImage) || defaultTitleImage}
          alt="Title"
          className="object-cover w-full h-full absolute top-0 left-0 z-0"
        />
        {activeTab === "info" && (
          <button
            className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded text-gray-600 hover:text-gray-900"
            onClick={() => {
              setIsModalOpen(true);
              setIsProfileImage(false);
            }}
          >
            <AddPhotoAlternateIcon />
          </button>
        )}
        <div className="flex flex-col items-center">
          <div className="w-[120px] h-[120px] rounded-full bg-white mb-2 relative overflow-hidden">
            <img
              src={getCachedImageUrl(localProfileImage) || defaultProfileImage}
              className="object-cover w-full h-full"
              alt="Profile"
            />
            {activeTab === "info" && (
              <button
                className="absolute bottom-0 left-0 w-32 h-10 bg-slate-300 shadow-lg text-gray-600 items-center justify-center hover:text-gray-900"
                onClick={() => {
                  setIsModalOpen(true);
                  setIsProfileImage(true);
                }}
              >
                <AddPhotoAlternateIcon />
              </button>
            )}
          </div>
          <h1 className="uk-page-heading-style-a uk-page-heading-h text-white text-xl font-bold z-10">
            {user?.username || "User"}
          </h1>
          <p className="text-white text-base z-10">{user?.bio || ""}</p>
        </div>
      </div>
      <ImageUploadModal
        isOpen={isModalOpen}
        profile={isProfileImage}
        onClose={() => setIsModalOpen(false)}
        onSubmit={
          isProfileImage ? onProfileImageUpload : onTitleImageUpload
        }
        isPost={false}
      />
    </>
  );
};

export default UserTitleCard;
