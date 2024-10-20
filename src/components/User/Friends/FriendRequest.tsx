import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/userServices/axiosInstance";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../Slices/userSlice/userSlice";
import { Button, Avatar, Box, Typography } from "@mui/material";

interface FriendRequestProps {
  _id: string;
  userId: string;
  followerId: string;
  status: string;
  userDetails: {
    _id: string;
    username: string;
    displayName: string;
    profileImage: string;
  };
}

const FriendRequest: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [requests, setRequests] = useState<FriendRequestProps[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axiosInstance.get(
          `fetch-friend-requests/${user?.id}`
        );
        console.log(response.data);
        setRequests(response.data);
      } catch (error: any) {
        setError(true);
      }
    };
    fetchFriendRequests();
  }, [user?.id]);

  const handleAccept = async (requestId: string) => {
    try {
      await axiosInstance.post(`/accept-friend-request/${requestId}`);
      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axiosInstance.post(`/reject-friend-request/${requestId}`);
      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  return (
    <div className="h-auto bg-white px-4 p-2 rounded-md">
      <div className="overflow-y-auto" style={{ maxHeight: "80%" }}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <Box
              key={request._id}
              className="flex items-center justify-between p-2 border-b border-gray-200"
            >
              <div className="flex items-center">
                <Avatar
                  src={request.userDetails.profileImage}
                  alt={request.userDetails.username}
                  className="h-14 w-14"
                />
                <div className="ml-3">
                  <Typography variant="body1">
                    {request.userDetails.displayName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    @{request.userDetails.username}
                  </Typography>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAccept(request._id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleReject(request._id)}
                >
                  Reject
                </Button>
              </div>
            </Box>
          ))
        ) : (
          <Typography
            variant="body2"
            color={error ? "error" : "textSecondary"}
            sx={{
              textAlign: "center",
              padding: "16px",
              border: `1px solid ${error ? "#f44336" : "#e0e0e0"}`,
              borderRadius: "8px",
              backgroundColor: error ? "#fddede" : "#f5f5f5",
              fontWeight: "bold",
            }}
          >
            {error ? "Failed to load requests." : "No friend requests."}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
