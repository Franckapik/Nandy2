import { OrbitControls } from 'drei'
import React, {useRef} from 'react'
import {useFrame, useThree} from 'react-three-fiber'
import useStore from "../store";
import { Vector3 } from "three";


export default function CameraTarget() {

  const offset = new Vector3(10,10,100)
  const ref = useRef();
  const cameraControlsEnabled = useStore(state => state.cameraControlsEnabled)
  const cameraTarget = useStore(state => state.cameraTarget)


  useFrame(({camera}) => {
    if(cameraTarget) {
      const posTarget = new Vector3(cameraTarget[0],cameraTarget[1],cameraTarget[2])
      offset.copy(camera.position).sub(ref.current.target)
      ref.current.target.copy(posTarget) //look at the target
      camera.position.copy(posTarget).add(offset) //set camera position + offset
    }
  })


  return (
    <OrbitControls
      ref={ref}
      enabled={cameraControlsEnabled}
      enableRotate={false}
      enableDamping
      dampingFactor={0.1}
      enableKeys={false}
      enablePan
      enableZoom
      minDistance={10}
      maxDistance={100}
      zoomSpeed={5}
      minPolarAngle={Math.PI/6}
      maxPolarAngle={Math.PI/2.5}
      mouseButtons = {{ LEFT : 2}}
    />
  );
}
