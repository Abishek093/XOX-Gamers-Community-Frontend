import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  UserData,
  GoogleUser,
  UserDetails,
  AspectRatio,
} from "../../../interfaces/userInterfaces/apiInterfaces";
import ImageUploadModal from "../../Common/ImageUploadModal";
import axiosInstance from "../../../services/userServices/axiosInstance";
import { toast } from "sonner";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../Slices/userSlice/userSlice";
import { useLoading } from "../../../context/LoadingContext";
import { base64ToBlob, getPresignedUrl, uploadImageToS3 } from "../../../Utils/imageUploadHelper";
import { useNavigate } from 'react-router-dom';


interface UserProfileCardProps {
  user: UserData | GoogleUser | UserDetails | null;
  ownProfile: boolean;
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  posts: any[];
  followStatus: "Rejected" | "NotFollowing" | "Requested" | "Accepted";
  setFollowStatus: React.Dispatch<React.SetStateAction<"Rejected" | "NotFollowing" | "Requested" | "Accepted">>;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  ownProfile,
  setPosts,
  posts,
  followStatus,
  setFollowStatus
}) => {
  const defaultProfileImage =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1719396828~exp=1719400428~hmac=3992078a184c24bf98ee7b06afbab8f3bad2a1d00f616f2b7a906e219f974cb1&w=740";

  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const { setLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelRequestModalOpen, setIsCancelRequestModalOpen] = useState(false);
  const [localProfileImage, setLocalProfileImage] = useState(
    user?.profileImage || defaultProfileImage
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>({
    shape: "rect",
    aspect: [700 / 400, 1020 / 400],
  });
  const ownUser = useAppSelector(selectUser);
  const URL = import.meta.env.VITE_CONTENT_SERVICE_API_URL
  const navigate = useNavigate();

  // const handlePostCreation = async (
  //   croppedImage: string,
  //   _isProfileImage?: boolean,
  //   description?: string
  // ) => {
  //   setLoading(true);
  //   try {
  //     const base64String = croppedImage.split(",")[1];
  //     const username = user?.username;
  //     // const imageBlob = base64ToBlob(base64String, 'image/jpeg');
  //     const result = await axiosInstance.post(`content/posts/create-post`, {
  //       username,
  //       croppedImage: base64String,
  //       description,
  //     });
  //     const newPost = result.data
  //     setPosts((prevPosts) => [newPost, ...prevPosts]);
      
  //     if (result.status === 200) {
  //       toast.success("Post added successfully");
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePostCreation = async (croppedImage: string, _isProfileImage?: boolean, description?: string) => {
    setLoading(true);
    try {
      if(ownUser?.id){
        const base64String = croppedImage.split(",")[1];
        const imageBlob = base64ToBlob(base64String, 'image/jpeg'); 
        const { uploadUrl, key } = await getPresignedUrl(ownUser?.id, 'post', `content/posts/`);
        await uploadImageToS3(uploadUrl, imageBlob);
        const postImageUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;

        const username = user?.username;
        const result = await axiosInstance.post(`${URL}posts/create-post`, {
          username,
          postImageUrl,
          description,
        });
        console.log("result",result)
        const newPost = result.data
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        
        if (result.status === 200) {
          toast.success("Post added successfully");
        }

      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axiosInstance.post(
        `user/follower/${ownUser?.id}/user/${user?.id}`
      );
      if (response.data.status === "Requested") {
        setFollowStatus("Requested");
        toast.success("Follow request sent");
      } else if (response.data.status === "Accepted") {
        setFollowStatus("Accepted");
        setFollowers(prev => prev + 1);
        toast.success("You are now following this user");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.delete(`user/follower/${ownUser?.id}/user/${user?.id}`);
      setFollowStatus("NotFollowing");
      setFollowers(prev => Math.max(0, prev - 1));
      toast.success("Unfollowed successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } 
  };

  const handleCancelRequest = async () => {
    try {
      await axiosInstance.delete(`user/follower/${ownUser?.id}/user/${user?.id}`);
      setFollowStatus("NotFollowing");
      toast.success("Follow request cancelled");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsCancelRequestModalOpen(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      const chat = await axiosInstance.get(`user/check-chat/initiator/${ownUser?.id}/recipient/${user?.id}`);
      console.log('Chat: ',chat)
      if (chat.status === 204 || chat.status === 200) {
        const newChat = await axiosInstance.post(`user/new-chat/initiator/${ownUser?.id}/recipient/${user?.id}`);
        if (newChat.status === 200) {
          console.log("Chat created or fetched:", newChat.data);
          toast.success("Chat opened successfully");
          navigate('/chats'); 
        } else {
          console.log("Error creating chat:", newChat.data);
          toast.error("Error opening chat");
        }
      } else {
        console.log("Error checking chat:", chat.data);
        toast.error("Error checking chat status");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message");
    }
  };

  useEffect(() => {
    const fetchUserConnections = async (userId: string) => {
      try {
        const followersResult = await axiosInstance.get(
          `user/fetchFollowers/${userId}`
        );
        setFollowers(followersResult.data.length);

        const followingResult = await axiosInstance.get(
          `user/fetchFollowing/${userId}`
        );
        setFollowing(followingResult.data.length);

        const followStatusResult = await axiosInstance.get(
          `user/followerStatus/${ownUser?.id}/user/${userId}`
        );
        setFollowStatus(followStatusResult.data.status);
      } catch (error) {
        console.error("Failed to fetch user connections:", error);
      }
    };

    if (user?.id) {
      fetchUserConnections(user.id);
    }
  }, [user, ownUser, setFollowStatus]);

  const getCachedImageUrl = (imageUrl?: string) => {
    return imageUrl
      ? `${imageUrl}?t=${new Date().getTime()}`
      : defaultProfileImage;
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 400,
          margin: "auto",
          boxShadow: 3,
          marginRight: "0px",
          height: "400px",
        }}
      >
        <Avatar
          src={getCachedImageUrl(localProfileImage) || defaultProfileImage}
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            marginTop: "48px",
            border: "3px solid white",
          }}
        />

        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            align="center"
            marginBottom="0px"
          >
            {user?.username}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            align="center"
            marginBottom="20px"
          >
            {user?.displayName}
          </Typography>
          <Box display="flex" justifyContent="space-around" alignItems="center">
            <Box textAlign="center">
              <Typography variant="h6">{followers}</Typography>
              <Typography variant="body2" color="textSecondary">
                Followers
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{following}</Typography>
              <Typography variant="body2" color="textSecondary">
                Following
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6">{posts.length}</Typography>
              <Typography variant="body2" color="textSecondary">
                Posts
              </Typography>
            </Box>
          </Box>
          {ownProfile ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                setIsModalOpen(true);
                setAspectRatio({
                  shape: "rect",
                  aspect: [700 / 400, 1020 / 400],
                });
              }}
              sx={{ marginTop: 2 }}
            >
              Create Post
            </Button>
          ) : followStatus === "NotFollowing" || followStatus === "Rejected" ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleFollow}
              sx={{ marginTop: 2 }}
            >
              Follow
            </Button>
          ) : followStatus === "Requested" ? (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => setIsCancelRequestModalOpen(true)}
              sx={{ marginTop: 2 }}
            >
              Requested
            </Button>
          ) : (
            <Box display="flex" justifyContent="space-between" marginTop={2}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleUnfollow}
                sx={{ marginRight: 1 }}
              >
                Unfollow
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginLeft: 1 }}
                onClick={handleSendMessage}
              >
                Message
              </Button>
            </Box>
          )}
        </CardContent>
        <ImageUploadModal
          isOpen={isModalOpen}
          profile={false}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handlePostCreation}
          isPost={true}
        />
      </Card>

      <Dialog
        open={isCancelRequestModalOpen}
        onClose={() => setIsCancelRequestModalOpen(false)}
      >
        <DialogTitle>Cancel Follow Request</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel your follow request?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCancelRequestModalOpen(false)}>No</Button>
          <Button onClick={handleCancelRequest} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfileCard;