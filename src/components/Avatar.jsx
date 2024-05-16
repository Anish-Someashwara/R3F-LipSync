import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ConvolutionShader } from "three/examples/jsm/shaders/ConvolutionShader.js";



const facialExpressions = {
  default: {},
  Angry: {
    "Angry_2": 0.7
  },
  // EyeBlink: {
  //   "Eyeblink_2": 1
  // },
  Surprise: {
    "Surprise_2": 1
  },
  Sad: {
    "Sad_2": 1,
    "Lip_Sad": 0.55
  },
  Smile: {
    "Smile_2": 1,
    "Lip_Smile": 0.5
  },
  // funnyFace: {
  //   jawLeft: 0.63,
  //   mouthPucker: 0.53,
  //   noseSneerLeft: 1,
  //   noseSneerRight: 0.39,
  //   mouthLeft: 1,
  //   eyeLookUpLeft: 1,
  //   eyeLookUpRight: 1,
  //   cheekPuff: 0.9999924982764238,
  //   mouthDimpleLeft: 0.414743888682652,
  //   mouthRollLower: 0.32,
  //   mouthSmileLeft: 0.35499733688813034,
  //   mouthSmileRight: 0.35499733688813034,
  // },
}

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
  console.log("fldkfjdkfj")
  const { nodes, scene, materials, animations: smileAnimation } = useGLTF("./models/FacialExp7.gltf");
  // console.log(smileAnimation)
  // const [animation, setAnimation] = useState("Eyeblink_2");
  const group = useRef();
  // const { actions } = useAnimations(
  //   smileAnimation,
  //   group
  // );
  const [facialExpression, setFacialExpression] = useState("")



  const {
    playAudio,
    script,
    headFollow,
    smoothMorphTarget,
    morphTargetSmoothing,
    animations
  } = useControls({
    playAudio: false,
    smoothMorphTarget: true,
    morphTargetSmoothing: 0.40,
    script: {
      value: "Bot-Intro-3",
      options: ["Bot-Intro", "Bot-Intro-3", "pizzas"],
    },
    // animations: {
    //   value: animation,
    //   options: smileAnimation.map((a) => a.name),
    //   onChange: (value) => setAnimation(value),
    // },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (value) => {
        console.log("Changing Face Exp!", value)
        // !false &&
        // Object.keys(nodes.Face.morphTargetDictionary).forEach((key) => {
        //   const mapping = facialExpressions[value];
        //   if (key === "Eyeblink_2" || key === "Eyeblink_2") { return;}

        //   if (mapping && mapping[key]) {
        //     console.log("changing: ", mapping, mapping[key])
        //     lerpMorphTarget(key, mapping[key], 0.1);
        //   } else {
        //     lerpMorphTarget(key, 0, 0.1);
        //   }
        // });
        setFacialExpression(value)
      },
    },
  });

  const audio = useMemo(() => new Audio(`./audios/${script}.mp3`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `./audios/${script}.json`);
  const lipsync = JSON.parse(jsonFile);

  useFrame(() => {
    ///////// exp1
    !false &&
    Object.keys(nodes.Face.morphTargetDictionary).forEach((key) => {
      const mapping = facialExpressions[facialExpression];
      if (key === "Eye_Blink_2") { return; }

      if (mapping && mapping[key]) {
        // console.log("changing: ", mapping, mapping[key])
        lerpMorphTarget(key, mapping[key], 0.1);
      } else {
        lerpMorphTarget(key, 0, 0.1);
      }
    });
    ///////// exp1

    ///////// exp2
    // const mapping = facialExpressions[facialExpression];
    // if (!mapping) return;
    // Object.keys(nodes.Face.morphTargetDictionary).forEach((key) => {
    //   if (key === "Eye_Blink_2") return;

    //   const value = mapping[key] || 0; // Default value if not mapped
    //   lerpMorphTarget(key, value, 0.05); // Adjust speed for smoother transitions
    // });
    ///////// exp2


    
    // lerpMorphTarget("Eyeblink_2", blink ? 1 : 0, 0.5);
    // console.log("HIIi")
    const currentAudioTime = audio.currentTime;
    if (audio.paused || audio.ended) {
      return;
    }

    // nodes.Face.morphTargetInfluences[
    //     nodes.Face.morphTargetDictionary["Smile"]
    //   ] = THREE.MathUtils.lerp(
    //     nodes.Face.morphTargetInfluences[
    //       nodes.Face.morphTargetDictionary["Smile"]
    //     ],
    //     0.3,
    //     0.01
    //   );

    ////// LipSync-1
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
    ////// LipSync-1



    ////// LipSync-2
    // Object.values(corresponding).forEach((value) => {
    //   if (!smoothMorphTarget) {
    //     nodes.Face.morphTargetInfluences[
    //       nodes.Face.morphTargetDictionary[value]
    //     ] = 0;
    //   } else {
    //     const targetInfluence = lipsync.mouthCues.reduce((acc, mouthCue) => {
    //       const cueValue = corresponding[mouthCue.value];
    //       if (value === cueValue && currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
    //         const intensity = mouthCue.intensity || 1; // Default intensity if not provided
    //         acc = intensity;
    //       }
    //       return acc;
    //     }, 0);
        
    //     nodes.Face.morphTargetInfluences[
    //       nodes.Face.morphTargetDictionary[value]
    //     ] = THREE.MathUtils.lerp(
    //       nodes.Face.morphTargetInfluences[
    //         nodes.Face.morphTargetDictionary[value]
    //       ],
    //       targetInfluence,
    //       morphTargetSmoothing
    //     );
    //   }
    // });
    ////// LipSync-2


  });


  // const [facialExpression, setBlink] = useState(1);
  // const [winkLeft, setWinkLeft] = useState(false);
  // const [winkRight, setWinkRight] = useState(false);
  // const [blink, setBlink] = useState(false);


  useEffect(() => {
    
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



  // ********************************** Eyes Blink Animation **********************************

    ////// EyeBlink-1
  useEffect(()=>{
    setInterval(() => {
      // console.log("****** Eye Blinked! ******")
      const closeFunc = () => {
        nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink_2"]] = 0;
      };

      setTimeout(() => {
        nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink_2"]] = 1;
        setTimeout(closeFunc, 200);
      }, THREE.MathUtils.randInt(3500, 7500));
      
    }, 5000);
  },[])
    ////// EyeBlink-1

  
  ////// EyeBlink-2
  // useEffect(() => {
  //   const blink = () => {
  //     const closeDuration = THREE.MathUtils.randInt(100, 200); // Short duration for closing
  //     const closeStart = Date.now();
  //     const closeEnd = closeStart + closeDuration;
  //     const openDuration = THREE.MathUtils.randInt(100, 200); // Short duration for opening
  //     const openStart = closeEnd; // Start opening right after closing ends
  //     const openEnd = openStart + openDuration;
  //     const initialWeight = nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink_2"]];
  //     const targetWeight = 1; // Always close the eyes
  
  //     const updateMorphTarget = () => {
  //       const now = Date.now();
  //       let progress, weight;
  
  //       if (now < closeEnd) {
  //         // Closing phase
  //         progress = Math.min(1, (now - closeStart) / closeDuration);
  //         weight = THREE.MathUtils.lerp(initialWeight, targetWeight, progress);
  //       } else if (now < openEnd) {
  //         // Opening phase
  //         progress = Math.min(1, (now - openStart) / openDuration);
  //         weight = THREE.MathUtils.lerp(targetWeight, initialWeight, progress);
  //       } else {
  //         return; // Blink animation finished
  //       }
  
  //       nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink_2"]] = weight;
  //       requestAnimationFrame(updateMorphTarget);
  //     };
  
  //     updateMorphTarget();
  //   };
  
  //   const blinkLoop = () => {
  //     blink();
  //     setTimeout(blinkLoop, THREE.MathUtils.randInt(2000, 4000)); // Interval between blinks
  //   };
  
  //   blinkLoop();
  
  // }, []);



  // useEffect(() => {
  //   const blink = () => {
  //     const closeDuration = THREE.MathUtils.randInt(100, 200); // Short duration for closing
  //     const closeStart = Date.now();
  //     const closeEnd = closeStart + closeDuration;
  //     const openDuration = THREE.MathUtils.randInt(100, 200); // Short duration for opening
  //     const openStart = closeEnd; // Start opening right after closing ends
  //     const openEnd = openStart + openDuration;
  //     const initialWeight = nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink_2"]];
  //     const targetWeight = 1; // Always close the eyes
  
  //     const updateMorphTarget = () => {
  //       const now = Date.now();
  //       let progress, weight;
  
  //       if (now < closeEnd) {
  //         // Closing phase
  //         progress = Math.min(1, (now - closeStart) / closeDuration);
  //         weight = THREE.MathUtils.lerp(initialWeight, targetWeight, progress);
  //       } else if (now < openEnd) {
  //         // Opening phase
  //         progress = Math.min(1, (now - openStart) / openDuration);
  //         weight = THREE.MathUtils.lerp(targetWeight, initialWeight, progress);
  //       } else {
  //         // Reset the morph target influence to its initial value after the animation completes
  //         nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink_2"]] = initialWeight;
  //         return; // Blink animation finished
  //       }
  
  //       nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink_2"]] = weight;
  //       requestAnimationFrame(updateMorphTarget);
  //     };
  
  //     updateMorphTarget();
  //   };
  
  //   const blinkLoop = () => {
  //     blink();
  //     setTimeout(() => {
  //       // Restore the initial morph target influence after a short delay to ensure eyes fully open
  //       nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink_2"]] = 0;
  //     }, 500); // Adjust delay as needed
  //     setTimeout(blinkLoop, THREE.MathUtils.randInt(2000, 4000)); // Interval between blinks
  //   };
  
  //   blinkLoop();
  // }, []);
  
  
  
  

  // ************** Animation Stuff **************

  // useEffect(() => {
  //   actions[animation].reset().fadeIn(0.5).play();
  //   return () => actions[animation].fadeOut(0.5);
  // }, [animation]);

  // Find the EyeBlink_2 animation clip
  // const eyeBlinkClip = smileAnimation.find((clip) => clip.name === "Eyeblink_2");

  // // // Adjust the time scale of EyeBlink_2 animation
  // useEffect(() => {
  //   if (eyeBlinkClip) {
  //     eyeBlinkClip.timeScale = 0.1; // Set the desired time scale
  //     eyeBlinkClip.duration = 2; // Set the desired time scale
  //   }
  // }, [eyeBlinkClip]);
  ////// EyeBlink-2
  

  
  

  // *************************************** Lerp Function ***************************************
    ////// LerpFunc-1
  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          console.log("return")
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
        // console.log(child)

        if (!false) {
          // console.log("setting")
          try {
            set({
              [target]: value,
            });
          } catch (e) {}
        }
        
      }
    });
  };
  ////// LerpFunc-1

  ////// LerpFunc-2
  // const lerpMorphTarget = (target, value, speed = 0.1) => {
  //   scene.traverse((child) => {
  //     if (child.isMesh && child.morphTargetDictionary) {
  //       const index = child.morphTargetDictionary[target];
  //       if (index === undefined || child.morphTargetInfluences[index] === undefined) {
  //         return;
  //       }
  //       child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
  //         child.morphTargetInfluences[index],
  //         value,
  //         speed
  //       );
  //     }
  //   });
  // };
  ////// LerpFunc-2




  // *********************** Morph Target Controls ***********************



  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Face"
          castShadow
          receiveShadow
          geometry={nodes.Face.geometry}
          material={materials['Character_A1:Bodymat']}
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
          material={materials['Character_A1:Bodymat']}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
        <mesh
          name="Hair"
          castShadow
          receiveShadow
          geometry={nodes.Hair.geometry}
          material={materials.Hairmat1}
          position={[-0.002, 1.569, -0.007]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.105}
        />
        <mesh
          name="T_Shirt"
          castShadow
          receiveShadow
          geometry={nodes.T_Shirt.geometry}
          material={materials['Character_A1:Topmat']}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
        <mesh
          name="Shoes"
          castShadow
          receiveShadow
          geometry={nodes.Shoes.geometry}
          material={materials['Character_A1:Shoesmat']}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
        <mesh
          name="Pant"
          castShadow
          receiveShadow
          geometry={nodes.Pant.geometry}
          material={materials['Character_A1:Bottommat']}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
        <mesh
          name="Body"
          castShadow
          receiveShadow
          geometry={nodes.Body.geometry}
          material={materials['Character_A1:Bodymat']}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
      </group>
    </group>
  )
}

useGLTF.preload('./models/FacialExp7.gltf')
