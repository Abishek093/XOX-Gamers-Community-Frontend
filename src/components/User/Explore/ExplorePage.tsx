// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { selectUser } from '../../../Slices/userSlice/userSlice';
// import Post from '../common/Post';
// import { toast } from 'sonner';
// import { ChevronUp } from 'lucide-react';
// import axiosInstance from '../../../services/userServices/axiosInstance';
// import { UserDetails } from '../../../interfaces/userInterfaces/apiInterfaces';

// // interface PostType {
// //   _id: string;
// //   title: string;
// //   content: string;
// //   author: {
// //     _id: string;
// //     displayName: string;
// //     profileImage?: string;
// //   };
// //   likeCount: number;
// //   commentCount?: number;
// //   createdAt: string;
// //   updatedAt: string;
// //   community?: {
// //     _id: string;
// //     name: string;
// //     image?: string;
// //   };
// // }

// interface Community {
//   _id: string;
//   name: string;
//   image?: string;
// }

// interface PostType {
//   _id: string;
//   title: string;
//   content: string;
//   author: UserDetails,
//   likeCount: number;
//   commentCount?: number;
//   createdAt: string;
//   updatedAt: string;
//   communityDetails?: Community;
// }

// interface TransformedPostData {
//   _id: string;
//   title: string;
//   content: string;
//   author: UserDetails;
//   likeCount: number;
//   createdAt: string;
// }

// const ExplorePage = () => {
//   const user = useSelector(selectUser);
//   const [explorePosts, setExplorePosts] = useState<PostType[]>([]);
//   const [forYouPosts, setForYouPosts] = useState<PostType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [page, setPage] = useState(1);
//   const [activeTab, setActiveTab] = useState<'explore' | 'forYou'>('explore');
//   const [error, setError] = useState<string | null>(null);
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   const isMounted = useRef(true);
//   const abortController = useRef<AbortController | null>(null);
//   const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const loadMoreRef = useRef<HTMLDivElement>(null);


//   const transformPostData = (post: PostType): TransformedPostData => {
//     if (post.communityDetails) {
//       return {
//         ...post,
//         title: post.title,
//         _id: post._id,
//         content: post.content,
//         author: post.author,
//         likeCount: post.likeCount,
//         createdAt: post.createdAt,
//       };
//     }
//     return post;
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 500);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       isMounted.current = false;
//       if (abortController.current) {
//         abortController.current.abort();
//       }
//       if (retryTimeoutRef.current) {
//         clearTimeout(retryTimeoutRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     setError(null);
//     setPage(1);
//     setHasMore(true);
//     if (retryTimeoutRef.current) {
//       clearTimeout(retryTimeoutRef.current);
//     }
//     if (abortController.current) {
//       abortController.current.abort();
//     }
//     abortController.current = new AbortController();

//     fetchPosts(activeTab, 1, abortController.current.signal);
//   }, [activeTab]);

//   const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
//     const target = entries[0];
//     if (target.isIntersecting && !loading && hasMore && !error) {
//       setPage(prev => prev + 1);
//     }
//   }, [loading, hasMore, error]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, {
//       root: null,
//       threshold: 0.1,
//     });

//     if (loadMoreRef.current) {
//       observer.observe(loadMoreRef.current);
//     }

//     return () => {
//       if (loadMoreRef.current) {
//         observer.unobserve(loadMoreRef.current);
//       }
//     };
//   }, [handleObserver]);

//   const fetchPosts = async (type: 'explore' | 'forYou', pageNum: number, signal?: AbortSignal) => {
//     if (loading || (error && pageNum !== 1)) return;

//     try {
//       setLoading(true);
//       if (pageNum === 1) {
//         setError(null);
//       }

//       const endpoint = type === 'explore' ? 'posts/explore' : 'posts/for-you';
//       const response = await axiosInstance.get(`content/${endpoint}`, {
//         params: {
//           page: pageNum,
//           limit: 10,
//           userId: user?.id
//         },
//         signal
//       });

//       const newPosts = response.data.posts;
//       console.log("newPosts: ", newPosts)
//       if (!Array.isArray(newPosts)) {
//         throw new Error('Invalid response format');
//       }

//       const hasMorePosts = newPosts.length === 10;

//       if (type === 'explore') {
//         setExplorePosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
//       } else {
//         setForYouPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
//       }

//       setHasMore(hasMorePosts);

//     } catch (error: any) {
//       if (!isMounted.current || error.name === 'AbortError') return;

//       console.error('Error fetching posts:', error);
//       const errorMessage = error.response?.status === 404
//         ? 'Content not found. Please try again later.'
//         : 'Failed to load posts. Please try again.';

