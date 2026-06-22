import { useLenis } from './lib/useLenis';
// import Nav from './components/Nav';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Collage from './components/Collage';
import WhatIsFirefly from './components/WhatIsFirefly';
// import Roles from './components/Roles';
// import FooterCTA from './components/FooterCTA';

export default function App() {
  useLenis();
  return (
    <main>
      {/* <Nav /> */}
      <Hero />
      <Mission />
      <Collage />
      <WhatIsFirefly />
      {/* <Roles /> */}
      {/* <FooterCTA /> */}
    </main>
  );
}
