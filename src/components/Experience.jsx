import { Environment, OrbitControls, useHelper  } from "@react-three/drei";
import { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { DirectionalLightHelper, CanvasTexture } from "three";
import { Avatar } from "./Avatar";

export const Experience = () => {
  const [blurredTexture, setBlurredTexture] = useState(null);
  const viewport = useThree((state) => state.viewport);

  const directionalLightRef = useRef();
  useHelper(directionalLightRef, DirectionalLightHelper, 2);

  const loadTexture = () => {
    const image = new Image();
    image.src = "textures/bg4.jpg";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      context.filter = "blur(1.5px)";
      context.drawImage(image, 0, 0, image.width, image.height);
      const texture = new CanvasTexture(canvas);
      setBlurredTexture(texture);
    };
  };

  if (!blurredTexture) {
    loadTexture();
    return null; // Render nothing until the texture is loaded and processed
  }

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
        intensity={0.6}
        // castShadow // Enable shadow casting for the directional light
        // shadow-mapSize-width={2048}
        // shadow-mapSize-height={2048}
      />

      {/* Key Light */}
      <directionalLight
        ref={directionalLightRef}
        position={[0, 6, -3]}
        intensity={0.5}
        // castShadow // Enable shadow casting for the directional light
        // shadow-mapSize-width={2048}
        // shadow-mapSize-height={2048}
      />

      {/* Fill Light */}
      {/* <pointLight position={[-10, -10, -10]} intensity={0.2} /> */}

      {/* Rim Light */}
      {/* <spotLight position={[5, 20, 20]} angle={0.3} intensity={0.3} castShadow /> */}

      {/* Ambient Light */}
      <ambientLight intensity={0.1} />

      {/* Environment for realistic reflections */}
      {/* <Environment preset="sunset" /> */}

      {/* Blurred Background */}
      <mesh scale={2}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshStandardMaterial map={blurredTexture} />
      </mesh>

      
    </>
  );
};
