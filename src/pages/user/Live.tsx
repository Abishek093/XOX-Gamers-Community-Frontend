import React, { useEffect, useRef, useState } from 'react';
import { Camera, Users, Gamepad2, Copy, Check, ThumbsUp, ThumbsDown, Send, UserCircle2, MessageCircle, AlertTriangle, StopCircle } from 'lucide-react';
import axiosInstance from '../../../src/services/userServices/axiosInstance';
import { getPresignedUrl, uploadImageToS3 } from '../../../src/Utils/imageUploadHelper';
import { useAppSelector } from '../../../src/store/hooks';
import { selectUser } from '../../../src/Slices/userSlice/userSlice';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useSockets } from '../../../src/context/socketContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/User/LivePage/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/User/LivePage/card';
import { Button } from '../../components/User/LivePage/button';
import { Input } from '../../components/User/LivePage/input';
import StreamPlayer from '../../../src/components/User/Live/StreamPlayer';
import { useLoading } from '../../context/LoadingContext';
// import { Loader2 } from 'lucide-react';

// interface UserDto {
//   id: string;
//   username: string;
//   displayName: string;
//   profileImage?: string;
//   followers?: number;
// }

// interface StreamDto {
//   id?: string;
//   title: string;
//   description: string;
//   game: string;
//   thumbnailUrl: string | null;
//   isLive: boolean;
//   user: UserDto;
//   streamKey: string;
//   status?: {
//     likes: number;
//     dislikes: number;
//     views: number;
//   };
// }

// interface CommentType {
//   streamId?: string;
//   user: {
//     userId: string;
//     displayName?: string;
//     profileImage?: string;
//   };
//   comment: string;
//   timestamp: Date | number | string;
//   error?: boolean;
// }

interface UserDto {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
  followers?: number;
}

interface StreamDto {
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
    userId: string;
    displayName?: string;
    profileImage?: string;
  };
  comment: string;
  timestamp: Date | number | string;
  error?: boolean;
}

interface ViewerCount {
  currentViewers: number;
  totalUniqueViewers: number;
}

type ReactionType = 'like' | 'dislike' | null;

interface GuidelineStep {
  image: string;
  text: string;
  description: string;
}

const guidelines: GuidelineStep[] = [
  {
    image: 'https://gamers-community.s3.us-east-1.amazonaws.com/step+1.jpeg',
    text: 'Open OBS Settings',
    description: 'Navigate to Settings in OBS Studio by clicking the Settings button in the controls panel.',
  },
  {
    image: 'https://gamers-community.s3.us-east-1.amazonaws.com/step+2.jpeg',
    text: 'Select Stream Service',
    description: 'In the Settings window, select "Stream" from the left sidebar and choose "Custom" from the service dropdown.',
  },
  {
    image: 'https://gamers-community.s3.us-east-1.amazonaws.com/step+3.jpeg',
    text: 'Enter Stream Server',
    description: 'Copy the server URL provided below and paste it into the "Server" field in OBS.',
  },
  {
    image: 'https://gamers-community.s3.us-east-1.amazonaws.com/step+4.jpeg',
    text: 'Set Stream Key',
    description: 'Copy your unique stream key provided below and paste it into the "Stream Key" field. Keep this key private.',
  },
];

const DEFAULT_STREAM: StreamDto = {
  title: '',
  description: '',
  game: '',
  thumbnailUrl: null,
  isLive: false,
  streamKey: '',
  user: {
    id: '',
    username: '',
    displayName: '',
    profileImage: '/api/placeholder/100/100',
    followers: 0
  },
  status: {
    likes: 0,
    dislikes: 0,
    views: 0
  }
};