//       setError(errorMessage);
//       toast.error(errorMessage, {
//         duration: 3000,
//         action: {
//           label: 'Retry',
//           onClick: () => handleRetry()
//         }
//       });
//       setHasMore(false);
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (page > 1) {
//       fetchPosts(activeTab, page);
//     }
//   }, [page]);

//   const handleRemovePost = (postId: string) => {
//     setExplorePosts(prev => prev.filter(post => post._id !== postId));
//     setForYouPosts(prev => prev.filter(post => post._id !== postId));
//   };

//   const handleRetry = () => {
//     setError(null);
//     setHasMore(true);
//     setPage(1);
//     if (abortController.current) {
//       abortController.current.abort();
//     }
//     abortController.current = new AbortController();
//     fetchPosts(activeTab, 1, abortController.current.signal);
//   };

//   const scrollToTopAndRefresh = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     handleRetry();
//   };

//   const activePosts = activeTab === 'explore' ? explorePosts : forYouPosts;


//   const renderPostHeader = (post: PostType) => {
//     if (!post.communityDetails || !post.communityDetails) return null;
  
//     return (
//       <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="flex-shrink-0">
//               {post.communityDetails.image ? (
//                 <img
//                   src={post.communityDetails.image}
//                   alt={post.communityDetails.name}
//                   className="w-8 h-8 rounded-lg object-cover border-2 border-white shadow-sm"
//                 />
//               ) : (
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
//                   {post.communityDetails.name.charAt(0)}
//                 </div>
//               )}
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm font-semibold text-gray-900">
//                 {post.communityDetails.name}
//               </span>
//               {/* {post.communityDetails.description && (
//                 <span className="text-xs text-gray-500 line-clamp-1">
//                   {post.communityDetails.description}
//                 </span>
//               )} */}
//             </div>
//           </div>
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
//             Community
//           </span>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Fixed Navigation Header */}
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="bg-white rounded-xl shadow-sm p-2 mb-8">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setActiveTab('explore')}
//               className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
//                 ${activeTab === 'explore'
//                   ? 'bg-gray-100 text-gray-900 shadow-sm'
//                   : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               Explore
//             </button>
//             <button
//               onClick={() => setActiveTab('forYou')}
//               className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
//                 ${activeTab === 'forYou'
//                   ? 'bg-gray-100 text-gray-900 shadow-sm'
//                   : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               For You
//             </button>
//           </div>
//         </div>

