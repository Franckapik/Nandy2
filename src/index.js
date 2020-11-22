import ReactDOM from 'react-dom'
import React, { Suspense, useRef } from "react";
import {Loader, Sky, useGLTF, useMatcapTexture, shaderMaterial } from "@react-three/drei";
import { Canvas, useFrame, extend } from 'react-three-fiber'
import FPSStats from "react-fps-stats";
import { Physics, usePlane, useBox } from '@react-three/cannon'
import CameraTarget from './Tools/CameraTarget'
import './styles.css'


const parallaxShaderMaterial = shaderMaterial({
	// Ordered from fastest to best quality.
	modes: {
		none: "NO_PARALLAX",
		basic: "USE_BASIC_PARALLAX",
		steep: "USE_STEEP_PARALLAX",
		occlusion: "USE_OCLUSION_PARALLAX", // a.k.a. POM
		relief: "USE_RELIEF_PARALLAX"
	},

	uniforms: {
		"bumpMap": { value: null },
		"map": { value: null },
		"parallaxScale": { value: null },
		"parallaxMinLayers": { value: null },
		"parallaxMaxLayers": { value: null }
	},

	vertexShader: [
		"varying vec2 vUv;",
		"varying vec3 vViewPosition;",
		"varying vec3 vNormal;",

		"void main() {",

		"	vUv = uv;",
		"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
		"	vViewPosition = -mvPosition.xyz;",
		"	vNormal = normalize( normalMatrix * normal );",
		"	gl_Position = projectionMatrix * mvPosition;",

		"}"

	].join( "\n" ),

	fragmentShader: [
		"uniform sampler2D bumpMap;",
		"uniform sampler2D map;",

		"uniform float parallaxScale;",
		"uniform float parallaxMinLayers;",
		"uniform float parallaxMaxLayers;",

		"varying vec2 vUv;",
		"varying vec3 vViewPosition;",
		"varying vec3 vNormal;",

		"#ifdef USE_BASIC_PARALLAX",

		"	vec2 parallaxMap( in vec3 V ) {",

		"		float initialHeight = texture2D( bumpMap, vUv ).r;",

		// No Offset Limitting: messy, floating output at grazing angles.
		//"vec2 texCoordOffset = parallaxScale * V.xy / V.z * initialHeight;",

		// Offset Limiting
		"		vec2 texCoordOffset = parallaxScale * V.xy * initialHeight;",
		"		return vUv - texCoordOffset;",

		"	}",

		"#else",

		"	vec2 parallaxMap( in vec3 V ) {",

		// Determine number of layers from angle between V and N
		"		float numLayers = mix( parallaxMaxLayers, parallaxMinLayers, abs( dot( vec3( 0.0, 0.0, 1.0 ), V ) ) );",

		"		float layerHeight = 1.0 / numLayers;",
		"		float currentLayerHeight = 0.0;",
		// Shift of texture coordinates for each iteration
		"		vec2 dtex = parallaxScale * V.xy / V.z / numLayers;",

		"		vec2 currentTextureCoords = vUv;",

		"		float heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;",

		// while ( heightFromTexture > currentLayerHeight )
		// Infinite loops are not well supported. Do a "large" finite
		// loop, but not too large, as it slows down some compilers.
		"		for ( int i = 0; i < 30; i += 1 ) {",
		"			if ( heightFromTexture <= currentLayerHeight ) {",
		"				break;",
		"			}",
		"			currentLayerHeight += layerHeight;",
		// Shift texture coordinates along vector V
		"			currentTextureCoords -= dtex;",
		"			heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;",
		"		}",

		"		#ifdef USE_STEEP_PARALLAX",

		"			return currentTextureCoords;",

		"		#elif defined( USE_RELIEF_PARALLAX )",

		"			vec2 deltaTexCoord = dtex / 2.0;",
		"			float deltaHeight = layerHeight / 2.0;",

		// Return to the mid point of previous layer
		"			currentTextureCoords += deltaTexCoord;",
		"			currentLayerHeight -= deltaHeight;",

		// Binary search to increase precision of Steep Parallax Mapping
		"			const int numSearches = 5;",
		"			for ( int i = 0; i < numSearches; i += 1 ) {",

		"				deltaTexCoord /= 2.0;",
		"				deltaHeight /= 2.0;",
		"				heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;",
		// Shift along or against vector V
		"				if( heightFromTexture > currentLayerHeight ) {", // Below the surface

		"					currentTextureCoords -= deltaTexCoord;",
		"					currentLayerHeight += deltaHeight;",

		"				} else {", // above the surface

		"					currentTextureCoords += deltaTexCoord;",
		"					currentLayerHeight -= deltaHeight;",

		"				}",

		"			}",
		"			return currentTextureCoords;",

		"		#elif defined( USE_OCLUSION_PARALLAX )",

		"			vec2 prevTCoords = currentTextureCoords + dtex;",

		// Heights for linear interpolation
		"			float nextH = heightFromTexture - currentLayerHeight;",
		"			float prevH = texture2D( bumpMap, prevTCoords ).r - currentLayerHeight + layerHeight;",

		// Proportions for linear interpolation
		"			float weight = nextH / ( nextH - prevH );",

		// Interpolation of texture coordinates
		"			return prevTCoords * weight + currentTextureCoords * ( 1.0 - weight );",

		"		#else", // NO_PARALLAX

		"			return vUv;",

		"		#endif",

		"	}",
		"#endif",

		"vec2 perturbUv( vec3 surfPosition, vec3 surfNormal, vec3 viewPosition ) {",

 		"	vec2 texDx = dFdx( vUv );",
		"	vec2 texDy = dFdy( vUv );",

		"	vec3 vSigmaX = dFdx( surfPosition );",
		"	vec3 vSigmaY = dFdy( surfPosition );",
		"	vec3 vR1 = cross( vSigmaY, surfNormal );",
		"	vec3 vR2 = cross( surfNormal, vSigmaX );",
		"	float fDet = dot( vSigmaX, vR1 );",

		"	vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );",
		"	vec3 vProjVtex;",
		"	vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;",
		"	vProjVtex.z = dot( surfNormal, viewPosition );",

		"	return parallaxMap( vProjVtex );",
		"}",

		"void main() {",

		"	vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ) );",
		"	gl_FragColor = texture2D( map, mapUv );",

		"}"

	].join( "\n" )

})

