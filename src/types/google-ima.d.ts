// src/types/google-ima.d.ts

declare namespace google.ima {
    export class AdDisplayContainer {
      constructor(container: HTMLElement, video: HTMLVideoElement);
      initialize(): void;
      destroy(): void;
    }
  
    export class AdsLoader {
      constructor(container: AdDisplayContainer);
      addEventListener(
        type: string,
        callback: (event: AdsManagerLoadedEvent | AdErrorEvent) => void,
        useCapture?: boolean
      ): void;
      removeEventListener(
        type: string,
        callback: (event: AdsManagerLoadedEvent | AdErrorEvent) => void
      ): void;
      requestAds(request: AdsRequest): void;
      destroy(): void;
    }
  
    export class AdsRequest {
      adTagUrl: string;
    }
  
    export class AdsRenderingSettings {
      constructor();
    }
  
    export class AdsManager {
      addEventListener(
        type: string,
        callback: (event: AdEvent | AdErrorEvent) => void,
        useCapture?: boolean
      ): void;
      init(width: number, height: number, viewMode: ViewMode): void;
      start(): void;
      destroy(): void;
    }
  
    export interface AdsManagerLoadedEvent {
      type: string;
      getAdsManager(video: HTMLVideoElement, settings: AdsRenderingSettings): AdsManager;
    }
  
    export interface AdErrorEvent {
      type: string;
      getError(): Error;
    }
  
    export interface AdEvent {
      type: string;
    }
  
    export enum ViewMode {
      NORMAL = 'NORMAL',
      FULLSCREEN = 'FULLSCREEN'
    }
  
    export const AdsManagerLoadedEvent: {
      Type: {
        ADS_MANAGER_LOADED: string;
      };
    };
  
    export const AdErrorEvent: {
      Type: {
        AD_ERROR: string;
      };
    };
  
    export const AdEvent: {
      Type: {
        ALL_ADS_COMPLETED: string;
        CONTENT_PAUSE_REQUESTED: string;
        CONTENT_RESUME_REQUESTED: string;
      };
    };
  }
  
  interface Window {
    google: typeof google;
  }