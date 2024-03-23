import { Info, Links, Title } from "./components";

const App = () => {
  return (
    <div className="bg-white container flex justify-between flex-col size-full relative text-center p-2 md:max-w-4xl	mx-auto overflow-hidden bg-center	bg-no-repeat	bg-contain	" style={{backgroundImage: `linear-gradient(rgb(255 255 255 / 100%), rgb(255 255 255 / 100%)), url(src/assets/main.png)`}}>
      <Links/>
      <Title/>
      <Info/>
    </div>
  );
};

export default App;
