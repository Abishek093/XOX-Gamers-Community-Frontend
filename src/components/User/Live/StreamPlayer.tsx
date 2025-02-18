// import React, { useEffect, useRef, useState } from 'react';
// import Hls from 'hls.js';

// interface StreamPlayerProps {
//   streamKey: string;
//   onError?: (error: string) => void;
// }

// const StreamPlayer: React.FC<StreamPlayerProps> = ({ streamKey, onError }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const retryCount = useRef(0);
//   const MAX_RETRIES = 7;
//   const RETRY_INTERVAL = 5000;
//   const CONTINUOUS_CHECK_INTERVAL = 30000;
//   const mountedRef = useRef(true);

//   const constructStreamUrl = (key: string) => {
//     const cleanKey = key.replace(/^\/+|\/+$/g, '');
//     // return `http://live.xoxgaming.shop/hls/live/${cleanKey}/index.m3u8`;
//     return `http://35.244.42.12:8080/hls/live/${cleanKey}/index.m3u8`;
//     // return `http://localhost:8080/hls/live/${cleanKey}/index.m3u8`;
//   };

//   const checkStreamAvailability = async (url: string): Promise<boolean> => {
//     try {
//       const response = await fetch(url, {
//         method: 'HEAD',
//         cache: 'no-cache'  // Prevent caching of HEAD requests
//       });
//       return response.ok;
//     } catch (err) {
//       console.warn('Stream availability check failed:', err);
//       return false;
//     }
//   };

//   const destroyHls = () => {
//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//       hlsRef.current = null;
//     }
//   };

//   const initializeHls = async () => {
//     if (!mountedRef.current) return;
//     if(!streamKey){
//       console.log("No stream Key found")
//     }else if(!videoRef.current){
//       console.log("No videoRef.current")
//     }else{
//       console.log('HLS is not supported in this browser')
//     }
//     if (!streamKey || !videoRef.current || !Hls.isSupported()) {
//       setError('HLS is not supported in this browser');
//       return;
//     }

//     // Destroy existing HLS instance before creating a new one
//     destroyHls();

//     const streamUrl = constructStreamUrl(streamKey);
//     const isStreamAvailable = await checkStreamAvailability(streamUrl);

//     if (!isStreamAvailable) {
//       if (retryCount.current < MAX_RETRIES) {
//         console.log(`Stream not available. Attempt ${retryCount.current + 1}/${MAX_RETRIES}`);
//         retryCount.current += 1;
//         setTimeout(() => {
//           if (mountedRef.current) {
//             initializeHls();
//           }
//         }, RETRY_INTERVAL);
//         return;
//       } else {
//         setError('Stream not available. Waiting for stream to become active...');
//         setTimeout(() => {
//           if (mountedRef.current) {
//             retryCount.current = 0;
//             initializeHls();
//           }
//         }, CONTINUOUS_CHECK_INTERVAL);
//         return;
//       }
//     }

//     try {
//       const hls = new Hls({
//         debug: false,
//         enableWorker: true,
//         lowLatencyMode: true,
//         backBufferLength: 30,
//         maxBufferSize: 60 * 1000 * 1000,  // Reduced buffer size
//         maxBufferLength: 30,
//         maxMaxBufferLength: 30,
//         liveSyncDurationCount: 3,
//         liveMaxLatencyDurationCount: 5,
//         liveDurationInfinity: true,
//         manifestLoadPolicy: {
//           default: {
//             maxTimeToFirstByteMs: 5000,
//             maxLoadTimeMs: 5000,
//             timeoutRetry: {
//               maxNumRetry: 2,
//               retryDelayMs: 1000,
//               maxRetryDelayMs: 0
//             },
//             errorRetry: {
//               maxNumRetry: 2,
//               retryDelayMs: 1000,
//               maxRetryDelayMs: 4000
//             }
//           }
//         }
//       });

//       hlsRef.current = hls;

