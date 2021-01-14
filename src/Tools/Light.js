import React, { useLayoutEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import useEmpty from '../hooks/useEmpty';
import useStore from '../store';

export const Light = (props) => {
  const { scene } = useThree();
  const lightPos = useEmpty('origin1Light');
  const lightPos2 = useEmpty('origin1LightPano');
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
      <spotLight ref={spotlight} position={lightPos} angle={0.8} penumbra={1} intensity={0.05} color="white" castShadow />
      <spotLight  position={lightPos2} angle={0.1} penumbra={0} intensity={1} color="blue" castShadow />
    </>
  );
};
