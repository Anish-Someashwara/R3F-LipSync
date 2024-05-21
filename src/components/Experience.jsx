import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";

export const Experience = () => {
  const texture = useTexture("textures/bg4.jpg");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={false}
        enableDamping={false} // This enables smooth damping of the controls
        dampingFactor={0.1} // Adjust the damping factor to control the smoothness
        zoomSpeed={0.5} // Adjust the zoom speed for smoother zooming
        rotateSpeed={0.5} // Adjust the rotate speed for smoother rotation
        panSpeed={0.5} // Adjust the pan speed for smoother panning
      />
      <Avatar position={[0, -3, 5]} scale={2} />
      <Environment preset="sunset" background blur={1} />
      {/* <Environment preset="sunset"/> */}
      {/* <directionalLight position={[0, 1.0, 4.4]} intensity={0.2} /> */}
      {/* <directionalLight position={[-3.3, 1.0, 4.4]} intensity={0.5} /> */}
      {/* <ambientLight intensity={0.1}/> */}
      {/* <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture}  />
      </mesh> */}
    </>
  );
};
