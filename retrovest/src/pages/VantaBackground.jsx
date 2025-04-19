// import React, {useEffect, useRef} from 'react';
// import * as THREE from 'three';
// import BIRDS from 'vanta/dist/vanta.birds.min'

// export default function VantaBackground() {
//     useEffect(() => {
//       const vantaEffect = BIRDS({
//         THREE,
//         minHeight: 200.0,
//         minWidth: 200.0,
//         highlightColor: 0x157fc5,
//         midtoneColor: 0xb81f69,
//         lowlightColor: 0xd10202,
//         baseColor: 0x100000,
//         blurFactor: 0.6,
//         speed: 2,
//         zoom: 1.5,
//       });
  
//       return () => {
//         if (vantaEffect) vantaEffect.destroy();
//       };
//     }, []);
  
//     return (
//       <main>
//         <div className="background" ref={vantaRef}></div>
//         <div className="title">Background Animation</div>
//       </main>
//     );
//   }
