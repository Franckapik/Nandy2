import React from 'react';
import { Model } from './Model';
import { useMatcaps } from '../hooks/useMatcaps';

export const Models = (props) => {
  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/traversant1.gltf'} mass={0} collision={0} />
      <Model url={'/onclick1.gltf'} mass={0} collision={0} />
    </>
  );
};
