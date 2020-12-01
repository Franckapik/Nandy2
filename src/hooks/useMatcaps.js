import * as THREE from 'three';
import { useLoader } from 'react-three-fiber';

//const preloaded = useGLTF.preload('/pilar.glb')
//console.log(preloaded);
//or maybe useLoader.preload(GLTFLoader, url)
export const useMatcaps = (urlMat) => {
  const [beige, blanc, bleuC, gris, jaune, marron, noir, orange, rouge, turquoise, vert] = useLoader(THREE.TextureLoader, [`${urlMat}beige.png`, `${urlMat}blanc.png`, `${urlMat}bleu.png`, `${urlMat}gris.png`, `${urlMat}jaune.png`, `${urlMat}marron.png`, `${urlMat}noir.png`, `${urlMat}orange.png`, `${urlMat}rouge.png`, `${urlMat}turquoise.png`, `${urlMat}vert.png`]);

  const matcaps = {
    "marron": marron,
    "beige": beige,
    "blanc": blanc,
    "bleuF": noir,
    "bleuC": bleuC,
    "gris": gris,
    "jaune": jaune,
    "orange": orange,
    "vert": vert,
    "rouge": rouge,
    "turquoise": turquoise,
  };

  return matcaps;
};
