import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useStore, type Weather, type Panel } from './store'

function Clickable({ position, color, size = [1, 1, 1], panel, label }: {
  position: [number, number, number], color: string, size?: [number, number, number], panel: Panel, label: string
}) {
  const [hover, setHover] = useState(false)
  const setPanel = useStore(s => s.setPanel)
  return <mesh position={position} scale={hover ? 1.045 : 1}
    onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
    onClick={(e) => { e.stopPropagation(); setPanel(panel) }}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={hover ? '#d9c9a9' : color} roughness={0.8} />
  </mesh>
}

function Room() {
  const weather = useStore(s => s.weather)
  const quality = useStore(s => s.quality)
  const rainy = weather === 'rainy'
  const night = weather === 'night'
  const sun = weather === 'sunny'
  const light = night ? '#8293a5' : sun ? '#ffe0a6' : '#e7d8c0'
  return <>
    <color attach="background" args={[night ? '#1d292b' : '#b7c6b4']} />
    <ambientLight intensity={night ? 0.55 : 1.15} />
    <directionalLight position={[-4, 8, 5]} intensity={night ? 0.75 : 2} color={light} castShadow={quality !== 'low'} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
      <planeGeometry args={[12, 10]} />
      <meshStandardMaterial color="#b9a88c" roughness={1} />
    </mesh>
    <mesh position={[0, 1.45, -2.1]}>
      <boxGeometry args={[8, 3.2, 0.18]} />
      <meshStandardMaterial color="#e7dfcf" />
    </mesh>
    <mesh position={[0, 2.1, -1.98]}>
      <boxGeometry args={[2.7, 1.8, 0.08]} />
      <meshStandardMaterial color={rainy ? '#637f88' : night ? '#25364a' : '#e9c98e'} emissive={rainy ? '#223b45' : '#000000'} emissiveIntensity={0.25} />
    </mesh>
    <mesh position={[0, 2.1, -1.91]}>
      <boxGeometry args={[0.07, 1.9, 0.08]} />
      <meshStandardMaterial color="#8c7258" />
    </mesh>
    <mesh position={[0, 2.1, -1.9]}>
      <boxGeometry args={[2.8, 0.07, 0.08]} />
      <meshStandardMaterial color="#8c7258" />
    </mesh>
    {/* desk */}
    <mesh position={[-0.5, 0.9, -0.45]} castShadow>
      <boxGeometry args={[3.1, 0.16, 1.25]} />
      <meshStandardMaterial color="#8b6349" roughness={0.8} />
    </mesh>
    {[-1.8, 0.8].map(x => [-0.9, 0].map(z => <mesh key={`${x}-${z}`} position={[x, 0.43, z - 0.45]}>
      <boxGeometry args={[0.13, 0.85, 0.13]} /><meshStandardMaterial color="#76543f" />
    </mesh>))}
    <Clickable position={[-0.6, 1.28, -0.5]} size={[0.9, 0.62, 0.12]} color="#394b45" panel="timer" label="Focus timer" />
    <mesh position={[-0.6, 1.64, -0.49]}>
      <boxGeometry args={[0.95, 0.08, 0.14]} /><meshStandardMaterial color="#b7c7b8" />
    </mesh>
    <Clickable position={[0.65, 1.12, -0.48]} size={[0.28, 0.35, 0.28]} color="#c49c70" panel="music" label="Speaker" />
    {/* bookshelf */}
    <mesh position={[2.65, 1.15, -1.35]}>
      <boxGeometry args={[1.05, 2.3, 0.55]} /><meshStandardMaterial color="#795b45" />
    </mesh>
    {[0.45, 1.1, 1.75].map((y, i) => <group key={y}>
      <mesh position={[2.65, y, -1.03]}><boxGeometry args={[0.98, 0.07, 0.58]} /><meshStandardMaterial color="#b48a65" /></mesh>
      {Array.from({ length: 4 }).map((_, j) => <mesh key={j} position={[2.3 + j * 0.22, y + 0.19, -1.05]} rotation={[0, 0, (j % 2 ? -0.08 : 0.06)]}>
        <boxGeometry args={[0.14, 0.35 + ((j + i) % 2) * 0.12, 0.3]} /><meshStandardMaterial color={['#9b6e5b', '#d1b98d', '#788d78', '#d8d0bd'][(j + i) % 4]} />
      </mesh>)}
    </group>)}
    <Clickable position={[2.65, 1.15, -0.95]} size={[1.12, 2.35, 0.12]} color="#000000" panel="journal" label="Bookshelf" />
    {/* plant */}
    <Float speed={1} rotationIntensity={0.04} floatIntensity={0.06}>
      <mesh position={[-3, 0.65, -1.2]}><cylinderGeometry args={[0.28, 0.22, 0.48, 12]} /><meshStandardMaterial color="#a77959" /></mesh>
      {Array.from({ length: 5 }).map((_, i) => <mesh key={i} position={[-3 + Math.sin(i * 1.2) * 0.22, 1.18 + (i % 2) * 0.12, -1.2]} rotation={[0, 0, (i - 2) * 0.18]}>
        <sphereGeometry args={[0.22, 10, 8]} /><meshStandardMaterial color="#66866b" />
      </mesh>)}
    </Float>
    <Clickable position={[-3, 0.8, -1.2]} size={[0.65, 1.35, 0.5]} color="#66866b" panel="weather" label="Window and weather" />
    {/* rug and bed/sofa */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.1, 0.01, 1.45]}>
      <circleGeometry args={[1.35, 48]} /><meshStandardMaterial color="#c9bda7" roughness={1} />
    </mesh>
    <mesh position={[2.3, 0.45, 1.55]}><boxGeometry args={[2.4, 0.75, 1.2]} /><meshStandardMaterial color="#7d9182" /></mesh>
    <mesh position={[2.3, 0.87, 1.55]}><boxGeometry args={[2.25, 0.18, 1.12]} /><meshStandardMaterial color="#d8d0bd" /></mesh>
    <Clickable position={[2.3, 0.9, 1.55]} size={[2.35, 0.2, 1.2]} color="#d8d0bd" panel="tasks" label="Rest area and tasks" />
    {/* lamp */}
    <mesh position={[-1.65, 1.28, -0.5]}><cylinderGeometry args={[0.05, 0.08, 0.5, 12]} /><meshStandardMaterial color="#b58b5e" /></mesh>
    <mesh position={[-1.65, 1.56, -0.5]}><coneGeometry args={[0.27, 0.35, 16]} /><meshStandardMaterial color="#e8c995" emissive="#9d7740" emissiveIntensity={0.25} /></mesh>
    <Clickable position={[-1.65, 1.55, -0.5]} size={[0.5, 0.55, 0.5]} color="#e8c995" panel="settings" label="Lamp settings" />
    {rainy && quality !== 'low' && <Rain />}
    {sun && <Sparkles />}
    {quality !== 'low' && <ContactShadows position={[0, -0.1, 0]} opacity={0.25} scale={9} blur={2.5} />}
  </>
}

