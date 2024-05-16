import React, { useState, useEffect, useRef } from 'react';
import { Info, Links, Title } from "./components";
import { Analytics } from "@vercel/analytics/react";
import mp4 from './assets/vid.mp4';
import webm from './assets/vid.webm';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      const handleCanPlay = () => {
        setIsLoading(false);
      };
      videoEl.addEventListener('canplaythrough', handleCanPlay);

      // Cleanup function to remove the event listener
      return () => {
        videoEl.removeEventListener('canplaythrough', handleCanPlay);
      };
    }
  }, []);

  return (
    <>
      <div className="container flex justify-between flex-col size-full relative text-center p-2 md:max-w-4xl xl:max-w-6xl 2xl:max-w-full mx-auto overflow-hidden bg-center bg-no-repeat bg-contain">
        {isLoading && <div className="absolute z-50 w-full h-full flex items-center justify-center"></div>}
        <Links />
        <Title />
        <Info />
        {/* <video ref={videoRef} autoPlay muted loop style={{ zIndex: '-1' }} className="bg-slate-50 hue-rotate-45 absolute blur-sm md:blur-0 -translate-x-1/2 -translate-y-3 md:-translate-x-1.5 w-auto min-w-full min-h-full max-w-none">
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video> */}
      </div>
      <Analytics />
      {/* <SpeedInsights /> */}
    </>
  );
};

export default App;
