import { useGLTF } from "@react-three/drei";
import React from "react";
import { ObjMesh } from './ObjMesh';

export const Model = ({ url, mass, matcaps }) => {
  const { nodes, materials } = useGLTF(url, '/draco/');
  const first = Object.keys(nodes);

  return Object.entries(nodes).map(([name, obj]) => {
    if (obj.type === 'Group' && obj.name !== first[0]) {
      return null
    } else if (obj.type === 'Mesh') {
      if (obj.parent.name === first[0]) {
        return <ObjMesh mat={obj.material} mass={mass} display={true} key={name} {...obj} position={obj.getWorldPosition()} />;
      }
    } else {
      //do nothing
    }
    return null;
  });
};