function Rain() {
  const [points] = useState(() => Array.from({ length: 90 }, () => ({
    x: (Math.random() - 0.5) * 5, y: Math.random() * 4, z: -1.8
  })))
  return <group>{points.map((p, i) => <mesh key={i} position={[p.x, p.y, p.z]}>
    <boxGeometry args={[0.012, 0.12, 0.012]} /><meshBasicMaterial color="#d7e4e5" transparent opacity={0.5} />
  </mesh>)}</group>
}
function Sparkles() {
  return <group>{Array.from({ length: 18 }).map((_, i) => <mesh key={i} position={[(i % 6) - 2.5, 1 + (i % 4) * 0.45, -1.7]}>
    <sphereGeometry args={[0.025, 6, 6]} /><meshBasicMaterial color="#ffe7ad" />
  </mesh>)}</group>
}

export default function World() {
  const quality = useStore(s => s.quality)
  return <Canvas shadows={quality !== 'low'} dpr={quality === 'high' ? [1, 1.5] : [1, 1.15]}
    camera={{ position: [7, 7, 8], zoom: 55, near: 0.1, far: 100 }}
    gl={{ antialias: quality !== 'low', powerPreference: 'low-power', alpha: false }}
    onCreated={({ gl }) => { gl.setClearColor('#b7c6b4'); gl.toneMapping = THREE.ACESFilmicToneMapping }}>
    <Room />
    <OrbitControls makeDefault enablePan enableZoom minZoom={35} maxZoom={75}
      minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 2.35}
      minAzimuthAngle={-Math.PI / 3} maxAzimuthAngle={Math.PI / 3}
      enableDamping dampingFactor={0.08} />
  </Canvas>
}
