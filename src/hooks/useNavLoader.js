import React, { useEffect, useState } from 'react';
import { NavMesh, NavMeshLoader } from 'yuka';



export const useNavLoader =(url) => {
    const [nav, setNav] = useState(new NavMesh());
    const loader = new NavMeshLoader();

    useEffect(() => {
      async function fetchData() {
        const newNav = await loader.load(url);
        setNav(newNav);  
      }
      fetchData();
    }, [url]); //loader var deleted to not sync every frame

    return nav;
  }