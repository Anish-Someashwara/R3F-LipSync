import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 7], fov: 35 }}>
      <color attach="background" args={["#3c403d"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
