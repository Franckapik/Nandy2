import { useGLTF } from "@react-three/drei";


export default function useEmpty(name) {
    const { nodes } = useGLTF('/empty.glb', '/draco/')
    return [nodes[name].position.x,nodes[name].position.y,nodes[name].position.z];
  }