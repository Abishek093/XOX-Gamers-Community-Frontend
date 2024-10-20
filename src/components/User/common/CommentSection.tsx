import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../Slices/userSlice/userSlice';
import { GoReport } from 'react-icons/go';
import axiosInstance from '../../../services/userServices/axiosInstance';
import { toast } from 'sonner';

interface CommentSectionProps {
  comments: any[];
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, setComments }) => {
  const ownUser = useAppSelector(selectUser);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  const handleEdit = (comment: any) => {
    setIsEditing(comment._id);
    setEditContent(comment.content);
    setActiveMenu(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId: string) => {
    try {
      await axiosInstance.put(`update-comment/${commentId}`, { content: editContent });
      toast.success('Comment updated successfully');
      setIsEditing(null);

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, content: editContent } : comment
        )
      );
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const toggleMenu = (commentId: string) => {
    setActiveMenu(activeMenu === commentId ? null : commentId);
  };

  const handleDeleteClick = (commentId: string) => {
    setDeleteConfirmation(commentId);
    setActiveMenu(null);  
  };  

  const handleDeleteConfirm = async (commentId: string) => {
    try {
      const response = await axiosInstance.delete(`deleteComment/${commentId}`);
      if (response.status === 200) {
        toast.success('Comment deleted successfully');
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteCancel = () => {  
    setDeleteConfirmation(null);
  };

  return (
    <div className="flex-grow overflow-auto p-4">
      {comments.map((comment) => (
        <div key={comment._id} className="mb-4 bg-white rounded-lg shadow p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start">
              <img
                src={comment.userDetails?.profileImage || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div className="font-semibold">{comment.userDetails?.displayName || 'Unknown User'}</div>
                {isEditing === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full mb-2 p-2 border rounded-md"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleSaveEdit(comment._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 break-words mt-1">{comment.content}</div>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {comment.author === ownUser?.id && (
                <div className="relative">
                  <BsThreeDotsVertical
                    className="text-gray-500 cursor-pointer"
                    onClick={() => toggleMenu(comment._id)}
                  />
                  {activeMenu === comment._id && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                      >
                        Edit
                      </button>
                      <button
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleDeleteClick(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
              {comment.author !== ownUser?.id && (
                <GoReport
                  className="text-gray-500 cursor-pointer"
                  onClick={() => toast('Report functionality is not yet implemented.')}
                />
              )}
            </div>
          </div>
          {deleteConfirmation === comment._id && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-4">Are you sure you want to delete this comment?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleDeleteConfirm(comment._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;