//         {/* Main Content */}
//         {/* <div className="max-w-4xl mx-auto px-4 pt-24 pb-8"> */}
//         <div className="space-y-6">
//           {Array.isArray(activePosts) && activePosts.length > 0 ? (
//             activePosts.map((post) => (
//               <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
//                 {renderPostHeader(post)}
//                 <Post
//                   post={transformPostData(post)}
//                   user={post.author}
//                   removePost={handleRemovePost}
//                 />
//               </div>
//             ))
//           ) :!loading && !error ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//                 <div className="mb-4">
//                   <svg
//                     className="mx-auto h-12 w-12 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No Posts Yet
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {activeTab === 'explore'
//                     ? "Be the first to share something interesting!"
//                     : "Follow users and communities to see their posts here"}
//                 </p>
//               </div>
//             ) : null}
//           </div>

//           {loading && (
//             <div className="flex justify-center py-8">
//               <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
//             </div>
//           )}

//           {hasMore && !error && <div ref={loadMoreRef} className="h-10" />}
//         </div>

//         {/* Scroll to Top Button */}
//         {showScrollTop && (
//           <button
//             onClick={scrollToTopAndRefresh}
//             className="fixed bottom-6 right-6 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
//             aria-label="Scroll to top and refresh"
//           >
//             <ChevronUp className="w-6 h-6 text-gray-600" />
//           </button>
//         )}
//       </div>

//     // </div>
//   );
// };

// export default ExplorePage;


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../Slices/userSlice/userSlice';
import Post from '../common/Post';
import { toast } from 'sonner';
import { ChevronUp } from 'lucide-react';
import axiosInstance from '../../../services/userServices/axiosInstance';
import { UserDetails } from '../../../interfaces/userInterfaces/apiInterfaces';

interface Community {
  _id: string;
  name: string;
  image?: string;
}

interface PostType {
  _id: string;
  title: string;
  content: string;
  author: UserDetails;
  likeCount: number;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
  communityDetails?: Community;
}

interface FetchState {
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  data: PostType[];
}

const ExplorePage = () => {
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState<'explore' | 'forYou'>('explore');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Separate state for each tab
  const [exploreState, setExploreState] = useState<FetchState>({
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    data: [],
  });
  
  const [forYouState, setForYouState] = useState<FetchState>({
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    data: [],
  });

  const isMounted = useRef(true);
  const abortController = useRef<AbortController | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const currentState = activeTab === 'explore' ? exploreState : forYouState;
  const setCurrentState = activeTab === 'explore' ? setExploreState : setForYouState;

  const fetchPosts = useCallback(async (
    type: 'explore' | 'forYou',
    pageNum: number,
    signal?: AbortSignal
  ) => {
    const setState = type === 'explore' ? setExploreState : setForYouState;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const endpoint = type === 'explore' ? 'posts/explore' : 'posts/for-you';
      const response = await axiosInstance.get(`content/${endpoint}`, {
        params: {
          page: pageNum,
          limit: 10,
          userId: user?.id
        },
        signal
      });

      const newPosts = response.data.posts;
      
      // Check if the response contains posts array and is valid
      if (!response.data || !Array.isArray(newPosts)) {
        throw new Error('Invalid response format');
      }

      // Only update state if the component is still mounted and we haven't aborted
      if (isMounted.current && signal?.aborted !== true) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
          hasMore: newPosts.length === 10,
          data: pageNum === 1 ? newPosts : [...prev.data, ...newPosts],
          page: pageNum
        }));
      }

    } catch (error: any) {
      // Only handle errors if the component is mounted and it's not an abort error
      if (!isMounted.current || error.name === 'AbortError') {
        return;
      }

      // Check if it's actually a network error or server error
      if (error.response?.status === 404 || error.response?.status >= 500 || !navigator.onLine) {
        const errorMessage = error.response?.status === 404
          ? 'Content not found. Please try again later.'
          : 'Failed to load posts. Please try again.';

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          hasMore: false
        }));

        toast.error(errorMessage, {
          duration: 3000,
          action: {
            label: 'Retry',
            onClick: () => handleRetry()
          }
        });
      } else {
        // If posts were loaded successfully despite the error, just silently set loading to false
        setState(prev => ({
          ...prev,
          loading: false,
          error: null
        }));
      }
    }
  }, [user?.id]);

  // Handle tab change
  useEffect(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    const state = activeTab === 'explore' ? exploreState : forYouState;
    
    // Only fetch if we haven't loaded data for this tab yet
    if (state.data.length === 0 && !state.loading) {
      fetchPosts(activeTab, 1, abortController.current.signal);
    }
  }, [activeTab, fetchPosts]);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !currentState.loading && currentState.hasMore && !currentState.error) {
      fetchPosts(activeTab, currentState.page + 1);
    }
  }, [activeTab, currentState, fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  const handleRetry = () => {
    setCurrentState(prev => ({
      ...prev,
      error: null,
      hasMore: true,
      page: 1,
      data: []
    }));
    
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    fetchPosts(activeTab, 1, abortController.current.signal);
  };

  const handleTabChange = (tab: 'explore' | 'forYou') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  // Rest of your component remains the same, just update the references to use currentState
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-2 mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => handleTabChange('explore')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === 'explore'
                  ? 'bg-gray-100 text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Explore
            </button>
            <button
              onClick={() => handleTabChange('forYou')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === 'forYou'
                  ? 'bg-gray-100 text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              For You
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {currentState.data.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
              {post.communityDetails && (
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {post.communityDetails.image ? (
                          <img
                            src={post.communityDetails.image}
                            alt={post.communityDetails.name}
                            className="w-8 h-8 rounded-lg object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                            {post.communityDetails.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {post.communityDetails.name}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
                      Community
                    </span>
                  </div>
                </div>
              )}
              <Post
                post={post}
                user={post.author}
                removePost={(postId) => {
                  setCurrentState(prev => ({
                    ...prev,
                    data: prev.data.filter(p => p._id !== postId)
                  }));
                }}
              />
            </div>
          ))}

          {currentState.loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
            </div>
          )}

          {currentState.hasMore && !currentState.error && (
            <div ref={loadMoreRef} className="h-10" />
          )}

          {!currentState.loading && !currentState.error && currentState.data.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Posts Yet
              </h3>
              <p className="text-sm text-gray-500">
                {activeTab === 'explore'
                  ? "Be the first to share something interesting!"
                  : "Follow users and communities to see their posts here"}
              </p>
            </div>
          )}
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            handleRetry();
          }}
          className="fixed bottom-6 right-6 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          aria-label="Scroll to top and refresh"
        >
          <ChevronUp className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default ExplorePage;