//       const initializeEvents = () => {
//         if (!hls || !mountedRef.current) return;

//         hls.on(Hls.Events.MEDIA_ATTACHED, () => {
//           if (mountedRef.current) {
//             console.log('HLS media attached');
//             hls.loadSource(streamUrl);
//           }
//         });

//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           if (mountedRef.current) {
//             console.log('HLS manifest parsed');
//             setIsLoading(false);
//             setError(null);
//             retryCount.current = 0;
//             videoRef.current?.play().catch(err => {
//               console.warn('Auto-play failed:', err);
//             });
//           }
//         });

//         hls.on(Hls.Events.ERROR, (_event, data) => {
//           if (!mountedRef.current) return;

//           if (data.fatal) {
//             switch (data.type) {
//               case Hls.ErrorTypes.NETWORK_ERROR:
//                 console.error('Network Error:', data.details);
//                 hls.startLoad();
//                 break;
//               case Hls.ErrorTypes.MEDIA_ERROR:
//                 console.log('Media Error, attempting to recover');
//                 hls.recoverMediaError();
//                 break;
//               default:
//                 destroyHls();
//                 setError(`Playback Error: ${data.details}`);
//                 onError?.(`Playback Error: ${data.details}`);
//                 // Restart initialization process
//                 setTimeout(() => {
//                   if (mountedRef.current) {
//                     initializeHls();
//                   }
//                 }, RETRY_INTERVAL);
//                 break;
//             }
//           }
//         });
//       };

//       initializeEvents();
//       hls.attachMedia(videoRef.current);

//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
//       setError(errorMessage);
//       onError?.(errorMessage);
//     }
//   };

//   useEffect(() => {
//     mountedRef.current = true;
//     retryCount.current = 0;
//     initializeHls();

//     return () => {
//       mountedRef.current = false;
//       destroyHls();
//     };
//   }, [streamKey]);

//   return (
//     <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
//       <video
//         ref={videoRef}
//         className="w-full h-full"
//         controls
//         playsInline
//         autoPlay
//         muted  // Add muted to help with autoplay
//       />
//       {(isLoading || error) && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="text-white text-center p-4">
//             {isLoading && !error && (
//               <div className="space-y-2">
//                 <p>Loading stream...</p>
//                 {retryCount.current > 0 && (
//                   <p className="text-sm text-gray-400">
//                     Attempt {retryCount.current}/{MAX_RETRIES}
//                   </p>
//                 )}
//               </div>
//             )}
//             {error && <p className="text-red-500">{error}</p>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StreamPlayer;


