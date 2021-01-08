import { HTML } from '@react-three/drei';
import React from 'react';
import useStore from '../store';

export const Bubble = ({ Text, scale, position, children }) => {
  const visible = useStore((state) => state.visible);
  const bulleOpacity = useStore((state) => state.bulleOpacity);

  return (
    <group position={position}>
      {children}
      {visible && (
        <HTML scaleFactor={scale} center>
          <div className="bulle" style={bulleOpacity}>
            {Text}
          </div>
        </HTML>
      )}
    </group>
  );
};
