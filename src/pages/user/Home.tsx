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


// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../services/userServices/axiosInstance';
// import { toast } from 'sonner';

// interface SponsoredPost {
//   _id: string;
//   title: string;
//   imageUrl: string;
//   link: string;
// }

// const Home: React.FC = () => {
//   const [sponsoredPosts, setSponsoredPosts] = useState<SponsoredPost[]>([]);

//   useEffect(() => {
//     const fetchSponsoredPosts = async () => {
//       try {
//         const { data } = await axiosInstance.get<SponsoredPost[]>('content/sponsored-posts');
//         setSponsoredPosts(data);
//       } catch (error: any) {
//         console.log(error)
//         toast.error(error.message);
//       }
//     };
//     fetchSponsoredPosts();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Welcome to XOX</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {sponsoredPosts.map((post) => (
//           <div key={post._id} className="border rounded-lg overflow-hidden shadow-lg">
//             <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
//               <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
//               <div className="p-4">
//                 <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
//                 <span className="text-sm text-gray-500">Sponsored</span>
//               </div>
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;




import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/userServices/axiosInstance';
import { TbLivePhotoFilled } from "react-icons/tb";
import { toast } from 'sonner';

interface UserDto {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
}

interface StreamDto {
  id?: string;
  title: string;
  description: string;
  game: string;
  thumbnailUrl: string | null;
  isLive: boolean;
  user: UserDto;
}

interface SponsoredPost {
  _id: string;
  title: string;
  imageUrl: string;
  link: string;
}

// Define union type for mixed content
type MixedContentItem = {
  type: 'stream';
  content: StreamDto;
} | {
  type: 'sponsored';
  content: SponsoredPost;
};

const StreamCard: React.FC<StreamDto> = ({ id, thumbnailUrl, title, description, isLive, user }) => {
  const navigate = useNavigate();

  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300'>
      <div className='relative'>
        <img
          className='w-full h-48 object-cover rounded-t-xl'
          src={thumbnailUrl || '/api/placeholder/400/300'}
          alt={`${user.displayName}'s stream`}
        />
        {isLive && (
          <div className='absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center'>
            <TbLivePhotoFilled className="mr-1" />
            LIVE
          </div>
        )}
      </div>
      <div className='p-4'>
        <div className='flex items-center mb-3'>
          <img
            className='w-12 h-12 rounded-full mr-3 border-2 border-gray-200'
            src={user.profileImage || '/api/placeholder/130/130'}
            alt={`${user.displayName}'s avatar`}
          />
          <div>
            <p className='font-semibold text-gray-800'>{user.displayName}</p>
            <p className='text-sm text-gray-500'>@{user.username}</p>
          </div>
        </div>
        <div className='mb-2'>
          <h3 className='font-bold text-lg text-gray-800'>{title}</h3>
          <p className='text-sm text-gray-600 mt-1'>{description}</p>
        </div>
        <button
          onClick={() => navigate(`streams/stream/${id}`)}
          className='mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300'
        >
          Watch Live
        </button>
      </div>
    </div>
  );
};

const SponsoredCard: React.FC<SponsoredPost> = ({ title, imageUrl, link }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-t-xl" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <span className="text-sm text-gray-500">Sponsored</span>
      </div>
    </a>
  </div>
);

const Home: React.FC = () => {
  const [streams, setStreams] = useState<StreamDto[]>([]);
  const [sponsoredPosts, setSponsoredPosts] = useState<SponsoredPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [streamsResponse, sponsoredResponse] = await Promise.all([
          axiosInstance.get('streaming/get-streams'),
          axiosInstance.get<SponsoredPost[]>('content/sponsored-posts')
        ]);

        setStreams(streamsResponse.data.filter((stream: StreamDto) => stream.isLive));
        setSponsoredPosts(sponsoredResponse.data);
      } catch (error) {
        toast.error("Failed to fetch content");
      }
    };

    fetchData();
  }, []);

  const getMixedContent = (): MixedContentItem[] => {
    const liveStreams = streams.filter(stream => stream.isLive);
    const result: MixedContentItem[] = [];
    const maxLength = Math.max(liveStreams.length, sponsoredPosts.length);
    
    // If there are live streams, always show the first one at the top
    if (liveStreams.length > 0) {
      result.push({
        type: 'stream',
        content: liveStreams[0]
      });
    }

    // Mix the remaining content
    for (let i = liveStreams.length > 0 ? 1 : 0; i < maxLength; i++) {
      // Add stream if available
      if (i < liveStreams.length) {
        result.push({
          type: 'stream',
          content: liveStreams[i]
        });
      }

      // Add sponsored post, cycling through if we run out
      if (sponsoredPosts.length > 0) {
        result.push({
          type: 'sponsored',
          content: sponsoredPosts[i % sponsoredPosts.length]
        });
      }
    }

    return result;
  };

  const mixedContent = getMixedContent();

  const renderContent = (item: MixedContentItem) => {
    if (item.type === 'stream') {
      return <StreamCard {...item.content} />;
    }
    return <SponsoredCard {...item.content} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">XOX Live</h1>
        <button 
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
          onClick={() => navigate('/go-live')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Go Live
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mixedContent.map((item, index) => (
          <div key={index}>
            {renderContent(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;