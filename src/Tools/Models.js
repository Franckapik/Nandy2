import React from 'react';
import { Model } from './Model';
import { useMatcaps } from '../hooks/useMatcaps';

export const Models = (props) => {
  const matcaps = useMatcaps('./matcaps/128/'); //load just once
  return (
    <>
      <Model matcaps={matcaps} url={'/passive.gltf'} mass={0} />
      <Model matcaps={matcaps} url={'/active.gltf'} mass={10} />
    </>
  );
};
