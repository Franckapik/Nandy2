import { PerspectiveCamera } from '@react-three/drei';
import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { Vector3 } from "three";
import useEmpty from '../hooks/useEmpty';
import useStore from "../store";


export default function CameraTarget() {

  const offset = new Vector3()

  //looking for empty
  const originCamera = useEmpty('originCamera') 
  const originVehicle = useEmpty('origin1Character') 

  //offset
  const a = new Vector3(...originCamera)
  const b = new Vector3(...originVehicle)
  const positionDown = new Vector3(0,-5,0)
  offset.copy(a).sub(b).add(positionDown)

  //refs
  const cameraRef = useRef()
  const cam = useRef()

  //vehicle vectors
  const vehicleVec = new Vector3()
  const lookUp = new Vector3(0,8,-10)

  useFrame(() => {
    const vehicle = useStore.getState().vehicleObj
    if(vehicle) {
      vehicleVec.copy(vehicle.position).add(lookUp)
      cameraRef.current.position.copy(vehicleVec)
      cam.current.lookAt(vehicleVec)
    }
  })


  return (
  <group ref={cameraRef}>
    <PerspectiveCamera ref={cam} makeDefault fov={35} position={offset}/>
  </group>
  )
}




