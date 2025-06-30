'use client';
import { useRouter } from 'next/navigation';

export default function LandingComponent() {
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();

    // useEffect(() => {
    //     if (!canvasRef.current) return;
    //     const scene = new THREE.Scene();
    //     const camera = new THREE.PerspectiveCamera(
    //         75,
    //         window.innerWidth / window.innerHeight,
    //         0.1,
    //         1000
    //     );
    //     camera.position.z = 3;
    //     const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    //     renderer.setPixelRatio(window.devicePixelRatio);
    //     const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    //     scene.add(ambientLight);
    //     const loader = new GLTFLoader();
    //     loader.load(
    //         '/models/gate.glb',
    //         function (gltf) {
    //             scene.add(gltf.scene);
    //         },
    //         undefined,
    //         function (error) {
    //             console.error('An error happened', error);
    //         }
    //     );
    //     const animate = () => {
    //         renderer.render(scene, camera);
    //         requestAnimationFrame(animate);
    //     };
    //     animate();
    //     const handleResize = () => {
    //         camera.aspect = window.innerWidth / window.innerHeight;
    //         camera.updateProjectionMatrix();
    //         renderer.setSize(window.innerWidth, window.innerHeight);
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //         renderer.dispose();
    //     };
    // }, []);

    return (
        <div className='flex h-screen w-screen overflow-hidden justify-center items-center '>
            <button
                className='flex items-center justify-center w-48 h-12 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300    '
                onClick={() => router.push('/home')}
            >
                GET STARTED
            </button>
        </div>
    );
}