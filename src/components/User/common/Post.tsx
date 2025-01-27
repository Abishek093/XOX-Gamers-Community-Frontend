    import React, { useEffect, useState } from 'react';
    import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Avatar } from '@mui/material';
    import { GoogleUser, UserData, UserDetails } from '../../../interfaces/userInterfaces/apiInterfaces';
    import { SlGameController } from 'react-icons/sl';
    import { GoCommentDiscussion } from 'react-icons/go';
    import axiosInstance from '../../../services/userServices/axiosInstance';
    import CommentBox from './CommentBox';
    import { useAppSelector } from '../../../store/hooks';
    import { selectUser } from '../../../Slices/userSlice/userSlice';
    import { BsThreeDotsVertical } from 'react-icons/bs';
    import PostOptionModal from './PostOptionModal';
    import { toast } from 'sonner';
    import { useSockets } from '../../../context/socketContext'; 

    const styles = {
      largeIcon: {
        width: 25,
        height: 25,
      },
      buttonStyle: {
        color: 'red',
        marginRight: -2,  
      },
    };

    interface PostProps {
      user: UserData | GoogleUser | UserDetails | null;
      post: {
        _id: string;
        title: string;
        content: string;
        createdAt: string;
        likeCount: number;
      };
      removePost: (postId: string) => void;
    }

    interface PostLikeUpdate {
      likeCount: number;
      likedByUsers: string[];
    }

    const Post: React.FC<PostProps> = ({ post, user, removePost }) => {

      const { contentSocket } = useSockets();


      const [isLiked, setIsLiked] = useState(false);
      const [isOpen, setIsOpen] = useState(false);
      const [optionMenu, setOptionMenu] = useState(false)
      const [editModal, setEditModal] = useState(false)   
      const [reportModal, setReportModal] = useState(false)
      const ownUser = useAppSelector(selectUser);
      const userId = ownUser?.id;
      const [likeCount, setLikeCount]= useState(post.likeCount)

      // useEffect(() => {
      //   if (contentSocket) {
      //     // Join post room on mount
      //     contentSocket.emit('join_post', post._id);
    
      //     // Listen for like updates for this specific post
      //     contentSocket.on(`post_like_update_${post._id}`, (data: { likeCount: number, liked: boolean, userId: string }) => {
      //       setLikeCount(data.likeCount);
      //       // Update isLiked only if the action was performed by the current user
      //       if (data.userId === ownUser?.id) {
      //         setIsLiked(data.liked);
      //       }
      //     });
      //   }
    
      //   return () => {
      //     if (contentSocket) {
      //       // Leave post room on unmount
      //       contentSocket.emit('leave_post', post._id);
      //       contentSocket.off(`post_like_update_${post._id}`);
      //     }
      //   };
      // }, [contentSocket, post._id, ownUser?.id]);

      const API_URL = import.meta.env.VITE_CONTENT_SERVICE_API_URL;
      // useEffect(() => {
      //   const checkLikeStatus = async () => {
      //     const PostId = post._id;
      //     const UserId = ownUser?.id;
      //     try {
      //       const response = await axiosInstance.post(`${API_URL}posts/check-like`, { postId: PostId, userId: UserId });
      //       setIsLiked(response.data.liked);
      //     } catch (error) {
      //       console.error('Error checking like status:', error);
      //     }
      //   };

      //   checkLikeStatus();
      // }, [post._id, ownUser?.id, API_URL]);

      // // const handleLikeClick = async () => {
      // //   try {
      // //     const action = isLiked ? 'unlike' : 'like';
      // //     await axiosInstance.post(`${API_URL}posts/${action}-post`, {
      // //       userId: ownUser?.id,
      // //       postId: post._id,
      // //     });
      // //     setIsLiked(!isLiked);
      // //   } catch (error) {
      // //     console.error(`Error ${isLiked ? 'unliking' : 'liking'} the post`, error);
      // //   }
      // // };
      // const handleLikeClick = async () => {
      //   try {
      //     const action = isLiked ? 'unlike' : 'like';
          
      //     // Optimistic update
      //     setIsLiked(!isLiked);
      //     setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
      //     await axiosInstance.post(`${API_URL}posts/${action}-post`, {
      //       userId: ownUser?.id,
      //       postId: post._id,
      //     });
          
      //     // Emit socket event for real-time updates
      //     contentSocket?.emit('post_like_action', {
      //       postId: post._id,
      //       userId: ownUser?.id,
      //       action: action
      //     });
      //   } catch (error) {
      //     // Revert optimistic update on error
      //     setIsLiked(isLiked);
      //     setLikeCount(likeCount);
      //     console.error(`Error ${isLiked ? 'unliking' : 'liking'} the post`, error);
      //   }
      // };

      useEffect(() => {
        if (contentSocket) {
          // Join post room on mount
          contentSocket.emit('join_post', post._id);
    
          // Add proper type checking and error handling
          contentSocket.on(`post_like_update_${post._id}`, (data: PostLikeUpdate) => {
            console.log("Received socket update:", data); // Debug log
            
            if (data && typeof data.likeCount === 'number') {
              setLikeCount(data.likeCount);
            }
            
            // Safe check for likedByUsers array
            if (data && Array.isArray(data.likedByUsers) && ownUser?.id) {
              setIsLiked(data.likedByUsers.includes(ownUser.id));
            }
          });
        }
    
        return () => {
          if (contentSocket) {
            contentSocket.emit('leave_post', post._id);
            contentSocket.off(`post_like_update_${post._id}`);
          }
        };
      }, [contentSocket, post._id, ownUser?.id]);
    
      // Initial like status check
      useEffect(() => {
        const checkLikeStatus = async () => {
          try {
            const response = await axiosInstance.post(`${API_URL}posts/check-like`, { 
              postId: post._id, 
              userId: ownUser?.id 
            });
            setIsLiked(response.data.liked);
          } catch (error) {
            console.error('Error checking like status:', error);
          }
        };
    
        if (ownUser?.id) {
          checkLikeStatus();
        }
      }, [post._id, ownUser?.id]);
    
      const handleLikeClick = async () => {
        if (!ownUser?.id) return;
    
        try {
          const action = isLiked ? 'unlike' : 'like';
          
          // Optimistic update
          setIsLiked(!isLiked);
          setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
          await axiosInstance.post(`${API_URL}posts/${action}-post`, {
            userId: ownUser.id,
            postId: post._id,
          });
    
          // Emit socket event for real-time updates
          if (contentSocket) {
            contentSocket.emit('post_like_action', {
              postId: post._id,
              userId: ownUser.id,
              action: action
            });
          }
        } catch (error) {
          // Revert optimistic update on error
          setIsLiked(isLiked);
          setLikeCount(likeCount);
          console.error(`Error ${isLiked ? 'unliking' : 'liking'} the post`, error);
        }
      };


      const handleUpdatPost = async(description: string, croppedImage: string|null) =>{
        const postId = post._id
        const response = await axiosInstance.post(`content/posts/update-post`,{postId, description, croppedImage})
        console.log(response)
      }


      const handleReportSubmit = async (reason: string) =>{
        try {
          const postId = post._id
          const userId = ownUser?.id;
          await axiosInstance.post(`content/posts/report-post`,{userId, postId, reason})
            setReportModal(false)
            setOptionMenu(false)
            toast.success('Report addes successfully')
        } catch (error:any) {
          toast.error(error.message)
        }
      }

      return (
        <Card sx={{ maxWidth: 'full', maxHeight: 'auto', margin: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar aria-label="user-avatar" src={user?.profileImage} />
              <Box sx={{ marginLeft: 2 }}>
                <Typography variant="subtitle1">{user?.displayName}</Typography>
                <Typography variant="body2" color="textSecondary">{new Date(post.createdAt).toLocaleDateString()}</Typography>
              </Box>
            </Box>
            <BsThreeDotsVertical onClick={() => { setOptionMenu(true) }} />
          </Box>
          <CardMedia
            component="img"
            sx={{ height: 400, width: 'auto', margin: '0 auto' }}
            image={post.content}
            title={post.title}
          />
          <CardContent>
            <Typography variant="body2" color="black" component="p">
              {post.title}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                aria-label="like"
                startIcon={<SlGameController style={styles.largeIcon} />}
                sx={{ color: isLiked ? 'red' : '', marginRight: -2 }}
                onClick={handleLikeClick}
              />
              <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2 }}>
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </Typography>
            </Box>
            <Button
              onClick={() => setIsOpen(true)}
              aria-label="comment"      
              startIcon={<GoCommentDiscussion style={styles.largeIcon} />}
            />
          </CardActions>
          {isOpen && userId && (
            <CommentBox
              postId={post._id}
              userId={userId}
              onClose={() => setIsOpen(false)}
            />
          )}
          {
            optionMenu && (
              <PostOptionModal
                user = {user}
                postId = {post._id}
                onClose={() => { setOptionMenu(false) }}
                updatePost = {handleUpdatPost}
                reportPost = {handleReportSubmit}
                editModal = {editModal}
                setEditModal = {setEditModal}
                reportModal = {reportModal}
                setReportModal = {setReportModal}
                removePost = {removePost}
              />
            )
          }
        </Card> 
      );
    };

    export default Post;

    // import React, { useEffect, useState } from 'react';
    // import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Avatar } from '@mui/material';
    // import { GoogleUser, UserData, UserDetails } from '../../../interfaces/userInterfaces/apiInterfaces';
    // import { SlGameController } from 'react-icons/sl';
    // import { GoCommentDiscussion } from 'react-icons/go';
    // import axiosInstance from '../../../services/userServices/axiosInstance';
    // import CommentBox from './CommentBox';
    // import { useAppSelector } from '../../../store/hooks';
    // import { selectUser } from '../../../Slices/userSlice/userSlice';
    // import { BsThreeDotsVertical } from 'react-icons/bs';
    // import PostOptionModal from './PostOptionModal';
    // import { toast } from 'sonner';
    // import { useSocket } from '../../../context/socketContext'; // Import the useSocket hook
    
    // const styles = {
    //   largeIcon: {
    //     width: 25,
    //     height: 25,
    //   },
    //   buttonStyle: {
    //     color: 'red',
    //     marginRight: -2,  
    //   },
    // };
    
    // interface PostProps {
    //   user: UserData | GoogleUser | UserDetails | null;
    //   post: {
    //     _id: string;
    //     title: string;
    //     content: string;
    //     createdAt: string;
    //     likeCount: number;
    //   };
    //   removePost: (postId: string) => void;
    // }
    
    // const Post: React.FC<PostProps> = ({ post, user, removePost }) => {
    //   const [isLiked, setIsLiked] = useState(false);
    //   const [likeCount, setLikeCount] = useState(post.likeCount); 
    //   const [isOpen, setIsOpen] = useState(false);
    //   const [optionMenu, setOptionMenu] = useState(false);
    //   const [editModal, setEditModal] = useState(false);
    //   const [reportModal, setReportModal] = useState(false);
    //   const ownUser = useAppSelector(selectUser);
    //   const userId = ownUser?.id;
    
    //   const API_URL = import.meta.env.VITE_USER_API_URL;
    //   const socket = useSocket(); // Initialize the socket connection
    
    //   useEffect(() => {
    //     const checkLikeStatus = async () => {
    //       const PostId = post._id;
    //       const UserId = ownUser?.id;
    //       try {
    //         const response = await axiosInstance.post(`${API_URL}check-like`, { postId: PostId, userId: UserId });
    //         setIsLiked(response.data.liked);
    //       } catch (error) {
    //         console.error('Error checking like status:', error);
    //       }
    //     };
    
    //     checkLikeStatus();
    //   }, [post._id, ownUser?.id, API_URL]);
    
    //   const handleLikeClick = async () => {
    //     try {
    //       const action = isLiked ? 'unlike' : 'like';
    //       await axiosInstance.post(`${API_URL}${action}-post`, {
    //         userId: ownUser?.id,
    //         postId: post._id,
    //       });
    //       setIsLiked(!isLiked);
    //       setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    //       socket.emit(action === 'like' ? 'likePost' : 'unlikePost', {
    //         postId: post._id,
    //         likeCount: isLiked ? likeCount - 1 : likeCount + 1,
    //       });
    //     } catch (error) {
    //       console.error(`Error ${isLiked ? 'unliking' : 'liking'} the post`, error);
    //     }
    //   };
    
    //   useEffect(() => {
    //     if (!socket) return;
    
    //     const handleLikePost = (data: { postId: string; likeCount: number }) => {
    //       if (data.postId === post._id) {
    //         setLikeCount(data.likeCount);
    //       }
    //     };
    
    //     const handleUnlikePost = (data: { postId: string; likeCount: number }) => {
    //       if (data.postId === post._id) {
    //         setLikeCount(data.likeCount);
    //       }
    //     };
    
    //     socket.on('likePost', handleLikePost);
    //     socket.on('unlikePost', handleUnlikePost);
    
    //     return () => {
    //       socket.off('likePost', handleLikePost);
    //       socket.off('unlikePost', handleUnlikePost);
    //     };
    //   }, [socket, post._id]);
    
    //   const handleUpdatPost = async (description: string, croppedImage: string | null) => {
    //     const postId = post._id;
    //     const response = await axiosInstance.post(`update-post`, { postId, description, croppedImage });
    //     console.log(response);
    //   };
    
    //   const handleReportSubmit = async (reason: string) => {
    //     try {
    //       const postId = post._id;
    //       const userId = ownUser?.id;
    //       const response = await axiosInstance.post(`report-post`, { userId, postId, reason });
    //       setReportModal(false);
    //       setOptionMenu(false);
    //       toast.success('Report added successfully');
    //     } catch (error: any) {
    //       toast.error(error.message);
    //     }
    //   };
    
    //   return (
    //     <Card sx={{ maxWidth: 'full', maxHeight: 'auto', margin: 'auto' }}>
    //       <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, justifyContent: 'space-between' }}>
    //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //           <Avatar aria-label="user-avatar" src={user?.profileImage} />
    //           <Box sx={{ marginLeft: 2 }}>
    //             <Typography variant="subtitle1">{user?.displayName}</Typography>
    //             <Typography variant="body2" color="textSecondary">
    //               {new Date(post.createdAt).toLocaleDateString()}
    //             </Typography>
    //           </Box>
    //         </Box>
    //         <BsThreeDotsVertical onClick={() => { setOptionMenu(true) }} />
    //       </Box>
    //       <CardMedia
    //         component="img"
    //         sx={{ height: 400, width: 'auto', margin: '0 auto' }}
    //         image={post.content}
    //         title={post.title}
    //       />
    //       <CardContent>
    //         <Typography variant="body2" color="black" component="p">
    //           {post.title}
    //         </Typography>
    //       </CardContent>
    //       <CardActions disableSpacing>
    //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //           <Button
    //             aria-label="like"
    //             startIcon={<SlGameController style={styles.largeIcon} />}
    //             sx={{ color: isLiked ? 'red' : '', marginRight: -2 }}
    //             onClick={handleLikeClick}
    //           />
    //           <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2 }}>
    //             {likeCount} {likeCount === 1 ? 'like' : 'likes'}
    //           </Typography>
    //         </Box>
    //         <Button
    //           onClick={() => setIsOpen(true)}
    //           aria-label="comment"
    //           startIcon={<GoCommentDiscussion style={styles.largeIcon} />}
    //         />
    //       </CardActions>
    //       {isOpen && userId && (
    //         <CommentBox
    //           postId={post._id}
    //           userId={userId}
    //           onClose={() => setIsOpen(false)}
    //         />
    //       )}
    //       {
    //         optionMenu && (
    //           <PostOptionModal
    //             user={user}
    //             postId={post._id}
    //             onClose={() => { setOptionMenu(false) }}
    //             updatePost={handleUpdatPost}
    //             reportPost={handleReportSubmit}
    //             editModal={editModal}
    //             setEditModal={setEditModal}
    //             reportModal={reportModal}
    //             setReportModal={setReportModal}
    //             removePost={removePost}
    //           />
    //         )
    //       }
    //     </Card>
    //   );
    // };
    
    // export default Post;
    