import { Info, Links, Title } from "./components";

const App = () => {
  return (
    <div className="bg-white container flex justify-between flex-col size-full relative text-center p-2 md:max-w-4xl	mx-auto overflow-hidden">
      <Links/>
      <Title/>
      <Info/>
    </div>
  );
};

export default App;
