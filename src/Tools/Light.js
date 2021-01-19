import React, { useLayoutEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import useEmpty from '../hooks/useEmpty';
import useStore from '../store';

export const Light = (props) => {
  const { scene } = useThree();
  const lightPos = useEmpty('origin1Light');
  const lightPos2 = useEmpty('origin1LightPano');
  const spotlight = useRef();
  const vehicle = useStore(state => state.vehicleObj);

  useLayoutEffect(() => {
    if (vehicle) {
      spotlight.current.target = vehicle;
    }
  });

  return (
    <>
      <spotLight ref={spotlight} position={lightPos} angle={0.3} penumbra={0.5} intensity={0.5} distance={50} color="white" castShadow />
    </>
  );
};
