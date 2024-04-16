import { Info, Links, Title } from "./components";
import { Analytics } from "@vercel/analytics/react";
import mp4 from './assets/vid.mp4';
import webm from './assets/vid.webm';
// import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
  return (
    <>
      <div className=" container flex justify-between flex-col size-full relative text-center p-2 md:max-w-4xl xl:max-w-6xl 2xl:max-w-full	mx-auto overflow-hidden bg-center	bg-no-repeat	bg-contain	">
        <Links />
        <Title />
        <Info />
        <video autoPlay muted loop style={{zIndex: '-1'}} className="bg-slate-50 hue-rotate-45 absolute blur-sm md:blur-0 -translate-x-1/2 -translate-y-3 md:-translate-x-1.5 md:-translate-y-1  w-auto min-w-full min-h-full max-w-none">
          <source src={webm} type="video/webm"/>
          <source src={mp4} type="video/mp4" />
        </video>
      </div>
      <Analytics />
      {/* <SpeedInsights /> */}
    </>
  );
};
// style={{backgroundImage: `linear-gradient(rgb(255 255 255 / 100%), rgb(255 255 255 / 100%)), url(src/assets/main.png)`}}
export default App;
