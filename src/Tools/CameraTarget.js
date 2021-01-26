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
  const lookUp = new Vector3(0,8,0)
  const lookY = new Vector3(0,0,20)
/*   const lookX = new Vector3(20,0,0)
 */  const scrollOffset = new Vector3(0,0,0)
  const lookZup = new Vector3(-30,12,22)

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
        scrollOffset.set(0,0,useStore.getState().top / 8 * -1)
        vehicleVec.copy(vehicle.position).add(lookUp)
        cameraRef.current.position.copy(vehicleVec).add(scrollOffset) 
        if (scrollOffset.z !== 0) {
          vehicleVec.copy(vehicle.position).add(lookUp).add(scrollOffset) 
        }

        lookZup.setX(vehicle.position.z/2)

        if (vehicle.position.z < -40) {
          lookZup.setZ(-22)
        }
        if (vehicle.position.z > -40) {
          lookZup.setZ(22)
        }

        cam.current.position.copy(lookZup)
        cam.current.lookAt(vehicleVec)
        cameraRef.current.position.copy(vehicleVec)
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




