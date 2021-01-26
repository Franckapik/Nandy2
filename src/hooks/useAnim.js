import { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import useToggle from './useToggle';

export const useAnim = ({ max, axis, direction, speed, initial }) => {
  const [anim, play] = useToggle(initial);

  const ref = useRef();

  useFrame(() => {
    if (anim && ref.current.position.y <= max) {
      ref.current.position[axis] += speed * direction;
    }
  });

  return [ref, play];

};
