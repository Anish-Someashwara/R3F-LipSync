import { Environment, OrbitControls, useHelper, useTexture } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { DirectionalLightHelper, CanvasTexture } from "three";
import { Avatar } from "./Avatar";

export const Experience = () => {
  const texture = useTexture("textures/bg4.jpg");
  const viewport = useThree((state) => state.viewport);

  const directionalLightRef = useRef();
  useHelper(directionalLightRef, DirectionalLightHelper, 5);

  // Create a blurred version of the texture using a canvas
  const blurredTexture = useRef();
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const image = new Image();
    image.src = texture.image.src;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.filter = "blur(1.5px)"; // Adjust the blur radius as needed
      context.drawImage(image, 0, 0, image.width, image.height);
      blurredTexture.current = new CanvasTexture(canvas);
    };
  }, [texture]);

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true} // This enables smooth damping of the controls
        dampingFactor={0.1} // Adjust the damping factor to control the smoothness
        zoomSpeed={0.5} // Adjust the zoom speed for smoother zooming
        rotateSpeed={0.2} // Adjust the rotate speed for smoother rotation
        panSpeed={0.5} // Adjust the pan speed for smoother panning
        maxDistance={11}
        minDistance={6.5}
      />
      
      <Avatar position={[0, -3, 5]} scale={2} />

      {/* Key Light */}
      <directionalLight
        ref={directionalLightRef}
        position={[0, 0, 6]}
        intensity={0.7}
        castShadow // Enable shadow casting for the directional light
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill Light */}
      {/* <pointLight position={[-10, -10, 10]} intensity={0.2} /> */}

      {/* Rim Light */}
      {/* <spotLight position={[5, 20, 20]} angle={0.3} intensity={1} castShadow /> */}

      {/* Ambient Light */}
      <ambientLight intensity={0.1} />

      {/* Blurred Background */}
      {blurredTexture.current && (
        <mesh scale={2}>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshStandardMaterial map={blurredTexture.current} />
        </mesh>
      )}

      {/* Environment for realistic reflections */}
      {/* <Environment preset="sunset" /> */}
    </>
  );
};
