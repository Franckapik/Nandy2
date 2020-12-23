import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import React, {useRef} from 'react'
import {useFrame, useThree} from 'react-three-fiber'
import useStore from "../store";
import { Vector3 } from "three";
import useEmpty from '../hooks/useEmpty';


export default function CameraTarget() {

  const offset = new Vector3()
  const cameraTarget = useStore(state => state.cameraTarget)

  //calcul initial offset Vehicle-Camera from blender
  const originCamera = useEmpty('originCamera') 
  const originVehicle = useEmpty('origin1Character') 
  const a = new Vector3(...originCamera)
  const b = new Vector3(...originVehicle)

  const moovingVehicle = new Vector3(...cameraTarget)
  offset.copy(a).sub(b)
  
  const cameraRef = useRef()
  const cam = useRef()

  useFrame(() => {
  cameraRef.current.position.copy(moovingVehicle)
  cam.current.lookAt(moovingVehicle)
  })
  
  return (
  <group ref={cameraRef}>
    <PerspectiveCamera ref={cam} makeDefault fov={30} position={offset}/>
  </group>
  )
}




