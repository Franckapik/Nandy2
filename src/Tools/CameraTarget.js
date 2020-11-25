import { OrbitControls } from '@react-three/drei'
import React, {useRef} from 'react'
import {useFrame, useThree} from 'react-three-fiber'
import useStore from "../store";
import { Vector3 } from "three";


export default function CameraTarget() {

  const offset = new Vector3() //Orbit
  const offset2 = new Vector3(0,2,8) //Fixed
  const offset3 = new Vector3(0,1,-5) //Lookat offset
  const ref = useRef();
  const cameraControlsEnabled = useStore(state => state.cameraControlsEnabled)
  const cameraTarget = useStore(state => state.cameraTarget)


  useFrame(({camera}) => {
    if(cameraTarget && ref.current) {
      const posTarget= new Vector3(...cameraTarget) //position of vehicle (=target lookAT)
      offset.copy(camera.position).sub(ref.current.target) 
      //distance camera-vehicle setted by OrbitControls.
      posTarget.add(offset3)
      ref.current.target.copy(posTarget) //look at the target = vehicle
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
      minDistance={15}
      maxDistance={50}
      zoomSpeed={5}
      minPolarAngle={Math.PI/104}
      maxPolarAngle={Math.PI/2.5}
      mouseButtons = {{ LEFT : 2}}
    />
  );
}

