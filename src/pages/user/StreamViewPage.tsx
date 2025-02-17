import React, { useEffect, useRef, useState } from 'react';
import StreamPlayer from '../../../src/components/User/Live/StreamPlayer';
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  UserCircle2,
  Star,
  AlertTriangle
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '../../../src/services/userServices/axiosInstance';
import { useLoading } from '../../../src/context/LoadingContext';
import { useSockets } from '../../../src/context/socketContext';
import { selectUser } from '../../../src/Slices/userSlice/userSlice';
import { useAppSelector } from '../../../src/store/hooks';
import { formatDistanceToNow } from 'date-fns';
import {
  Button, Box, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface JoinNotification extends CommentType {
  type: 'join';
}

interface StreamJoinNotification {
  streamId: string;
  user: {
    userId: string;
    displayName: string;
    profileImage: string;
  };
  timestamp: string;
  type: 'join';
}

export interface UserDto {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
  followers?: number;
}

type ReactionType = 'like' | 'dislike' | null;
type StatusType = {
  likes: number;
  dislikes: number;
  views: number;
};

export interface StreamDto {
  id?: string;
  title: string;
  description: string;
  game: string;
  thumbnailUrl: string | null;
  isLive: boolean;
  user: UserDto;
  streamKey: string;
  status?: {
    likes: number;
    dislikes: number;
    views: number;
  };
}

interface CommentType {
  streamId?: string;
  user: {
    userId: string,
    displayName?: string;
    profileImage?: string;
  };
  comment: string;
  timestamp: Date | number | string;
  error?: boolean;
}

interface CommentSocketResponse {
  success: boolean;
  message?: string;
}

// Default values (keep existing DEFAULT_STREAM from previous code)
const DEFAULT_STREAM: StreamDto = {
  title: 'Loading...',
  description: '',
  game: '',
  thumbnailUrl: null,
  isLive: false,
  streamKey: '',
  user: {
    id: '',
    username: '',
    displayName: 'Unknown Streamer',
    profileImage: '/api/placeholder/100/100',
    followers: 0
  },
  status: {
    likes: 0,
    dislikes: 0,
    views: 0
  }
};

interface CommentSocketData {
  streamId: string;
  user: {
    userId: string;
    displayName?: string;
    profileImage?: string;
  };
  comment: string;
  timestamp: string;
}

// interface StreamStatus {
//   likes: number;
//   dislikes: number;
//   views: number;
// }

// interface ReactionUpdateData {
//   streamId: string;
//   status: StreamStatus;
// }


interface ViewerCount {
  currentViewers: number;
  totalUniqueViewers: number;
}

interface ViewerUpdateData {
  streamId: string;
  viewerCount: ViewerCount;
}

const StreamViewPage: React.FC = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const { setLoading } = useLoading();
  const { streamSocket } = useSockets();
  const ownUser = useAppSelector(selectUser);
  const [streamKey, setStreamKey] = useState<string>('');
  const [streamData, setStreamData] = useState<StreamDto>(DEFAULT_STREAM);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isCancelRequestModalOpen, setIsCancelRequestModalOpen] = useState(false);

  const [viewerCount, setViewerCount] = useState<ViewerCount>({
    currentViewers: 0,
    totalUniqueViewers: 0
  });

  const commentsEndRef = useRef<HTMLDivElement>(null);

  const [followStatus, setFollowStatus] = useState<
    "Rejected" | "NotFollowing" | "Requested" | "Accepted"
  >("NotFollowing");
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  // useEffect(() => {
  //   const joinStream = () => {
  //     if (streamSocket && streamId && ownUser?.id) {
  //       streamSocket.emit('join_stream', {
  //         streamId,
  //         userId: ownUser.id
  //       });
  //     }
  //   };

  //   const leaveStream = () => {
  //     if (streamSocket && streamId && ownUser?.id) {
  //       streamSocket.emit('leave_stream', {
  //         streamId,
  //         userId: ownUser.id
  //       });
  //     }
  //   };

  //   if (streamSocket) {
  //     streamSocket.on('viewer_update', (data: ViewerUpdateData) => {
  //       if (data.streamId === streamId) {
  //         setViewerCount(data.viewerCount);
  //       }
  //     });
  //   }

  //   joinStream();

  //   const handleBeforeUnload = () => {
  //     leaveStream();
  //   };
  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     leaveStream();
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     if (streamSocket) {
  //       streamSocket.off('viewer_update');
  //     }
  //   };
  // }, [streamSocket, streamId, ownUser?.id]);

  useEffect(() => {
    // const joinStream = () => {
    //   if (streamSocket && streamId && ownUser?.id) {
    //     console.log('Joining stream:', streamId, 'User:', ownUser.id);
    //     streamSocket.emit('join_stream', {
    //       streamId,
    //       userId: ownUser.id
    //     });
    //   }
    // };
    const joinStream = () => {
      if (streamSocket && streamId && ownUser?.id) {
        console.log('Joining stream:', streamId, 'User:', ownUser.id);
        streamSocket.emit('join_stream', {
          streamId,
          userId: ownUser.id,
          displayName: ownUser.displayName,
          profileImage: ownUser.profileImage || '/api/placeholder/100/100'
        });
      }
    };
    const leaveStream = () => {
      if (streamSocket && streamId && ownUser?.id) {
        console.log('Leaving stream:', streamId, 'User:', ownUser.id);
        streamSocket.emit('leave_stream', {
          streamId,
          userId: ownUser.id
        });
      }
    };

    if (streamSocket) {
      // Handle socket connection events
      streamSocket.on('connect', () => {
        console.log('Socket connected');
        setIsSocketConnected(true);
        joinStream(); // Join stream when socket connects
      });

      streamSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsSocketConnected(false);
      });

      // Handle viewer count updates
      streamSocket.on('viewer_update', (data: ViewerUpdateData) => {
        console.log('Received viewer update:', data);
        if (data.streamId === streamId) {
          setViewerCount(data.viewerCount);
        }
      });

      // If socket is already connected, join immediately
      if (streamSocket.connected) {
        setIsSocketConnected(true);
        joinStream();
      }
    }

    // Cleanup function
    return () => {
      if (streamSocket) {
        leaveStream();
        streamSocket.off('connect');
        streamSocket.off('disconnect');
        streamSocket.off('viewer_update');
      }
    };
  }, [streamSocket, streamId, ownUser?.id]);


  // useEffect(() => {
  //   if (streamSocket && streamId) {
  //     streamSocket.on('new_comment', (commentData: CommentSocketData) => {
  //       console.log("commentData...", commentData)
  //       if (commentData.streamId === streamId) {
  //         setComments(prevComments => {
  //           const newComment: CommentType = {
  //             streamId: commentData.streamId,
  //             user: commentData.user,
  //             comment: commentData.comment,
  //             timestamp: commentData.timestamp,
  //             error: false
  //           };

  //           return [...prevComments, newComment].sort(
  //             (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  //           );
  //         });
  //       }
  //     });

  //     streamSocket.on('user_joined_stream', (joinData: StreamJoinNotification) => {
  //       const notification: JoinNotification = {
  //         streamId: joinData.streamId,
  //         user: {
  //           userId: joinData.user.userId,
  //           displayName: joinData.user.displayName,
  //           profileImage: joinData.user.profileImage
  //         },
  //         comment: `${joinData.user.displayName} joined the stream`,
  //         timestamp: joinData.timestamp,
  //         type: 'join'
  //       };

  //       setComments(prevComments => {
  //         const newComments = [...prevComments, notification].sort(
  //           (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  //         );
  //         return newComments;
  //       });
  //     });


  //     streamSocket.on('reaction_update', (data: ReactionUpdateData) => {
  //       if (data.streamId === streamId) {
  //         setStreamData(prevData => ({
  //           ...prevData,
  //           status: data.status
  //         }));
  //       }
  //     });

  //     return () => {
  //       streamSocket.off('new_comment');
  //       streamSocket.off('reaction_update');
  //       streamSocket.off('user_joined_stream');
  //     };
  //   }
  // }, [streamSocket, streamId]);

  useEffect(() => {
    if (streamSocket && streamId) {
      streamSocket.on('new_comment', (commentData: CommentSocketData) => {
        if (commentData.streamId === streamId) {
          setComments(prevComments => {
            const newComment: CommentType = {
              streamId: commentData.streamId,
              user: commentData.user,
              comment: commentData.comment,
              timestamp: commentData.timestamp,
              error: false
            };

            return [...prevComments, newComment].sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
          });
        }
      });

      // Update the user_joined_stream handler
      streamSocket.on('user_joined_stream', (joinData: StreamJoinNotification) => {
        console.log('Received join notification:', joinData);

        const notification: JoinNotification = {
          streamId: joinData.streamId,
          user: {
            userId: joinData.user.userId,
            displayName: joinData.user.displayName,
            profileImage: joinData.user.profileImage
          },
          comment: `${joinData.user.displayName} joined the stream`,
          timestamp: joinData.timestamp,
          type: 'join'
        };

        setComments(prevComments => {
          const newComments = [...prevComments, notification].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          return newComments;
        });
      });

      return () => {
        streamSocket.off('new_comment');
        streamSocket.off('user_joined_stream');
      };
    }
  }, [streamSocket, streamId]);

  // useEffect(() => {
  //   const fetchStreamAndReaction = async () => {
  //     try {
  //       setLoading(true);
  //       setIsLoading(true);

  //       // Fetch stream data
  //       const [streamResponse, reactionResponse] = await Promise.all([
  //         axiosInstance.get(`streaming/get-steam-key/${streamId}`),
  //         ownUser?.id ? axiosInstance.get(`streaming/reaction/${ownUser.id}/${streamId}`) : null
  //       ]);
  //       console.log('Reaction Response:', reactionResponse);
  //       const fetchedStreamData: StreamDto = {
  //         ...streamResponse.data,
  //         user: {
  //           ...streamResponse.data.user,
  //           profileImage: streamResponse.data.user.profileImage || '/api/placeholder/100/100'
  //         },
  //         status: streamResponse.data.status || {
  //           likes: 0,
  //           dislikes: 0,
  //           views: 0
  //         }
  //       };
  //       console.log("streamResponse", streamResponse)
  //       setStreamKey(streamResponse.data.streamKey)
  //       setStreamData(fetchedStreamData);

  //       if (reactionResponse?.data) {
  //         const currentReaction = reactionResponse.data;
  //         setUserReaction(currentReaction);
  //         setIsLiked(currentReaction === 'like');
  //         setIsDisliked(currentReaction === 'dislike');
  //       } else {
  //         // Reset reaction states if no reaction data
  //         setUserReaction(null);
  //         setIsLiked(false);
  //         setIsDisliked(false);
  //       }

  //       const commentsResponse = await axiosInstance.get(`streaming/get-stream-comments/${streamId}`);
  //       console.log("commentsResponse.data", commentsResponse.data)
  //       const fetchedComments: CommentType[] = commentsResponse.data
  //         .sort((a: CommentType, b: CommentType) =>
  //           new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  //         );

  //       setComments((prevComments) => {
  //         const commentMap = new Map(prevComments.map((c) => [c.timestamp, c]));
  //         fetchedComments.forEach((comment) => {
  //           if (!commentMap.has(comment.timestamp)) {
  //             commentMap.set(comment.timestamp, comment);
  //           }
  //         });

  //         return Array.from(commentMap.values())
  //           .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  //       });
  //       setError(null);

  //       if (streamResponse.data.user.id) {
  //         const followStatusResult = await axiosInstance.get(
  //           `user/followerStatus/${ownUser?.id}/user/${streamResponse.data.user.id}`
  //         );
  //         console.log("followStatusResult", followStatusResult)
  //         setFollowStatus(followStatusResult.data.status);
  //       } else {
  //         console.log("User id not present")
  //       }
  //     } catch (error) {
  //       console.error('Stream fetch error:', error);
  //       setError('Failed to load stream. Please try again later.');
  //       toast.error('Failed to show the stream');
  //     } finally {
  //       setLoading(false);
  //       setIsLoading(false);
  //     }
  //   };

  //   if (streamId) {
  //     fetchStreamAndReaction();
  //   }
  // }, [streamId, ownUser?.id, setLoading]);

  useEffect(() => {
    const fetchStreamAndReaction = async () => {
      try {
        setLoading(true);
        setIsLoading(true);

        // Fetch stream data
        const [streamResponse, reactionResponse] = await Promise.all([
          axiosInstance.get(`streaming/get-steam-key/${streamId}`),
          ownUser?.id ? axiosInstance.get(`streaming/reaction/${ownUser.id}/${streamId}`) : null
        ]);
        console.log('Reaction Response:', reactionResponse);
        const fetchedStreamData: StreamDto = {
          ...streamResponse.data,
          user: {
            ...streamResponse.data.user,
            profileImage: streamResponse.data.user.profileImage || '/api/placeholder/100/100'
          },
          status: streamResponse.data.status || {
            likes: 0,
            dislikes: 0,
            views: 0
          }
        };
        console.log("streamResponse", streamResponse)
        setStreamKey(streamResponse.data.streamKey)
        setStreamData(fetchedStreamData);

        if (streamResponse.data.viewerCount) {
          setViewerCount({
            currentViewers: streamResponse.data.viewerCount.currentViewers || 0,
            totalUniqueViewers: streamResponse.data.viewerCount.totalUniqueViewers || 0
          });
        }

        if (reactionResponse?.data) {
          const currentReaction = reactionResponse.data;
          setUserReaction(currentReaction);
          setIsLiked(currentReaction === 'like');
          setIsDisliked(currentReaction === 'dislike');
        } else {
          // Reset reaction states if no reaction data
          setUserReaction(null);
          setIsLiked(false);
          setIsDisliked(false);
        }

        const commentsResponse = await axiosInstance.get(`streaming/get-stream-comments/${streamId}`);
        console.log("commentsResponse.data", commentsResponse.data)
        const fetchedComments: CommentType[] = commentsResponse.data
          .sort((a: CommentType, b: CommentType) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

        setComments((prevComments) => {
          const commentMap = new Map(prevComments.map((c) => [c.timestamp, c]));
          fetchedComments.forEach((comment) => {
            if (!commentMap.has(comment.timestamp)) {
              commentMap.set(comment.timestamp, comment);
            }
          });

          return Array.from(commentMap.values())
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        });
        setError(null);

        if (streamResponse.data.user.id) {
          const followStatusResult = await axiosInstance.get(
            `user/followerStatus/${ownUser?.id}/user/${streamResponse.data.user.id}`
          );
          console.log("followStatusResult", followStatusResult)
          setFollowStatus(followStatusResult.data.status);
        } else {
          console.log("User id not present")
        }
      } catch (error) {
        console.error('Stream fetch error:', error);
        setError('Failed to load stream. Please try again later.');
        toast.error('Failed to show the stream');
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    if (streamId) {
      fetchStreamAndReaction();
    }
  }, [streamId, ownUser?.id, setLoading]);

  const handleFollow = async () => {
    try {
      const response = await axiosInstance.post(
        `user/follower/${ownUser?.id}/user/${streamData.user.id}`
      );
      if (response.data.status === "Requested") {
        setFollowStatus("Requested");
        toast.success("Follow request sent");
      } else if (response.data.status === "Accepted") {
        setFollowStatus("Accepted");
        toast.success("You are now following this user");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleUnfollow = async () => {
    try {
      await axiosInstance.delete(`user/follower/${ownUser?.id}/user/${streamData.user.id}`);
      setFollowStatus("NotFollowing");
      toast.success("Unfollowed successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleCancelRequest = async () => {
    try {
      await axiosInstance.delete(`user/follower/${ownUser?.id}/user/${streamData.user.id}`);
      setFollowStatus("NotFollowing");
      toast.success("Follow request cancelled");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsCancelRequestModalOpen(false);
    }
  };


  // const handleSendComment = () => {
  //   if (newComment.trim() && streamSocket && ownUser && ownUser.id) {
  //     const commentToAdd: CommentType = {
  //       streamId: streamId,
  //       user: {
  //         userId: ownUser.id,
  //         displayName: ownUser.displayName,
  //         profileImage: ownUser.profileImage
  //       },
  //       comment: newComment,
  //       timestamp: new Date().toISOString(),
  //       error: false
  //     };

  //     // Add comment to the end of the list
  //     setComments((prevComments) => {
  //       const updatedComments = [...prevComments, commentToAdd]
  //         .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  //       return updatedComments;
  //     });
  //     setNewComment('');

  //     try {
  //       streamSocket.emit('send_comment', commentToAdd, (response: CommentSocketResponse) => {
  //         if (!response || !response.success) {
  //           setComments((prevComments) =>
  //             prevComments.map((comment) =>
  //               comment.timestamp === commentToAdd.timestamp
  //                 ? { ...comment, error: true }
  //                 : comment
  //             )
  //           );
  //           toast.error('Failed to send comment');
  //         }
  //       });
  //     } catch (error) {
  //       console.error('Error sending comment:', error);
  //       setComments((prevComments) =>
  //         prevComments.map((comment) =>
  //           comment.timestamp === commentToAdd.timestamp
  //             ? { ...comment, error: true }
  //             : comment
  //         )
  //       );
  //       toast.error('Failed to send comment');
  //     }
  //   }
  // };



  const handleSendComment = () => {
    if (newComment.trim() && streamSocket && ownUser && ownUser.id) {
      const commentToAdd: CommentType = {
        streamId: streamId,
        user: {
          userId: ownUser.id,
          displayName: ownUser.displayName,
          profileImage: ownUser.profileImage
        },
        comment: newComment,
        timestamp: new Date().toISOString(),
        error: false
      };

      // Add comment optimistically
      // setComments((prevComments) => {
      //   const updatedComments = [...prevComments, commentToAdd]
      //     .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      //   return updatedComments;
      // });
      setNewComment('');

      // Emit with correct event name and proper error handling
      streamSocket.emit('new_comment', commentToAdd, (response: CommentSocketResponse) => {
        if (!response || !response.success) {
          console.error('Failed to send comment:', response?.message);
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.timestamp === commentToAdd.timestamp
                ? { ...comment, error: true }
                : comment
            )
          );
          toast.error(response?.message || 'Failed to send comment');
        }
      });
    }
  };


  const handleCommentKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendComment();
    }
  };


  const handleReaction = async (action: 'like' | 'dislike') => {
    if (!ownUser?.id || !streamId) return;

    // Declare variables outside of the try-catch block
    let newAction: 'like' | 'dislike' | 'remove';
    let previousReaction: ReactionType = userReaction as ReactionType; // Store current reaction
    const previousstatus: StatusType = { ...streamData.status! }; // Store current status

    try {
      // Optimistic update
      if (action === 'like') {
        newAction = isLiked ? 'remove' : 'like';
        setIsLiked(!isLiked);
        if (isDisliked) {
          setIsDisliked(false);
        }
      } else {
        newAction = isDisliked ? 'remove' : 'dislike';
        setIsDisliked(!isDisliked);
        if (isLiked) {
          setIsLiked(false);
        }
      }
      setUserReaction(newAction === 'remove' ? null : newAction);

      // Update status optimistically
      setStreamData(prev => {
        const newStatus = { ...prev.status! };
        if (previousReaction) {
          if (previousReaction === 'like') {
            newStatus.likes = Math.max(0, newStatus.likes - 1);
          } else if (previousReaction === 'dislike') {
            newStatus.dislikes = Math.max(0, newStatus.dislikes - 1);
          }
        }
        if (newAction !== 'remove') {
          if (newAction === 'like') {
            newStatus.likes += 1;
          } else if (newAction === 'dislike') {
            newStatus.dislikes += 1;
          }
        }
        return { ...prev, status: newStatus };
      });

      // Server request
      const response = await axiosInstance.post<{
        success: boolean;
        status: StatusType;
        userReaction: ReactionType;
      }>('streaming/reaction', {
        userId: ownUser.id,
        streamId: streamId,
        action: newAction
      });

      // Update with actual server data
      if (response.data.success) {
        setStreamData(prev => ({
          ...prev,
          status: response.data.status
        }));
        setUserReaction(response.data.userReaction);
        setIsLiked(response.data.userReaction === 'like');
        setIsDisliked(response.data.userReaction === 'dislike');
      } else {
        throw new Error('Failed to update reaction');
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to update reaction');

      // Revert all changes on error
      setIsLiked(previousReaction === 'like');
      setIsDisliked(previousReaction === 'dislike');
      setStreamData(prev => ({
        ...prev,
        status: previousstatus
      }));
      setUserReaction(previousReaction);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading stream...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream Player Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stream Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
            <StreamPlayer streamKey={streamKey} />
          </div>

          {/* Stream Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={streamData.user.profileImage}
                  alt={streamData.user.displayName}
                  className="w-16 h-16 rounded-full border-4 border-purple-500"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {streamData.user.displayName}
                  </h2>
                  <p className="text-gray-500 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    {(streamData.user.followers || 0).toLocaleString()} Followers
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                {ownUser?.id === streamData.user.id ? (
                  <></>
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
                  </Box>

                )}

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
                {/* <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition">
                  Follow
                </button> */}
                {/* <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                  Subscribe
                </button> */}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {streamData.title}
              </h3>
              <p className="text-gray-600">{streamData.description}</p>
            </div>

            {/* Stream Interactions */}
            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <div className="flex space-x-6">
                <button
                  onClick={() => handleReaction('like')}
                  className={`flex items-center transition ${isLiked ? 'text-red-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  {streamData.status?.likes || 0}
                </button>
                <button
                  onClick={() => handleReaction('dislike')}
                  className={`flex items-center transition ${isDisliked ? 'text-red-600' : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <ThumbsDown className="w-5 h-5 mr-2" />
                  {streamData.status?.dislikes || 0}
                </button>
              </div>
              {/* <div className="flex items-center space-x-4">
                <p className="text-gray-500">
                  {viewerCount.currentViewers.toLocaleString()} watching now
                </p>
                <p className="text-gray-500">
                  {viewerCount.totalUniqueViewers.toLocaleString()} total viewers
                </p>
              </div> */}
              <div className="flex items-center space-x-4">
                <p className="text-gray-500">
                  {isSocketConnected ? (
                    `${viewerCount.currentViewers.toLocaleString()} watching now`
                  ) : (
                    'Connecting...'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg h-[calc(100vh-11rem)] flex flex-col">
            <div className="flex items-center mb-4 border-b pb-4">
              <MessageCircle className="w-6 h-6 mr-2 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                Live Chat ({comments.length})
              </h3>
            </div>

            {/* Comments List - Removed overflow-y-auto and scroll-related classes */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
              {/* {comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 relative">
                  <img
                    src={comment.user.profileImage}
                    alt={comment.user.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">
                        {comment.user.displayName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-gray-700 text-sm ${comment.error ? 'text-red-500' : ''}`}>
                      {comment.comment}
                    </p>
                  </div>
                  {comment.error && (
                    <div
                      className="absolute -top-1 -right-8 text-red-500 group"
                      title="Failed to send comment"
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))} */}


              {/* {comments.map((comment, index) => (
  <div key={index} className="flex items-start space-x-3 relative">
    <img
      src={comment.user.profileImage}
      alt={comment.user.displayName}
      className="w-8 h-8 rounded-full"
    />
    <div className="flex-grow">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-sm">
          {comment.user.displayName}
        </span>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
        </span>
      </div>
      <p className={`text-sm ${
        (comment as JoinNotification).type === 'join' 
          ? 'text-purple-600 italic' 
          : 'text-gray-700'
      } ${comment.error ? 'text-red-500' : ''}`}>
        {comment.comment}
      </p>
    </div>
    {comment.error && (
      <div
        className="absolute -top-1 -right-8 text-red-500 group"
        title="Failed to send comment"
      >
        <AlertTriangle className="w-5 h-5" />
      </div>
    )}
  </div>
))} */}

              {comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 relative">
                  <img
                    src={comment.user.profileImage || '/api/placeholder/100/100'}
                    alt={comment.user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">
                        {comment.user.displayName || 'Anonymous User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    {/* <p className={`text-sm ${(comment as JoinNotification).type === 'join'
                        ? 'text-purple-600 italic'
                        : 'text-gray-700'
                      } ${comment.error ? 'text-red-500' : ''}`}>
                      {(comment as JoinNotification).type === 'join'
                        ? `${comment.user.displayName || 'Anonymous User'} joined the stream`
                        : comment.comment}
                    </p> */}
                    <p className={`text-sm ${(comment as JoinNotification).type === 'join'
                      ? 'text-purple-600 italic'
                      : 'text-gray-700'
                      } ${comment.error ? 'text-red-500' : ''}`}>
                      {(comment as JoinNotification).type === 'join'
                        ? 'Joined the stream'
                        : comment.comment}
                    </p>
                  </div>
                  {comment.error && (
                    <div
                      className="absolute -top-1 -right-8 text-red-500 group"
                      title="Failed to send comment"
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              {/* Invisible div for scrolling */}
              <div ref={commentsEndRef} />
            </div>

            {/* Comment Input */}
            <div className="mt-auto border-t pt-4">
              <div className="flex items-center space-x-2">
                <UserCircle2 className="w-10 h-10 text-gray-400" />
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleCommentKeyPress}
                  className="flex-grow bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendComment}
                  className="bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamViewPage;

