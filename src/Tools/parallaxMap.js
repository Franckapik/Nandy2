import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const parallaxMapVert = `
varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vViewPosition = -mvPosition.xyz;
  vNormal = normalize( normalMatrix * normal );
  gl_Position = projectionMatrix * mvPosition;
}`

const parallaxMapFragPars = `

uniform sampler2D map;
uniform sampler2D bumpMap;

uniform float parallaxScale;
uniform float parallaxMinLayers;
uniform float parallaxMaxLayers;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;


#ifdef USE_BASIC_PARALLAX
  vec2 parallaxMap( in vec3 V ) {
    float initialHeight = texture2D( bumpMap, vUv ).r;
    // No Offset Limitting: messy, floating output at grazing angles.
    //vec2 texCoordOffset = parallaxScale * V.xy / V.z * initialHeight;

    // Offset Limiting
    vec2 texCoordOffset = parallaxScale * V.xy * initialHeight;
    return vUv - texCoordOffset;

  }
#else

  vec2 parallaxMap( in vec3 V ) {
    // Determine number of layers from angle between V and N
    float numLayers = mix( parallaxMaxLayers, parallaxMinLayers, abs( dot( vec3( 0.0, 0.0, 1.0 ), V ) ) );
    float layerHeight = 1.0 / numLayers;
    float currentLayerHeight = 0.0;
    // Shift of texture coordinates for each iteration
    vec2 dtex = parallaxScale * V.xy / V.z / numLayers;
    vec2 currentTextureCoords = vUv;
    float heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;
    // while ( heightFromTexture > currentLayerHeight )
    // Infinite loops are not well supported. Do a large finite
    // loop, but not too large, as it slows down some compilers.
    for ( int i = 0; i < 30; i += 1 ) {
      if ( heightFromTexture <= currentLayerHeight ) {
        break;
      }
      currentLayerHeight += layerHeight;
      // Shift texture coordinates along vector V
      currentTextureCoords -= dtex;
      heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;
    }
    #ifdef USE_STEEP_PARALLAX
      return currentTextureCoords;
    #elif defined( USE_RELIEF_PARALLAX )
      vec2 deltaTexCoord = dtex / 2.0;
      float deltaHeight = layerHeight / 2.0;
      // Return to the mid point of previous layer
      currentTextureCoords += deltaTexCoord;
      currentLayerHeight -= deltaHeight;
      // Binary search to increase precision of Steep Parallax Mapping
      const int numSearches = 5;
      for ( int i = 0; i < numSearches; i += 1 ) {
        deltaTexCoord /= 2.0;
        deltaHeight /= 2.0;
        heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;
        // Shift along or against vector V
        if( heightFromTexture > currentLayerHeight ) { // Below the surface
          currentTextureCoords -= deltaTexCoord;
          currentLayerHeight += deltaHeight;
        } else { // above the surface
          currentTextureCoords += deltaTexCoord;
          currentLayerHeight -= deltaHeight;
        }
      }
      return currentTextureCoords;
    #elif defined( USE_OCLUSION_PARALLAX )
      vec2 prevTCoords = currentTextureCoords + dtex;
      // Heights for linear interpolation
      float nextH = heightFromTexture - currentLayerHeight;
      float prevH = texture2D( bumpMap, prevTCoords ).r - currentLayerHeight + layerHeight;
      // Proportions for linear interpolation
      float weight = nextH / ( nextH - prevH );
      // Interpolation of texture coordinates
      return prevTCoords * weight + currentTextureCoords * ( 1.0 - weight );
    #else // NO_PARALLAX
      return vUv;
    #endif
  }
#endif

vec2 perturbUv( vec3 surfPosition, vec3 surfNormal, vec3 viewPosition ) {
  vec2 texDx = dFdx( vUv );
  vec2 texDy = dFdy( vUv );
  vec3 vSigmaX = dFdx( surfPosition );
  vec3 vSigmaY = dFdy( surfPosition );
  vec3 vR1 = cross( vSigmaY, surfNormal );
  vec3 vR2 = cross( surfNormal, vSigmaX );
  float fDet = dot( vSigmaX, vR1 );
  vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );
  vec3 vProjVtex;
  vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
  vProjVtex.z = dot( surfNormal, viewPosition );
  return parallaxMap( vProjVtex );
}`

const parallaxMapFrag = `
void main() {
  vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ) );
  gl_FragColor = texture2D( map, mapUv );
}
`