import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface StreamPlayerProps {
  streamKey: string;
  onError?: (error: string) => void;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ streamKey, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHlsAttached, setIsHlsAttached] = useState(false);
  const [showMainStream, setShowMainStream] = useState(false);
  const retryCount = useRef(0);
  const MAX_RETRIES = 7;
  const RETRY_INTERVAL = 5000;
  const CONTINUOUS_CHECK_INTERVAL = 30000;
  const mountedRef = useRef(true);

  const constructStreamUrl = (key: string) => {
    const cleanKey = key.replace(/^\/+|\/+$/g, '');
    return `http://live.xoxgaming.shop:8080/hls/live/${cleanKey}/index.m3u8`;
    // return `http://localhost:8080/hls/live/${cleanKey}/index.m3u8`
  };

  const checkStreamAvailability = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch (err) {
      console.warn('Stream availability check failed:', err);
      return false;
    }
  };

  const destroyHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  const handleSkip = () => {
    if (isHlsAttached && videoRef.current) {
      adVideoRef.current?.pause();
      videoRef.current.style.display = 'block';
      if (adVideoRef.current) {
        adVideoRef.current.style.display = 'none';
      }
      setShowMainStream(true);
      videoRef.current.play().catch(console.error);
    }
  };

  const initializeHls = async () => {
    if (!mountedRef.current) return;
    if (!streamKey || !videoRef.current || !Hls.isSupported()) {
      setError('HLS is not supported in this browser');
      return;
    }

    destroyHls();

    const streamUrl = constructStreamUrl(streamKey);
    const isStreamAvailable = await checkStreamAvailability(streamUrl);

    if (!isStreamAvailable) {
      if (retryCount.current < MAX_RETRIES) {
        console.log(`Stream not available. Attempt ${retryCount.current + 1}/${MAX_RETRIES}`);
        retryCount.current += 1;
        setTimeout(() => {
          if (mountedRef.current) {
            initializeHls();
          }
        }, RETRY_INTERVAL);
        return;
      } else {
        setError('Stream not available. Waiting for stream to become active...');
        setTimeout(() => {
          if (mountedRef.current) {
            retryCount.current = 0;
            initializeHls();
          }
        }, CONTINUOUS_CHECK_INTERVAL);
        return;
      }
    }

    try {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferLength: 30,
        maxMaxBufferLength: 30,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 5,
        liveDurationInfinity: true,
        manifestLoadPolicy: {
          default: {
            maxTimeToFirstByteMs: 5000,
            maxLoadTimeMs: 5000,
            timeoutRetry: {
              maxNumRetry: 2,
              retryDelayMs: 1000,
              maxRetryDelayMs: 0
            },
            errorRetry: {
              maxNumRetry: 2,
              retryDelayMs: 1000,
              maxRetryDelayMs: 4000
            }
          }
        }
      });

      hlsRef.current = hls;

      const initializeEvents = () => {
        if (!hls || !mountedRef.current) return;

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          if (mountedRef.current) {
            console.log('HLS media attached');
            setIsHlsAttached(true);
            hls.loadSource(streamUrl);
          }
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (mountedRef.current) {
            console.log('HLS manifest parsed');
            setIsLoading(false);
            setError(null);
            retryCount.current = 0;
          }
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!mountedRef.current) return;

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network Error:', data.details);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media Error, attempting to recover');
                hls.recoverMediaError();
                break;
              default:
                destroyHls();
                setError(`Playback Error: ${data.details}`);
                onError?.(`Playback Error: ${data.details}`);
                setTimeout(() => {
                  if (mountedRef.current) {
                    initializeHls();
                  }
                }, RETRY_INTERVAL);
                break;
            }
          }
        });
      };

      initializeEvents();
      hls.attachMedia(videoRef.current);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    retryCount.current = 0;
    setShowMainStream(false);
    
    // Hide the main video initially
    if (videoRef.current) {
      videoRef.current.style.display = 'none';
    }
    
    initializeHls();

    return () => {
      mountedRef.current = false;
      destroyHls();
    };
  }, [streamKey]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Ad Video */}
      <video
        ref={adVideoRef}
        className="w-full h-full"
        autoPlay
        muted
        src="https://gamers-community.s3.us-east-1.amazonaws.com/videoplayback.mp4"
        onEnded={() => {
          if (isHlsAttached && videoRef.current) {
            handleSkip();
          }
        }}
      />
      
      {/* Main Stream Video */}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        autoPlay
        muted
      />
      
      {/* Skip Button - Only shown during ad and when HLS is attached */}
      {!showMainStream && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleSkip}
            disabled={!isHlsAttached}
            className={`px-4 py-2 rounded text-white font-semibold ${
              isHlsAttached 
                ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            {isHlsAttached ? 'Skip Ad' : 'Preparing Stream...'}
          </button>
        </div>
      )}

      {/* Loading/Error Overlay */}
      {(isLoading || error) && !isHlsAttached && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center p-4">
            {isLoading && !error && (
              <div className="space-y-2">
                <p>Loading stream...</p>
                {retryCount.current > 0 && (
                  <p className="text-sm text-gray-400">
                    Attempt {retryCount.current}/{MAX_RETRIES}
                  </p>
                )}
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;