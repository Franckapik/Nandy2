import { useGLTF } from "@react-three/drei";
import React from "react";
import { ObjMesh } from './ObjMesh';

export const Model = ({ url, mass, matcaps }) => {
  const { nodes } = useGLTF(url);
  const first = Object.keys(nodes);

  return Object.entries(nodes).map(([name, obj]) => {
    if (obj.type === 'Group' && obj.name !== first[0]) {
      return (
        <group key={name}>
          {Object.entries(obj.children).map(([name, obj]) => {
            return <ObjMesh mat={matcaps} mass={mass} display={true} key={name} {...obj} position={obj.getWorldPosition()} />;
          })}
        </group>
      );
    } else if (obj.type === 'Mesh') {
      if (obj.parent.name === first[0]) {
        obj.geometry.computeBoundingBox();
        const b = obj.geometry.boundingBox.max;
        let bound = [b.x * 2, b.y * 2, b.z * 2]; //half extent ? And for mesh rotated?
        return <ObjMesh mat={matcaps} mass={mass} display={true} key={name} {...obj} position={obj.getWorldPosition()} />;
      }
    } else {
      //do nothing
    }
    return null;
  });
};
