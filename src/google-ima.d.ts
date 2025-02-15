interface Window {
    google: {
      ima: {
        AdDisplayContainer: new (container: HTMLElement, video: HTMLVideoElement) => any;
        AdsLoader: new (container: any) => any;
        AdsRequest: new () => {
          adTagUrl: string;
        };
        AdsRenderingSettings: new () => any;
        AdsManagerLoadedEvent: {
          Type: {
            ADS_MANAGER_LOADED: string;
          };
        };
        AdErrorEvent: {
          Type: {
            AD_ERROR: string;
          };
        };
        AdEvent: {
          Type: {
            ALL_ADS_COMPLETED: string;
          };
        };
        ViewMode: {
          NORMAL: string;
        };
      };
    };
  }