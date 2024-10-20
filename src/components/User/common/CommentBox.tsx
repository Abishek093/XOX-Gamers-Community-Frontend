import React, { useState, useRef, useEffect } from 'react';
import { IoIosSend } from 'react-icons/io';
import Picker, { EmojiClickData } from 'emoji-picker-react';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../../services/userServices/axiosInstance';
import { toast } from 'sonner';
import * as Yup from 'yup';
import CommentSection from './CommentSection';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../Slices/userSlice/userSlice';

const commentSchema = Yup.object().shape({
  comment: Yup.string()
    .trim()
    .min(1, 'Comment cannot be empty!')
    .max(500, 'Comment cannot exceed 500 characters')
    .required('Comment is required'),
});

interface CommentBoxProps {
  postId: string;
  userId: string;
  onClose: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId, userId, onClose }) => {
  const [chosenEmoji, setChosenEmoji] = useState(false);
  const [value, setValue] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const ownUser = useAppSelector(selectUser);
  
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const API_URL = import.meta.env.VITE_USER_API_URL;

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setValue((prevInput) => prevInput + emojiObject.emoji);
    setChosenEmoji(false);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await axiosInstance.get(`${API_URL}fetch-comments/${postId}`);
        setComments(comments.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId, API_URL]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 5 * 24)}px`;
    }
  }, [value]);

  const validateAndSend = async () => {
    try {
      await commentSchema.validate({ comment: value });
      const response = await axiosInstance.post(`${API_URL}add-comment`, {
        postId,
        userId,
        comment: value,
      });
      toast('Comment added successfully');
      setValue('');
      setComments((prevComments) => [response.data, ...prevComments]);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        alert(error.message);
      } else {
        console.error('Error sending comment:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-1/2 h-3/4 bg-white rounded-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-black z-10" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="w-full h-14 border border-gray-400 rounded-md">
          <div className="flex items-center justify-start text-black font-semibold h-full pl-4">Comments</div>
        </div>
        <CommentSection comments={comments} setComments={setComments} /> {/* Pass setComments */}
        <div className="w-full border-t border-gray-300 mt-auto relative">
          <SentimentVerySatisfiedOutlinedIcon
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setChosenEmoji(!chosenEmoji)}
          />
          <textarea
            ref={textareaRef}
            className="border w-full rounded-md flex p-3 mb-1 pl-10 pr-10 resize-none overflow-auto"
            placeholder="Add a comment..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={1}
            style={{
              paddingLeft: '36px',
              paddingRight: '36px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          />
          <IoIosSend
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            size={24}
            style={{ right: '8px' }}
            onClick={validateAndSend}
          />
          {chosenEmoji && (
            <div
              style={{
                position: 'absolute',
                bottom: '50px',
                left: '0px',
                zIndex: 1000,
              }}
            >
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