const Live = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const { streamSocket } = useSockets();
  const { setLoading } = useLoading();

  const [streamData, setStreamData] = useState<StreamDto>(DEFAULT_STREAM);
  const [showError, setShowError] = useState(false);
  const [guidelineModal, setGuidelineModal] = useState(false);
  const [copiedServer, setCopiedServer] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [streamKey, setStreamKey] = useState('');
  const [streamServer, setStreamServer] = useState('');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');

  const API_URL = import.meta.env.VITE_STREAMING_SERVICE_API_URL;
  const ownUser = useAppSelector(selectUser);

  const [viewerCount, setViewerCount] = useState<ViewerCount>({
    currentViewers: 0,
    totalUniqueViewers: 0
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [userReaction, setUserReaction] = useState<ReactionType>(null);


  useEffect(() => {
    if (streamSocket && streamData.id) {
      // Viewer update listener
      streamSocket.on('viewer_update', (data: {
        streamId: string;
        viewerCount: ViewerCount
      }) => {
        if (data.streamId === streamData.id) {
          setViewerCount(data.viewerCount);
        }
      });

      // Reaction update listener
      streamSocket.on('reaction_update', (data: {
        streamId: string;
        status: StreamDto['status']
      }) => {
        if (data.streamId === streamData.id) {
          setStreamData(prevData => ({
            ...prevData,
            status: data.status
          }));
        }
      });

      return () => {
        streamSocket.off('viewer_update');
        streamSocket.off('reaction_update');
      };
    }
  }, [streamSocket, streamData.id]);

  const handleReaction = async (action: 'like' | 'dislike') => {
    if (!ownUser?.id || !streamData.id) return;

    let newAction: 'like' | 'dislike' | 'remove';
    let previousReaction: ReactionType = userReaction;
    const previousStatus = { ...streamData.status! };

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
        status: StreamDto['status'];
        userReaction: ReactionType;
      }>('streaming/reaction', {
        userId: ownUser.id,
        streamId: streamData.id,
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
        status: previousStatus
      }));
      setUserReaction(previousReaction);
    }
  };


  useEffect(() => {
    if (streamSocket && streamData.id) {
      streamSocket.on('new_comment', (commentData: CommentType) => {
        if (commentData.streamId === streamData.id) {
          setComments(prevComments => [...prevComments, commentData]
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          );
        }
      });

      streamSocket.on('reaction_update', (data: { streamId: string; status: StreamDto['status'] }) => {
        if (data.streamId === streamData.id) {
          setStreamData(prevData => ({
            ...prevData,
            status: data.status
          }));
        }
      });

      return () => {
        streamSocket.off('new_comment');
        streamSocket.off('reaction_update');
      };
    }
  }, [streamSocket, streamData.id]);

  useEffect(() => {
    const checkStreamStatus = async () => {
      try {
        if (ownUser?.id) {
          const response = await axiosInstance.get(`streaming/status/${ownUser.id}`);
          console.log("checkStreamStatus", response)
          if (response.data && response.data.isLive) {
            const streamDto: StreamDto = {
              ...response.data,
              user: {
                ...response.data.user,
                profileImage: response.data.user.profileImage || '/api/placeholder/100/100'
              },
              status: response.data.status || {
                likes: 0,
                dislikes: 0,
                views: 0
              }
            };
            setStreamData(streamDto);
            setIsSetupComplete(true);
            setStreamKey(response.data.streamKey);
            setStreamServer(response.data.streamServer);

            // Fetch comments if stream is live
            const commentsResponse = await axiosInstance.get(`streaming/get-stream-comments/${response.data.id}`);
            setComments(commentsResponse.data.sort((a: CommentType, b: CommentType) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            ));
          }
        }
      } catch (error) {
        console.error("Error checking stream status:", error);
      }
    };

    checkStreamStatus();
  }, [ownUser?.id]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const copyToClipboard = async (text: string, type: 'server' | 'key') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'server') {
        setCopiedServer(true);
        setTimeout(() => setCopiedServer(false), 2000);
      } else {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      }
      toast.success(`${type === 'server' ? 'Server URL' : 'Stream key'} copied to clipboard`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleStartStream = async () => {
    try {
      if (!streamData.title || !streamData.description) {
        setShowError(true);
        return;
      }
      setShowError(false);

      if (!ownUser?.id) {
        toast.error('Oops, something went wrong');
        return;
      }

      let thumbnailUrl: string | null = null;
      setLoading(true)
      if (fileInputRef.current?.files?.[0]) {
        const { uploadUrl, key } = await getPresignedUrl(ownUser.id, 'thumbnail', API_URL);
        await uploadImageToS3(uploadUrl, fileInputRef.current.files[0]);
        thumbnailUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${key}`;
      }

      const streamDataToSend = {
        userId: ownUser.id,
        title: streamData.title,
        description: streamData.description,
        game: streamData.game,
        thumbnailUrl,
      };

      const response = await axiosInstance.post('streaming/start-stream', streamDataToSend);
      console.log("Stream data response:", response)
      setStreamData(prevData => ({
        ...prevData,
        id: response.data.id,
        isLive: true,
        streamKey: response.data.streamKey,
        status: {
          likes: 0,
          dislikes: 0,
          views: 0
        }
      }));

      setStreamKey(response.data.streamKey);
      setStreamServer(response.data.streamServer);
      setGuidelineModal(true);
      setLoading(false)

    } catch (error) {
      console.error("Error starting stream:", error);
      toast.error('Failed to start stream');
    }
  };



  const handleStopStream = async () => {
    try {
      if (!streamData.id || !ownUser?.id) {
        console.log("streamData:", streamData, "ownUser?.id: ", ownUser?.id, "streamData.id:", streamData.id)
        toast.error('Unable to stop stream');
        return;
      }

      const response = await axiosInstance.post('streaming/stop-stream', {
        streamId: streamData.id,
        userId: ownUser.id
      });

      if (response.status === 200) {
        setStreamData(DEFAULT_STREAM);

        setIsSetupComplete(false);
        setStreamKey('');
        setStreamServer('');
        setComments([]);
        setShowError(false);
        setGuidelineModal(false);
        setNewComment('');
        setCopiedServer(false);
        setCopiedKey(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        toast.success('Stream ended successfully');
      } else {
        throw new Error('Failed to stop stream');
      }
    } catch (error) {
      console.error("Error stopping stream:", error);
      toast.error('Failed to stop stream');
    }
  };




  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStreamData(prevData => ({
          ...prevData,
          thumbnailUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendComment = () => {

    if (newComment.trim() && streamSocket && ownUser && streamData.id) {
      const commentToAdd: CommentType = {
        streamId: streamData.id,
        user: {
          userId: ownUser.id || 'Unknown User',
          displayName: ownUser.displayName,
          profileImage: ownUser.profileImage
        },
        comment: newComment,
        timestamp: new Date().toISOString(),
        error: false
      };

      setComments(prevComments => [...prevComments, commentToAdd]);
      setNewComment('');

      streamSocket.emit('send_comment', commentToAdd, (response: { success: boolean }) => {
        if (!response.success) {
          setComments(prevComments =>
            prevComments.map(comment =>
              comment.timestamp === commentToAdd.timestamp
                ? { ...comment, error: true }
                : comment
            )
          );
          toast.error('Failed to send comment');
        }
      });
    }
  };

  const handleSetupComplete = () => {
    setIsSetupComplete(true);
    setGuidelineModal(false);
  };

  return (
    <div className="min-h-screen bg-white text-white">
      <Dialog open={guidelineModal} modal>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Stream Setup Guidelines
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-4">
            {guidelines.map((guideline, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                      {index + 1}
                    </span>
                    <span>{guideline.text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{guideline.description}</p>
                  <img
                    src={guideline.image}
                    alt={guideline.text}
                    className="w-full rounded-lg border border-gray-700 shadow-lg"
                  />
                </CardContent>
              </Card>
            ))}

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Stream Connection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Stream Server</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value={streamServer}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(streamServer, 'server')}
                      className="shrink-0"
                    >
                      {copiedServer ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Stream Key</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      type="password"
                      value={streamKey}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(streamKey, 'key')}
                      className="shrink-0"
                    >
                      {copiedKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className='text-red-600'>Make these changes in the settings and start streaming.</p>

            <Button
              onClick={handleSetupComplete}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              I've Completed the Setup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showError && (
          <div className="mb-6 p-4 bg-red-500 border border-red-500 rounded-md">
            <p className="text-sm text-white">
              Please fill in all required fields before starting the stream.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stream Setup Form and Preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 shadow-xl rounded-lg p-6 space-y-6 border border-gray-700">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Stream Title *
                </label>
                <input
                  id="title"
                  type="text"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="What are you streaming today?"
                  value={streamData.title}
                  onChange={(e) => setStreamData({ ...streamData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Tell your viewers about your stream..."
                  value={streamData.description}
                  onChange={(e) => setStreamData({ ...streamData, description: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="game" className="block text-sm font-medium text-gray-300">
                  Game Name
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <Gamepad2 className="h-5 w-5 text-gray-400" />
                  <input
                    id="game"
                    type="text"
                    className="block w-full rounded-md bg-gray-700 border-gray-600 text-white px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="What game are you playing?"
                    value={streamData.game}
                    onChange={(e) => setStreamData({ ...streamData, game: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Stream Preview */}
            {streamData.isLive && isSetupComplete && (
              <div className="mt-6 bg-gray-800 shadow-xl rounded-lg p-6 border border-gray-700">
                <h2 className="text-lg font-medium text-white mb-4">Stream Preview</h2>
                <StreamPlayer streamKey={streamKey} />
              </div>
            )}
          </div>

          {/* Thumbnail, Stream Info, and Comments */}
          <div className="lg:col-span-1 space-y-6">
            {/* Thumbnail Upload */}
            <div className="bg-gray-800 shadow-xl rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-medium text-white mb-4">Stream Thumbnail</h2>
              <div
                className="w-full aspect-video bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors overflow-hidden"
                onClick={handleThumbnailClick}
              >
                {streamData.thumbnailUrl ? (
                  <img
                    src={streamData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-400">Click to upload thumbnail</p>
                    <p className="mt-1 text-xs text-gray-500">Recommended: 1920x1080px</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />
            </div>

            {/* Stream Info */}
            <div className="bg-gray-800 shadow-xl rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-medium text-white mb-4">Stream Info</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span>{viewerCount.currentViewers} viewers</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleReaction('like')}
                      className={`flex items-center transition ${isLiked ? 'text-red-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      {streamData.status?.likes || 0}
                    </button>
                    <button
                      onClick={() => handleReaction('dislike')}
                      className={`flex items-center transition ${isDisliked ? 'text-red-600' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                      <ThumbsDown className="h-5 w-5 mr-2" />
                      {streamData.status?.dislikes || 0}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleStartStream}
                    disabled={streamData.isLive}
                    className={`w-full py-3 ${streamData.isLive
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                      } text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2`}
                  >
                    <Camera className="h-5 w-5" />
                    <span>{streamData.isLive ? 'Streaming...' : 'Start Streaming'}</span>
                  </button>

                  {streamData.isLive && (
                    <button
                      onClick={handleStopStream}
                      className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
                    >
                      <StopCircle className="h-5 w-5" />
                      <span>Stop Streaming</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Chat */}
            {streamData.isLive && (
              <div className="bg-gray-800 shadow-xl rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <MessageCircle className="w-6 h-6 mr-2 text-red-500" />
                  <h3 className="text-xl font-semibold text-white">
                    Live Chat ({comments.length})
                  </h3>
                </div>

                <div className="h-[400px] flex flex-col">
                  <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {comments.map((comment, index) => (
                      <div key={index} className="flex items-start space-x-3 relative">
                        <img
                          src={comment.user.profileImage || '/api/placeholder/100/100'}
                          alt={comment.user.displayName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-white">
                              {comment.user.displayName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className={`text-gray-300 text-sm ${comment.error ? 'text-red-500' : ''}`}>
                            {comment.comment}
                          </p>
                        </div>
                        {comment.error && (
                          <div className="absolute -top-1 -right-8 text-red-500">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={commentsEndRef} />
                  </div>

                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <div className="flex items-center space-x-2">
                      <UserCircle2 className="w-10 h-10 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                        className="flex-grow bg-gray-700 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={handleSendComment}
                        className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Live;