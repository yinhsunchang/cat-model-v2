import reading from '../assets/reading.jpg';
import walking from '../assets/walking.jpg';
import tongue from '../assets/tongue.jpg';
import sink2 from '../assets/sink2.jpg';
import sink1 from '../assets/sink1.jpg';
import paw from '../assets/paw.jpg';
import curious from '../assets/curious.jpg';
import faucet from '../assets/faucet.jpg';
import tunnel from '../assets/tunnel.jpg';
import closeup from '../assets/closeup.jpg';
import waiting from '../assets/waiting.jpg';

export type Photo = {
  src: string;
  altKey: string;
};

const photo: Photo[] = [
  { src: reading, altKey: "photo.reading" },
  { src: walking, altKey: "photo.walking" },
  { src: tongue, altKey: "photo.tongue" },
  { src: sink2, altKey: "photo.sink2" },
  { src: sink1, altKey: "photo.sink1" },
  { src: paw, altKey: "photo.paw" },
  { src: curious, altKey: "photo.curious" },
  { src: faucet, altKey: "photo.faucet" },
  { src: tunnel, altKey: "photo.tunnel" },
  { src: closeup, altKey: "photo.closeup" },
  { src: waiting, altKey: "photo.waiting" }
];


export default photo;
