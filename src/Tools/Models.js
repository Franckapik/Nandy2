import React from 'react';
import { Model } from './Model';
import { useRandomFromNavmesh } from '../hooks/useRandomFromNavmesh';
import { InstanciateMesh } from './InstanciateMesh';

export const Models = (props) => {
  const randomPositions = useRandomFromNavmesh('/navmesh_applied.glb', 1000, 3);

  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/traversant1.gltf'} mass={0} collision={0} />
      <Model url={'/onclick1.gltf'} mass={0} collision={0} />
      <InstanciateMesh arrayOfPositions={randomPositions} meshUrl={'./traversant.glb'} nameMesh={'Herb'} maxNumber={1000} />
    </>
  );
};
