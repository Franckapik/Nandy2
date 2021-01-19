import { PerspectiveCamera } from '@react-three/drei';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { Vector3 } from "three";
import useEmpty from '../hooks/useEmpty';
import useStore from "../store";


export default function CameraTarget() {

  const offset = new Vector3()

  //looking for empty
  const originCamera = useEmpty('originCamera') 
  const originVehicle = useEmpty('origin1Character') 
  const cameraTarget = useStore(state => state.cameraTarget)


  //offset
  const a = new Vector3(...originCamera)
  const b = new Vector3(...originVehicle)
  const positionDown = new Vector3(0,-5,0)
  offset.copy(a).sub(b).add(positionDown)

  //refs
  const cameraRef = useRef()
  const cam = useRef()
  const spotlight = useRef();
  const cubeRef = useRef();



  //vehicle vectors
  const vehicleVec = new Vector3()
  const targetVec = new Vector3()
  const lookUp = new Vector3(0,8,-10)
  const lookY = new Vector3(0,0,20)
  const lookX = new Vector3(20,0,0)

  useFrame(() => {
    if (cameraTarget.position) {
      targetVec.copy(cameraTarget.position)
      cam.current.position.lerp(lookY, 0.05) 
      cameraRef.current.position.lerp(targetVec,0.05)
      cam.current.lookAt(cameraTarget.position)
      spotlight.current.position.copy(lookY)   
      spotlight.current.target = cameraTarget;
      spotlight.current.angle = 1

    } else {
      const vehicle = useStore.getState().vehicleObj
      if(vehicle) {
        vehicleVec.copy(vehicle.position).add(lookUp)
        cameraRef.current.position.copy(vehicleVec)
        cam.current.position.copy(offset) 
        cam.current.lookAt(vehicleVec)
        spotlight.current.position.copy(offset) 
        spotlight.current.target = cubeRef.current;
        spotlight.current.angle = 0.4

    }
    }
  })

  return (
  <group ref={cameraRef}>
    <PerspectiveCamera ref={cam} makeDefault fov={35}/>
    <spotLight ref={spotlight} angle={0.4} penumbra={0.3} intensity={0.5} distance={100} color="white" castShadow />
    <mesh visible={true} ref={cubeRef} position={[-5,-5,5]}>
        <boxBufferGeometry />
        <meshLambertMaterial color="hotpink" />
      </mesh>
  );
  </group>
  )
}




