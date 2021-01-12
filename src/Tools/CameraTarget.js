import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import React, {useEffect, useRef, useState} from 'react'
import {useFrame, useThree} from 'react-three-fiber'
import useStore from "../store";
import { Vector3 } from "three";
import useEmpty from '../hooks/useEmpty';


export default function CameraTarget() {

  const offset = new Vector3()

  //looking for empty
  const originCamera = useEmpty('originCamera') 
  const originVehicle = useEmpty('origin1Character') 
  const cameraTarget = useStore(state => state.cameraTarget)
  const changeTarget = useStore(state => state.changeTarget)

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
  const targetVec = new Vector3()
  const lookUp = new Vector3(0,8,-10)
  const lookY = new Vector3(0,0,20)
  const lookX = new Vector3(20,0,0)

  useEffect(() => {
    console.log(cameraTarget);
  }, [cameraTarget])

  useFrame(() => {
    if (cameraTarget.length) {
      targetVec.copy(cameraTarget)
      cam.current.position.copy(lookY)
      cameraRef.current.position.copy(targetVec)
      cam.current.lookAt(cameraTarget)  
    } else {
      const vehicle = useStore.getState().vehicleObj
      if(vehicle) {
        vehicleVec.copy(vehicle.position).add(lookUp)
        cameraRef.current.position.copy(vehicleVec)
        cam.current.lookAt(vehicleVec)  
    }
    }
  })

  return (
  <group ref={cameraRef}>
    <PerspectiveCamera ref={cam} makeDefault fov={35} position={offset}/>
  </group>
  )
}




