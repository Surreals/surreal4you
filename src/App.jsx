import { Info, Links, Title } from "./components";
import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
  return (
    <>
      <div className=" container flex justify-between flex-col size-full relative text-center p-2 md:max-w-4xl xl:max-w-6xl 2xl:max-w-full	mx-auto overflow-hidden bg-center	bg-no-repeat	bg-contain	">
        <Links />
        <Title />
        <Info />
        <video autoPlay muted loop style={{zIndex: '-1'}} className="absolute blur-sm md:blur-none -translate-x-1/2 -translate-y-2 md:-translate-x-1.5 md:-translate-y-1  w-auto min-w-full min-h-full max-w-none">
          <source src="src/assets/vid.mp4" type="video/mp4" />
        </video>
      </div>
      <Analytics />
      {/* <SpeedInsights /> */}
    </>
  );
};
// style={{backgroundImage: `linear-gradient(rgb(255 255 255 / 100%), rgb(255 255 255 / 100%)), url(src/assets/main.png)`}}
export default App;