export class ParallaxMap extends THREE.ShaderMaterial {
  constructor() {
    super({
      defines: {
        USE_STEEP_PARALLAX: true,
      },
      extensionDerivatives: true, // fix safari webgl1 #extension GL_OES_standard_derivatives you already know the deal
      flatShading: true, // fix safari webgl1 #extension GL_OES_standard_derivatives you already know the deal
      uniforms: {
        parallaxScale: { value: 0.05 },
        parallaxMinLayers: { value: 16.0 },
        parallaxMaxLayers: { value: 28.0 },
        map: { value: null },
        bumpMap: { value: null }
      },
      vertexShader: parallaxMapVert,
      fragmentShader: parallaxMapFragPars + parallaxMapFrag
    })
  }
}
export const ParallaxMapMaterial = forwardRef(
  ({ mode = 'basic', parallaxScale = 0.005, parallaxMinLayers = 8, parallaxMaxLayers = 32, map, bumpMap }, ref) => {
    const material = useRef()
    // Ordered from fastest to best quality.
    const modes = {
      none: 'NO_PARALLAX',
      basic: 'USE_BASIC_PARALLAX',
      steep: 'USE_STEEP_PARALLAX',
      occlusion: 'USE_OCLUSION_PARALLAX', // a.k.a. POM
      relief: 'USE_RELIEF_PARALLAX'
    }

    const [parallaxMapMaterial] = useState(() => new ParallaxMap())
    
    useLayoutEffect(() => {
      parallaxMapMaterial.defines = {}
      parallaxMapMaterial.defines[modes[mode]] = ''
      parallaxMapMaterial.needsUpdate = true
    }, [mode, parallaxMapMaterial])

    return (
      <primitive
        dispose={undefined}
        ref={material}
        defines={{
          [modes[mode]]: true
        }}
        object={parallaxMapMaterial}
        uniforms-parallaxScale-value={parallaxScale}
        uniforms-parallaxMinLayers-value={parallaxMinLayers}
        uniforms-parallaxMaxLayers-value={parallaxMaxLayers}
        uniforms-map-value={map}
        uniforms-bumpMap-value={bumpMap}
        attach="material"
      />
    )
  }
)

// other test with override basicMaterial
// const parallaxMapObc = (shader) => {
//   console.log(shader)
//   shader.vertexShader = shader.vertexShader.includes('varying vec3 vViewPosition;')
//     ? ''
//     : shader.vertexShader.replace(
//         `#include <fog_pars_vertex>`,
//         `#include <fog_pars_vertex>` +
//           `
//     varying vec3 vViewPosition;
//     varying vec3 vNormal;`
//       )

//   shader.vertexShader = shader.vertexShader.includes('vViewPosition = - mvPosition.xyz;')
//     ? ''
//     : shader.vertexShader.replace(
//         `#include <fog_vertex>`,
//         `#include <fog_vertex>` +
//           `
//     vViewPosition = - mvPosition.xyz;
//     vNormal = normalize( normalMatrix * normal );`
//       )

//   shader.fragmentShader = shader.fragmentShader.replace(`#include <fog_pars_fragment>`, `#include <fog_pars_fragment>` + parallaxMapPars)
//   shader.fragmentShader = shader.fragmentShader.replace(`#include <fog_fragment>`, `#include <fog_fragment>` + parallaxMapFrag)
//   console.log(shader)
// }

// wrapper for meshbasicmaterial for example
// export const ParallaxMap = ({ children }, ...props) => {
//   // Ordered from fastest to best quality.
//   // modes: {
//   // 	none: "NO_PARALLAX",
//   // 	basic: "USE_BASIC_PARALLAX",
//   // 	steep: "USE_STEEP_PARALLAX",
//   // 	occlusion: "USE_OCLUSION_PARALLAX", // a.k.a. POM
//   // 	relief: "USE_RELIEF_PARALLAX"
//   // }
//   if (children.defines) {
//     children.defines['modes'] = props.mode
//   }
//   console.log(children)
//   return React.cloneElement(children, {
//     defines: {
//       modes: props.mode || 'USE_STEEP_PARALLAX',
//       ...children.defines
//     },
//     uniforms: {
//       parallaxScale: props.parallaxScale || 0.05,
//       parallaxMinLayers: props.parallaxMinLayers || 30,
//       parallaxMaxLayers: props.parallaxMaxLayers || 30,
//       map: { value: children.props.map },
//       bumpMap: { value: children.props.bumpMap },
//       ...children.uniforms
//     },
//     onBeforeCompile: parallaxMapObc
//   })
// }

export default ParallaxMapMaterial
