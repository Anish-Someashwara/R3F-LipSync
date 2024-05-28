import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import facialExpressions from "./facialExpressions.json"



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
};

export function Avatar(props) {

  const { nodes, scene, materials, animations: smileAnimation } = useGLTF("./models/FacialExp11.gltf");
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        console.log("Enabling Shadows for Character!")
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.needsUpdate = true; // Ensure material updates to support shadows
      }
    });
  }, [scene]);


  const group = useRef();
  const { actions } = useAnimations( [smileAnimation[0], smileAnimation[1], smileAnimation[2], smileAnimation[3]], group);
  const [animation, setAnimation] = useState("Idle");
  // console.log(greetingAnimation)
  smileAnimation[3].name = "Idle";
  // greetingAnimation[0].name = "GreetingAnimation"
  

  // Play idle animation continuously
  // useEffect(() => {
  //   actions["Idle"].reset().fadeIn(0.5).play();
  //   return () => actions["Idle"].fadeOut(0.5);
  // }, [actions]);


  // Play selected animation when it changes
  useEffect(() => {
    // if (animation !== "Idle") {
    //   actions[animation].reset().fadeIn(0.5).play();
    //   return () => actions[animation].fadeOut(0.5);
    // }
    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation, actions]);

  // useEffect(() => {
  //   actions[animation].reset().fadeIn(0.5).play();
  //   return () => actions[animation].fadeOut(0.5);
  // }, [animation]);

  //********************************* */
  // useEffect(() => {
  //   if (actions[animation]) {
  //     // Ensure the current animation plays only once
  //     actions[animation].setLoop(THREE.LoopOnce, 1);
  //     actions[animation].reset().fadeIn(0.5).play();

  //     // Stop the animation at the end
  //     actions[animation].clampWhenFinished = true;
  //     actions[animation].paused = false;

  //     // Listen for when the animation finishes
  //     actions[animation].getMixer().addEventListener('finished', (event) => {
  //       if (event.action === actions[animation]) {
  //         setAnimation('Idle');
  //       }
  //     });

  //     return () => {
  //       actions[animation].fadeOut(0.5);
  //       actions[animation].getMixer().removeEventListener('finished');
  //     };
  //   }
  // }, [animation, actions]);

  // useEffect(() => {
  //   // Ensure the Idle animation plays in a loop when no other animation is playing
  //   if (animation === "Idle" && actions.Idle) {
  //     actions.Idle.setLoop(THREE.LoopRepeat);
  //     actions.Idle.reset().fadeIn(0.5).play();
  //   }
  // }, [animation, actions]);
  //********************************* */

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
      value: "Puppy-2",
      options: ["LotteryPrank", "BusinessSales-1", "BusinessSales-2", "Puppy-1", "Puppy-2", "Puppy-3", "pizzas"],
      // options: ["LotteryPrank", "BusinessSales", "Puppy1", "Puppy2", "Puppy3", "pizzas", "Bot-Intro", "Bot-Intro-3",],
    },
    // animations: {
    //   value: animation,
    //   // options: smileAnimation.map((a) => a.name),
    //   options: smileAnimation.map(a => a.name),
    //   onChange: (value) => setAnimation(value),
    // },
    // facialExpression: {
    //   options: Object.keys(facialExpressions),
    //   onChange: (value) => {
    //     console.log("Changing Face Exp!", value)
    //     setFacialExpression(value)
    //   },
    // },
  });

  const audio = useMemo(() => new Audio(`./audios/${script}.mp3`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `./audios/${script}.json`);
  const lipsync = JSON.parse(jsonFile);

  

  useFrame((state, delta) => {
      // console.log(state, delta)
    ///////// exp1
    !false &&
    Object.keys(nodes.Face.morphTargetDictionary).forEach((key) => {
      const mapping = facialExpressions[facialExpression];
      if (key === "Eye_Blink") { return; }

      if (mapping && mapping[key]) {
        // console.log("changing: ", mapping, mapping[key])
        lerpMorphTarget(key, mapping[key], 0.05);
      } else {
        lerpMorphTarget(key, 0, 0.05);
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
      // if(audio.ended) playAudio = false;
      setFacialExpression('IdleSmile')
      setAnimation('Idle');
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
        // console.log("setting face exp: ", mouthCue.exp)
        setFacialExpression(mouthCue.exp)
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
    // // Reset all morph target influences towards 0 smoothly
    // Object.keys(corresponding).forEach((key) => {
    //   const targetIndex = nodes.Face.morphTargetDictionary[corresponding[key]];

    //   nodes.Face.morphTargetInfluences[targetIndex] = THREE.MathUtils.lerp(
    //     nodes.Face.morphTargetInfluences[targetIndex],
    //     0,
    //     morphTargetSmoothing
    //   );
    // });

    // Object.values(corresponding).forEach((value) => {
    //   if (!smoothMorphTarget) {
    //     nodes.Face.morphTargetInfluences[
    //       nodes.Face.morphTargetDictionary[value]
    //     ] = 0;
    //   } else {
    //     const targetInfluence = lipsync.mouthCues.reduce((acc, mouthCue) => {
    //       const cueValue = corresponding[mouthCue.value];
    //       if (value === cueValue && currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
    //         const intensity = 1; // Default intensity if not provided
    //         acc = intensity;
    //         setFacialExpression(mouthCue.exp)
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


    ////// LipSync-3
    // // Define a smoothing factor for transitions
    // const smoothingFactor = 0.3;

    // // Reset all morph target influences towards 0 smoothly
    // Object.keys(corresponding).forEach((key) => {
    //   const targetIndex = nodes.Face.morphTargetDictionary[corresponding[key]];

    //   nodes.Face.morphTargetInfluences[targetIndex] = THREE.MathUtils.lerp(
    //     nodes.Face.morphTargetInfluences[targetIndex],
    //     0,
    //     smoothingFactor
    //   );
    // });

    // // Apply the appropriate mouth cue influence smoothly
    // for (let i = 0; i < lipsync.mouthCues.length; i++) {
    //   const mouthCue = lipsync.mouthCues[i];

    //   if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
    //     const targetIndex = nodes.Face.morphTargetDictionary[corresponding[mouthCue.value]];

    //     nodes.Face.morphTargetInfluences[targetIndex] = THREE.MathUtils.lerp(
    //       nodes.Face.morphTargetInfluences[targetIndex],
    //       1,
    //       smoothingFactor
    //     );

    //     break;
    //   }
    // }
    ////// LipSync-3


  });


  // const [facialExpression, setBlink] = useState(1);
  // const [winkLeft, setWinkLeft] = useState(false);
  // const [winkRight, setWinkRight] = useState(false);
  // const [blink, setBlink] = useState(false);


  useEffect(() => {

    // console.log("fd")
    if (playAudio) {
      audio.play();
      if (script === "Puppy-3") {
        setAnimation("Talking_One");
      } 
      else if(script === "BusinessSales-2") {
        setAnimation("Talking_Two");
      }
      else if(script === "Bot-Intro-3"){
        // setAnimation("GreetingAnimation")
      }
    } 
    else {
      setAnimation("Idle");
      audio.pause();
    }

  }, [playAudio, script]);



  // ********************************** Eyes Blink Animation **********************************

    ////// EyeBlink-1
  // useEffect(()=>{
  //   setInterval(() => {
  //     // console.log("****** Eye Blinked! ******")
  //     const closeFunc = () => {
  //       nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink"]] = 0;
  //     };

  //     setTimeout(() => {
  //       nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink"]] = 1;
  //       setTimeout(closeFunc, 200);
  //     }, THREE.MathUtils.randInt(3500, 7500));
      
  //   }, 5000);
  // },[])
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



  useEffect(() => {
    const blink = () => {
      const closeDuration = THREE.MathUtils.randInt(100, 200); // Short duration for closing
      const closeStart = Date.now();
      const closeEnd = closeStart + closeDuration;
      const openDuration = THREE.MathUtils.randInt(100, 200); // Short duration for opening
      const openStart = closeEnd; // Start opening right after closing ends
      const openEnd = openStart + openDuration;
      const initialWeight = nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink"]];
      const targetWeight = 1; // Always close the eyes
  
      const updateMorphTarget = () => {
        const now = Date.now();
        let progress, weight;
  
        if (now < closeEnd) {
          // Closing phase
          progress = Math.min(1, (now - closeStart) / closeDuration);
          weight = THREE.MathUtils.lerp(initialWeight, targetWeight, progress);
        } else if (now < openEnd) {
          // Opening phase
          progress = Math.min(1, (now - openStart) / openDuration);
          weight = THREE.MathUtils.lerp(targetWeight, initialWeight, progress);
        } else {
          // Reset the morph target influence to its initial value after the animation completes
          nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink"]] = initialWeight;
          return; // Blink animation finished
        }
  
        nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink"]] = weight;
        requestAnimationFrame(updateMorphTarget);
      };
  
      updateMorphTarget();
    };
  
    const blinkLoop = () => {
      blink();
      setTimeout(() => {
        // Restore the initial morph target influence after a short delay to ensure eyes fully open
        nodes.Face.morphTargetInfluences[nodes.Face.morphTargetDictionary["Eye_Blink"]] = 0;
      }, 500); // Adjust delay as needed
      setTimeout(blinkLoop, THREE.MathUtils.randInt(2000, 4000)); // Interval between blinks
    };
  
    blinkLoop();
  }, []);
  
  
  
  

  // ************** Animation Stuff **************

  // useEffect(() => {
  //   actions[animation].reset().fadeIn(0.5).play();
  //   return () => actions[animation].fadeOut(0.5);
  // }, [animation]);

  // Find the EyeBlink_2 animation clip
  // const idelClip = smileAnimation.find((clip) => clip.name === "Idle");

  // // Adjust the time scale of EyeBlink_2 animation
  // useEffect(() => {
  //   if (idelClip) {
  //     console.log("********************")
  //     idelClip.timeScale = 1; // Set the desired time scale
  //     // idelClip.duration = 2; // Set the desired time scale
  //   }
  // }, [idelClip]);
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
  // const [, set] = useControls("MorphTarget", () =>
  //   Object.assign(
  //     {},
  //     ...Object.keys(nodes.Face.morphTargetDictionary).map((key) => {
  //       return {
  //         [key]: {
  //           label: key,
  //           value: 0,
  //           min: nodes.Face.morphTargetInfluences[
  //             nodes.Face.morphTargetDictionary[key]
  //           ],
  //           max: 1,
  //           onChange: (val) => {
  //             if (true) {
  //               // console.log("HII", key, val)
  //               lerpMorphTarget(key, val, 1);
  //             }
  //           },
  //         },
  //       };
  //     })
  //   )
  // );


  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="Body"
            geometry={nodes.Body.geometry}
            material={materials.Bodymat3}
            skeleton={nodes.Body.skeleton}
          />
          <skinnedMesh
            name="Face"
            geometry={nodes.Face.geometry}
            material={materials.Bodymat3}
            skeleton={nodes.Face.skeleton}
            morphTargetDictionary={nodes.Face.morphTargetDictionary}
            morphTargetInfluences={nodes.Face.morphTargetInfluences}
          />
          <skinnedMesh
            name="Hair"
            geometry={nodes.Hair.geometry}
            material={materials.Hairmat1}
            skeleton={nodes.Hair.skeleton}
          />
          <skinnedMesh
            name="Pant"
            geometry={nodes.Pant.geometry}
            material={materials['Character_A1:Bottommat']}
            skeleton={nodes.Pant.skeleton}
          />
          <skinnedMesh
            name="Shoes"
            geometry={nodes.Shoes.geometry}
            material={materials['Character_A1:Shoesmat']}
            skeleton={nodes.Shoes.skeleton}
          />
          <skinnedMesh
            name="T_Shirt"
            geometry={nodes.T_Shirt.geometry}
            material={materials['Character_A1:Topmat']}
            skeleton={nodes.T_Shirt.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('./models/FacialExp11.gltf')