import React from 'react';
import { useRandom } from '../hooks/useRandom';
import { InstanciateMesh } from './InstanciateMesh';

export const MeshOnNavMesh = ({ navMeshUrl, nameNavMesh, meshUrl, nameMesh, maxNumber }) => {
  const [random, navPos] = useRandom(navMeshUrl, nameNavMesh, maxNumber);
  return <InstanciateMesh position={navPos} arrayOfPositions={random} meshUrl={meshUrl} nameMesh={nameMesh} maxNumber={maxNumber} />;
};
