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

const StreamPlayer: React.FC<StreamPlayerProps> = ({ streamKey }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(true);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const retryCount = useRef(0);
  // const MAX_RETRIES = 7;
  // const RETRY_INTERVAL = 5000;
  const mountedRef = useRef(true);
  const [error, setError] = useState<string | null>(null);
  const adsLoaderRef = useRef<any>(null);
  const adsManagerRef = useRef<any>(null);

  const constructStreamUrl = (key: string) => {
    const cleanKey = key.replace(/^\/+|\/+$/g, '');
    return `http://35.244.42.12:8080/hls/live/${cleanKey}/index.m3u8`;
  };


  const loadIMAScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.ima) {
        resolve();
        return;
      }

      // First check if we can access the domain
      fetch('https://imasdk.googleapis.com/js/sdkloader/ima3.js', {
        method: 'HEAD',
        mode: 'no-cors'
      })
        .then(() => {
          const script = document.createElement('script');
          script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => {
            reject(new Error('Ad blocker may be preventing the player from loading. Disable ad blocker or skip ads.'));
          };
          document.body.appendChild(script);
        })
        .catch(() => {
          reject(new Error('Ad blocker may be preventing the player from loading. Disable ad blocker or skip ads.'));
        });
    });
  };

  const initializeIMA = async () => {
    try {
      await loadIMAScript();

      if (!window.google || !window.google.ima) {
        setShowSkipButton(true); // Allow users to skip ads if IMA fails to load
        throw new Error('Ad service unavailable - you may skip the ad.');
      }

      const adContainer = adContainerRef.current;
      const videoElement = videoRef.current;

      if (!adContainer || !videoElement) {
        setShowSkipButton(true);
        throw new Error('Ad initialization failed - you may skip the ad.');
      }

      const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
      adsLoaderRef.current = new google.ima.AdsLoader(adDisplayContainer);

      adsLoaderRef.current.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false
      );

      adsLoaderRef.current.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false
      );

      const adsRequest = new google.ima.AdsRequest();
      adsRequest.adTagUrl = "https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";

      adsLoaderRef.current.requestAds(adsRequest);
    } catch (error) {
      console.error('Failed to initialize IMA:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize ad service');
      setShowSkipButton(true); // Always show skip button when there's an error
    }
  };

  const onAdsManagerLoaded = (event: any) => {
    const adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsManagerRef.current = event.getAdsManager(videoRef.current, adsRenderingSettings);

    adsManagerRef.current.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdComplete);
    adsManagerRef.current.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);

    try {
      adsManagerRef.current.init(videoRef.current!.clientWidth, videoRef.current!.clientHeight, google.ima.ViewMode.NORMAL);
      adsManagerRef.current.start();
    } catch (error) {
      console.error('Ad Manager Error:', error);
      playStream();
    }
  };

  const onAdComplete = () => {
    setIsAdPlaying(false);
    playStream();
  };

  const onAdError = (event: any) => {
    console.error('Ad Error:', event.getError());
    if (adsManagerRef.current) {
      adsManagerRef.current.destroy();
    }
    setIsAdPlaying(false);
    playStream();
  };

  const playStream = async () => {
    setIsAdPlaying(false);
    setShowSkipButton(false);

    const streamUrl = constructStreamUrl(streamKey);
    try {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current!);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('HLS media attached');
        setIsLoading(false);
        setShowSkipButton(true);
        retryCount.current = 0;
      });

      hlsRef.current = hls;
    } catch (error) {
      console.error('HLS initialization failed:', error);
      setError('Failed to load stream.');
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    retryCount.current = 0;

    const init = async () => {
      await initializeIMA();
    };

    init().catch(error => {
      console.error('Failed to initialize:', error);
      playStream();
    });

    return () => {
      mountedRef.current = false;
      if (hlsRef.current) hlsRef.current.destroy();
      if (adsManagerRef.current) adsManagerRef.current.destroy();
    };
  }, [streamKey]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video ref={videoRef} className="w-full h-full" playsInline muted />

      {isAdPlaying && (
        <div ref={adContainerRef} className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-white mb-2">Ad is playing...</p>
            {error && <p className="text-yellow-400 text-sm">{error}</p>}
          </div>
        </div>
      )}

      {showSkipButton && (
        <button
          onClick={playStream}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Skip Ad
        </button>
      )}

      {(isLoading || error) && !isAdPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center p-4">
            {isLoading && !error && <p>Loading stream...</p>}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;
