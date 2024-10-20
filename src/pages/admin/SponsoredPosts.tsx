import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface SponsoredPost {
  _id: string;
  title: string;
  imageUrl: string;
  link: string;
}

const SponsoredPosts: React.FC = () => {
  const [posts, setPosts] = useState<SponsoredPost[]>([]);
  const [newPost, setNewPost] = useState({ title: '', imageUrl: '', link: '' });
  const [editingPost, setEditingPost] = useState<SponsoredPost | null>(null);

  useEffect(() => {
    fetchSponsoredPosts();
  }, []);

  const fetchSponsoredPosts = async () => {
    try {
      const { data } = await axios.get<SponsoredPost[]>('http://localhost:3000/admin/sponsored-posts');
      setPosts(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingPost) {
      setEditingPost({ ...editingPost, [name]: value });
    } else {
      setNewPost({ ...newPost, [name]: value });
    }
  };

  const validateInputs = (post: { title: string; imageUrl: string; link: string }) => {
    if (!post.title.trim()) {
      toast.error('Title cannot be empty');
      return false;
    }
    if (!post.imageUrl.trim()) {
      toast.error('Image URL cannot be empty');
      return false;
    }
    if (!post.link.trim()) {
      toast.error('Link cannot be empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const postToSubmit = editingPost || newPost;
    
    if (!validateInputs(postToSubmit)) {
      return;
    }

    try {
      if (editingPost) {
        await axios.put(`http://localhost:3000/admin/sponsored-posts/${editingPost._id}`, editingPost);
        toast.success('Sponsored post updated successfully');
        setEditingPost(null);
      } else {
        await axios.post('http://localhost:3000/admin/sponsored-posts', newPost);
        toast.success('Sponsored post added successfully');
        setNewPost({ title: '', imageUrl: '', link: '' });
      }
      fetchSponsoredPosts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (post: SponsoredPost) => {
    setEditingPost(post);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sponsored post?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/sponsored-posts/${id}`);
        toast.success('Sponsored post deleted successfully');
        fetchSponsoredPosts();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Sponsored Posts</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={editingPost ? editingPost.title : newPost.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block mb-2">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={editingPost ? editingPost.imageUrl : newPost.imageUrl}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="link" className="block mb-2">Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={editingPost ? editingPost.link : newPost.link}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
          {editingPost ? 'Update Sponsored Post' : 'Add Sponsored Post'}
        </button>
        {editingPost && (
          <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel Edit
          </button>
        )}
      </form>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded">
            <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover mb-2" />
            <h3 className="font-bold">{post.title}</h3>
            <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block mb-2">
              View Post
            </a>
            <div className="flex justify-between">
              <button onClick={() => handleEdit(post)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                Edit
              </button>
              <button onClick={() => handleDelete(post._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsoredPosts;