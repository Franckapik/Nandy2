import React, { useLayoutEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import useEmpty from '../hooks/useEmpty';
import useStore from '../store';

export const Light = (props) => {
  const { scene } = useThree();
  const lightPos = useEmpty('origin1Light');
  window.scene = scene;
  const spotlight = useRef();
  const vehicle = useStore(state => state.vehicleObj);

  useLayoutEffect(() => {
    if (vehicle) {
      spotlight.current.target = vehicle;
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      <spotLight ref={spotlight} position={lightPos} angle={0.8} penumbra={1} intensity={0.4} color="white" castShadow />
    </>
  );
};
