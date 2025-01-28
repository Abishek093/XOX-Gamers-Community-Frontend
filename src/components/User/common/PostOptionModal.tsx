import React, { useEffect, useState } from 'react';
import { GoReport } from "react-icons/go";
import DescriptionModal from '../../Common/DescriptionModal';
import { GoogleUser, UserData, UserDetails } from '../../../interfaces/userInterfaces/apiInterfaces';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../Slices/userSlice/userSlice';
import axiosInstance from '../../../services/userServices/axiosInstance';
import ReportModal from '../../Common/ReportModal';
import ConfirmationModal from '../../Common/ConfirmationModal'; // Import your ConfirmationModal component
import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';

interface PostOptionModalProps {
  user: UserData | GoogleUser | UserDetails | null;
  postId: string;
  onClose: () => void;
  updatePost: (description: string, croppedImage: string | null) => void;
  reportPost: (reason: string) => void;
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  reportModal: boolean;
  setReportModal: React.Dispatch<React.SetStateAction<boolean>>;
  removePost: (postId: string) => void;
}


const PostOptionModal: React.FC<PostOptionModalProps> = ({
  user,
  postId,
  onClose,
  updatePost,
  reportPost,
  editModal,
  setEditModal,
  reportModal,
  setReportModal,
  removePost
}) => {
  const [post, setPost] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 
  const ownUser = useAppSelector(selectUser);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`content/posts/fetch-post-details/${postId}`);
        console.log(response);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDeletePost = async () => {
    try {
      await axiosInstance.delete(`content/posts/delete-post/${postId}`);
      toast.success("Post deleted successfully")
      setShowDeleteConfirmation(false)
      onClose()     
      removePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  // const handleDeletePost = async () => {
  //   try {
  //     await axiosInstance.delete(`delete-post/${postId}`);
  //     toast.success("Post deleted successfully");
  
  //     setShowDeleteConfirmation(false);
  //     onClose();
  
  //     // Chain navigation after the state updates
  //     axiosInstance.delete(`delete-post/${postId}`)
  //       .then(() => {
  //         // Ensure the state has updated and then navigate
  //         navigate(`/${ownUser?.username}`);
  //       })
  //       .catch((error) => {
  //         console.error("Error during navigation:", error);
  //       });
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     toast.error("Failed to delete the post");
  //   }
  // };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div
        className="relative w-80 bg-white rounded-lg flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex flex-col w-full">
          {ownUser?.username === user?.username && (
            <>
              <li className="flex justify-center items-center p-4 cursor-pointer hover:bg-gray-100" onClick={() => { setEditModal(true) }}>
                Edit Post
              </li>
              <li className="flex justify-center items-center p-4 cursor-pointer hover:bg-gray-100" onClick={() => { setShowDeleteConfirmation(true) }}>
                Delete Post
              </li>
            </>
          )}
          <li className="flex justify-center items-center p-4 cursor-pointer hover:bg-gray-100 text-red-600" onClick={() => { setReportModal(true) }}>
            <GoReport className='mr-2' />
            Report Post
          </li>
        </ul>
      </div>
      {editModal && (
        <DescriptionModal
          descriptionProps={post?.title}
          isOpen={editModal}
          croppedImage={post?.content}
          onClose={() => setEditModal(false)}
          onSubmit={updatePost}
        />
      )}
      {reportModal && (
        <ReportModal
          isOpen={reportModal}
          onClose={() => setReportModal(false)}
          onSubmit={reportPost}
        />
      )}
      {showDeleteConfirmation && (
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeletePost}
          message="Are you sure you want to delete this post?"
        />
      )}
    </div>
  );
};

export default PostOptionModal;
