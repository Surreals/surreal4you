import { useEffect } from 'react';
import { Info, Links, Title } from "./components";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  useEffect(() => {
    const trackingParams = [
      'fbclid',
      'gclid',
      'gbraid',
      'wbraid',
      'mc_cid',
      'mc_eid',
      'utm_campaign',
      'utm_content',
      'utm_medium',
      'utm_source',
      'utm_term',
    ];
    const url = new URL(window.location.href);
    let changed = false;

    trackingParams.forEach((param) => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        changed = true;
      }
    });

    if (changed) {
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }, []);

  return (
    <>
      <div className="container flex justify-between flex-col size-full relative text-center p-2 md:max-w-4xl xl:max-w-6xl 2xl:max-w-full mx-auto overflow-hidden bg-center bg-no-repeat bg-contain">
        <Links />
        <Title />
        <Info />
      </div>
      <Analytics />
      {/* <SpeedInsights /> */}
    </>
  );
};

export default App;
