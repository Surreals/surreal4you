import { Info, Links, Title } from "./components";

const App = () => {
  return (
    <div className=" bg-amber-50 container flex justify-between flex-col size-full relative text-center p-2 md:max-w-4xl xl:max-w-6xl 2xl:max-w-full	mx-auto overflow-hidden bg-center	bg-no-repeat	bg-contain	" >
      <Links/>
      <Title/>
      <Info/>
    </div>
  );
};
// style={{backgroundImage: `linear-gradient(rgb(255 255 255 / 100%), rgb(255 255 255 / 100%)), url(src/assets/main.png)`}}
export default App;
