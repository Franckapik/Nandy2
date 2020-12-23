import React from 'react';
import { Model } from './Model';
import { useMatcaps } from '../hooks/useMatcaps';

export const Models = (props) => {
  const matcaps = useMatcaps('./matcaps/128/'); //load just once
  return (
    <>
      <Model matcaps={matcaps} url={'/passive1.gltf'} mass={0} />
      <Model matcaps={matcaps} url={'/active1.gltf'} mass={10} />
    </>
  );
};