extend({ parallaxShaderMaterial })

//const preloaded = useGLTF.preload('/pilar.glb')
//console.log(preloaded);
//or maybe useLoader.preload(GLTFLoader, url)

function Asset({ url }) {
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene} />
}

function AssettoMesh({ url }) {
  const { nodes, materials } = useGLTF(url)
  const [matcap, url2] = useMatcapTexture(
    18, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    1024 // size of the texture ( 64, 128, 256, 512, 1024 )
   )
  //const material = useResource()
  const ref = useRef()
  const pos1 = useEmpty('originMsg')
  console.log(pos1);


   
  return (
    <group>
    <mesh geometry={nodes.Pilar.geometry} position={pos1} />
    <mesh material={materials.Mat} geometry={nodes.PIlar2.geometry}  position={[-8,0,0]} />
    <mesh material={materials.Mat} geometry={nodes.Pilar1.geometry} position={[8,0,0]} />
    </group>
    )
}

function useEmpty(name) {
  const { nodes, materials } = useGLTF('/empty.glb')
  return [nodes[name].position.x,nodes[name].position.y,nodes[name].position.z];
}


function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <parallaxShaderMaterial />
    </mesh>
  )
}

function Cube(props) {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], rotation: [0.4, 0.2, 0.5], ...props }))
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  )
}



ReactDOM.render(
  <>
  <FPSStats />
  <Canvas shadowMap gl={{ alpha: false }} >
  <CameraTarget />
  
    <color attach="background" args={['lightblue']} />
    <hemisphereLight intensity={0.35} />
    <fogExp2 attach="fog" args={['black', 0.03]} />
    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
    <Sky distance={3000} turbidity={2} rayleigh={4} mieCoefficient={0.038} mieDirectionalG={0.85} sunPosition={[Math.PI, -10, 0]} exposure = {5} azimuth={0.5} />
    
    <Suspense fallback={null}>
      <Asset url="/passive_z1_draco.gltf" />
      <AssettoMesh url="/pilar.glb" />
    </Suspense>
    <Physics>
      <Plane />
      <Cube />
      <Cube position={[0, 10, -2]} />
      <Cube position={[0, 20, -2]} />
    </Physics>
    
  </Canvas>
  <Loader />
  </>,
  document.getElementById('root')
)
