// import React from 'react';
// import RecommendedEvents from '../../components/User/home/RecommendedEvents';
// import NewsArchive from '../../components/User/home/NewsArchive';
// import Communities from '../../components/User/home/Communities';

// const Home: React.FC = () => {
//   console.log('Home component rendered');
//   return (
//     <div className="flex">
//       <div className="flex-1 flex flex-col">
//         <div className="p-4 bg-gray-100 flex-1">
//           <div className="flex mb-24 space-x-4">
//             <RecommendedEvents />
//             <NewsArchive />
//           </div>
//           <Communities />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/userServices/axiosInstance';
import { toast } from 'sonner';

interface SponsoredPost {
  _id: string;
  title: string;
  imageUrl: string;
  link: string;
}

const Home: React.FC = () => {
  const [sponsoredPosts, setSponsoredPosts] = useState<SponsoredPost[]>([]);

  useEffect(() => {
    const fetchSponsoredPosts = async () => {
      try {
        const { data } = await axiosInstance.get<SponsoredPost[]>('content/sponsored-posts');
        setSponsoredPosts(data);
      } catch (error: any) {
        console.log(error)
        toast.error(error.message);
      }
    };
    fetchSponsoredPosts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to XOX</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsoredPosts.map((post) => (
          <div key={post._id} className="border rounded-lg overflow-hidden shadow-lg">
            <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
              <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <span className="text-sm text-gray-500">Sponsored</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;