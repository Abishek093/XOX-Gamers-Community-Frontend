
import React, { useEffect } from 'react';
import axiosInstance from '../../../services/userServices/axiosInstance';
import Post from './Post';
import { GoogleUser, UserData, UserDetails } from '../../../interfaces/userInterfaces/apiInterfaces';
// import { toast } from 'sonner';
// import { useSelector } from 'react-redux';
// import { selectUser } from '../../../Slices/userSlice/userSlice';

interface PostFeedProps {
  user: UserData | GoogleUser | UserDetails | null;
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  posts:any[];
  removePost: (postId: string) => void;
}

const PostFeed: React.FC<PostFeedProps> = ({ user, posts, setPosts, removePost }) => {
  // const ownUser = useSelector(selectUser)

  // useEffect(() => {
    // const socket = io('http://localhost:3000'); 

    // socket.on('post-liked', (data : any) => {
    //   const updatedPosts = posts.map(post => 
    //     post._id === data.postId ? { ...post, likeCount: post.likeCount + 1 } : post
    //   );
    //   setPosts(updatedPosts);
    // });
    // socket.on('post-liked', (data: any) => {
    //   const updatedPosts = posts.map(post => 
    //     post._id === data.postId ? { ...post, likeCount: post.likeCount + 1 } : post
    //   );
    //   setPosts(updatedPosts);

    //   // Show toast notification if the user is not the post owner
    //   if (ownUser && ownUser.username !== data.username) {
    //     toast(`${data.username} liked your post!`);
    //   }
    // });



    //     socket.on('post-unliked', (data : any) => {
    //   const updatedPosts = posts.map(post => 
    //     post._id === data.postId ? { ...post, likeCount: post.likeCount - 1 } : post
    //   );
    //   setPosts(updatedPosts);
    // });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [posts, setPosts]);

  useEffect(() => {
    const fetchPosts = async (userId: string) => {
      try {
        const response = await axiosInstance.get(`content/posts/fetch-posts/${userId}`);
        console.log("response: ",response)
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (user && user.id) {
      fetchPosts(user.id);
    }
  }, [user, setPosts]);

  return (
    <div>
      {posts.length > 0 ? ( 
        <div>
          {posts.map((post) => (
            <Post key={post._id} user={user} post={post} removePost={removePost} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[53vh] bg-white">
          <img
            src="https://gamers-community.s3.us-east-1.amazonaws.com/NoImages.png"
            alt="No content available"
            className="h-20"
          />
          <p className="mt-4 text-gray-600 text-md font-sans font-semibold">
            No posts yet!
          </p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
