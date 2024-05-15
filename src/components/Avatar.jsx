/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 public/models/646d9dcdc8a5f5bddbfac913.glb -o src/components/Avatar.jsx -r public
*/

import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useMemo, useRef, useState } from "react";

import * as THREE from "three";

// const corresponding = {
//   A: "viseme_PP",              // P_B_M
//   B: "viseme_kk",              // EE
//   C: "viseme_I",               // ER
//   D: "viseme_AA",              // AA
//   E: "viseme_O",               // Ow
//   F: "viseme_U",               // Ow
//   G: "viseme_FF",              // F
//   H: "viseme_TH",              // ER
//   X: "viseme_PP",              // P_B_M
// };

const corresponding = {
  A: "P_B_M",
  B: "EE",
  C: "AA",
  D: "AA",
  E: "Ow",
  F: "Ow",
  G: "ER",
  H: "ER",
  X: "P_B_M",
  // Smile: "Smile"
};

export function Avatar(props) {
  const {
    playAudio,
    script,
    headFollow,
    smoothMorphTarget,
    morphTargetSmoothing,
  } = useControls({
    playAudio: false,
    smoothMorphTarget: true,
    morphTargetSmoothing: 0.40,
    script: {
      value: "Bot-Intro-3",
      options: ["Bot-Intro", "Bot-Intro-3", "pizzas"],
    },
  });

  const audio = useMemo(() => new Audio(`./audios/${script}.mp3`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `./audios/${script}.json`);
  const lipsync = JSON.parse(jsonFile);

  useFrame(() => {
    // console.log("HIIi")
    const currentAudioTime = audio.currentTime;
    if (audio.paused || audio.ended) {
      // setAnimation("Idle");
      nodes.Face.morphTargetInfluences[
        nodes.Face.morphTargetDictionary["Smile"]
      ] = THREE.MathUtils.lerp(
        nodes.Face.morphTargetInfluences[
          nodes.Face.morphTargetDictionary["Smile"]
        ],
        0.5,
        0.01
      );
      return;
    }

    nodes.Face.morphTargetInfluences[
        nodes.Face.morphTargetDictionary["Smile"]
      ] = THREE.MathUtils.lerp(
        nodes.Face.morphTargetInfluences[
          nodes.Face.morphTargetDictionary["Smile"]
        ],
        0.3,
        0.01
      );

    Object.values(corresponding).forEach((value) => {
      if (!smoothMorphTarget) {
        nodes.Face.morphTargetInfluences[
          nodes.Face.morphTargetDictionary[value]
        ] = 0;
       
      } else {
        nodes.Face.morphTargetInfluences[
          nodes.Face.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Face.morphTargetInfluences[
            nodes.Face.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );

      }
    });

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      // console.log("loop: ", i);
      const mouthCue = lipsync.mouthCues[i];
      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ) {
        // console.log("mouthCue: ", mouthCue.value)
        if (!smoothMorphTarget) {
          nodes.Face.morphTargetInfluences[
            nodes.Face.morphTargetDictionary[
              corresponding[mouthCue.value]
            ]
          ] = 1;
         
        } else {
          nodes.Face.morphTargetInfluences[
            nodes.Face.morphTargetDictionary[
              corresponding[mouthCue.value]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.Face.morphTargetInfluences[
              nodes.Face.morphTargetDictionary[
                corresponding[mouthCue.value]
              ]
            ],
            1,
            morphTargetSmoothing
          );
         
        }

        break;
      }
    }
  });

  useEffect(() => {

    nodes.Face.morphTargetInfluences[
      nodes.Face.morphTargetDictionary["Smile"]
    ] = 0.8;
    
    
    if (playAudio) {
      audio.play();
      if (script === "welcome") {
        // setAnimation("Greeting");
      } else {
        // setAnimation("Angry");
      }
    } else {
      // setAnimation("Idle");
      audio.pause();
    }
  }, [playAudio, script]);

  const { nodes, materials } = useGLTF("./models/FacialExp5.gltf");
  // const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  // const { animations: angryAnimation } = useFBX(
  //   "/animations/Angry Gesture.fbx"
  // );
  // const { animations: greetingAnimation } = useFBX(
  //   "/animations/Standing Greeting.fbx"
  // );

  // idleAnimation[0].name = "Idle";
  // angryAnimation[0].name = "Angry";
  // greetingAnimation[0].name = "Greeting";

  // const [animation, setAnimation] = useState("Idle");

  const group = useRef();
  // const { actions } = useAnimations(
  //   [idleAnimation[0], angryAnimation[0], greetingAnimation[0]],
  //   group
  // );

  // useEffect(() => {
  //   actions[animation].reset().fadeIn(0.5).play();
  //   return () => actions[animation].fadeOut(0.5);
  // }, [animation]);

  // CODE ADDED AFTER THE TUTORIAL (but learnt in the portfolio tutorial ♥️)
  // useFrame((state) => {
  //   if (headFollow) {
  //     group.current.getObjectByName("Head").lookAt(state.camera.position);
  //   }
  // });



return (
  <group ref={group} {...props} dispose={null}>
    <group name="Scene">
      <mesh
        name="Face"
        castShadow
        receiveShadow
        geometry={nodes.Face.geometry}
        material={materials['Character_A1:Bodymat.001']}
        morphTargetDictionary={nodes.Face.morphTargetDictionary}
        morphTargetInfluences={nodes.Face.morphTargetInfluences}
        position={[-0.002, 1.569, -0.007]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.105}
      />
      <mesh
        name="Eyes"
        castShadow
        receiveShadow
        geometry={nodes.Eyes.geometry}
        material={materials['Character_A1:Bodymat.001']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        name="Hair"
        castShadow
        receiveShadow
        geometry={nodes.Hair.geometry}
        material={materials['Hairmat1.001']}
        position={[-0.002, 1.569, -0.007]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.105}
      />
      <mesh
        name="T_Shirt"
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt.geometry}
        material={materials['Character_A1:Topmat.001']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        name="Shoes"
        castShadow
        receiveShadow
        geometry={nodes.Shoes.geometry}
        material={materials['Character_A1:Shoesmat.001']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        name="Pant"
        castShadow
        receiveShadow
        geometry={nodes.Pant.geometry}
        material={materials['Character_A1:Bottommat.001']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        name="Body"
        castShadow
        receiveShadow
        geometry={nodes.Body.geometry}
        material={materials['Character_A1:Bodymat.001']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
    </group>
  </group>
)
}

useGLTF.preload('./models/FacialExp5.gltf')