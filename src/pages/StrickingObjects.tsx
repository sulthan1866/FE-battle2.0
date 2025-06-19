import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

const StrickingObjects: React.FC = () => {
    const mountRef = useRef < HTMLDivElement > (null);
    const sceneRef = useRef < THREE.Scene | null > (null);
    const rendererRef = useRef < THREE.WebGLRenderer | null > (null);
    const cameraRef = useRef < THREE.PerspectiveCamera | null > (null);
    const objectsRef = useRef < THREE.Object3D[] > ([]);
    const animationIdRef = useRef < number | null > (null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const selectedObjectRef = useRef < THREE.Object3D | null > (null);
    const raycasterRef = useRef < THREE.Raycaster > (new THREE.Raycaster());

    const [isAutoRotate, setIsAutoRotate] = useState(true);
    const [lightIntensity, setLightIntensity] = useState(1);
    const [objectCount, setObjectCount] = useState(8);
    const [animationSpeed, setAnimationSpeed] = useState(1);

    const createGeometry = useCallback((type: string, scale: number = 1) => {
        const geometries = {
            box: () => new THREE.BoxGeometry(scale, scale, scale),
            sphere: () => new THREE.SphereGeometry(scale * 0.6, 32, 16),
            cone: () => new THREE.ConeGeometry(scale * 0.6, scale * 1.2, 8),
            cylinder: () => new THREE.CylinderGeometry(scale * 0.5, scale * 0.5, scale * 1.2, 8),
            torus: () => new THREE.TorusGeometry(scale * 0.6, scale * 0.2, 16, 100),
            octahedron: () => new THREE.OctahedronGeometry(scale * 0.8),
            dodecahedron: () => new THREE.DodecahedronGeometry(scale * 0.7),
            icosahedron: () => new THREE.IcosahedronGeometry(scale * 0.8)
        };

        const keys = Object.keys(geometries);
        const randomKey = keys[Math.floor(Math.random() * keys.length)] as keyof typeof geometries;
        return geometries[randomKey]();
    }, []);

    const createMaterial = useCallback(() => {
        const materials = [
            () => new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                shininess: 100
            }),
            () => new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5)
            }),
            () => new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.6, 0.7),
                metalness: Math.random() * 0.5,
                roughness: Math.random() * 0.5
            }),
            () => new THREE.MeshToonMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.9, 0.6)
            })
        ];

        return materials[Math.floor(Math.random() * materials.length)]();
    }, []);

    const initScene = useCallback(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 5, 15);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const pointLight1 = new THREE.PointLight(0xff4444, 0.5, 20);
        pointLight1.position.set(-8, 4, 0);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4444ff, 0.5, 20);
        pointLight2.position.set(8, 4, 0);
        scene.add(pointLight2);

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(30, 30);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -3;
        ground.receiveShadow = true;
        scene.add(ground);

        // Create objects
        objectsRef.current = [];
        for (let i = 0; i < objectCount; i++) {
            const geometry = createGeometry('random', 0.5 + Math.random() * 1.5);
            const material = createMaterial();
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(
                (Math.random() - 0.5) * 16,
                Math.random() * 8 - 1,
                (Math.random() - 0.5) * 16
            );

            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Add custom properties for animation
            (mesh as any).originalPosition = mesh.position.clone();
            (mesh as any).rotationSpeed = new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            );
            (mesh as any).bobSpeed = Math.random() * 0.02 + 0.01;
            (mesh as any).bobOffset = Math.random() * Math.PI * 2;

            scene.add(mesh);
            objectsRef.current.push(mesh);
        }

        mountRef.current.appendChild(renderer.domElement);
    }, [objectCount, createGeometry, createMaterial, lightIntensity]);

    const animate = useCallback(() => {
        if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

        const time = Date.now() * 0.001 * animationSpeed;

        // Animate objects
        objectsRef.current.forEach((obj, index) => {
            const mesh = obj as any;

            if (isAutoRotate) {
                mesh.rotation.x += mesh.rotationSpeed.x;
                mesh.rotation.y += mesh.rotationSpeed.y;
                mesh.rotation.z += mesh.rotationSpeed.z;
            }

            // Bobbing animation
            mesh.position.y = mesh.originalPosition.y + Math.sin(time * mesh.bobSpeed + mesh.bobOffset) * 0.5;

            // Gentle floating movement
            mesh.position.x = mesh.originalPosition.x + Math.sin(time * 0.3 + index) * 0.2;
            mesh.position.z = mesh.originalPosition.z + Math.cos(time * 0.2 + index) * 0.2;
        });

        // Camera auto-rotation
        if (isAutoRotate && !isDraggingRef.current) {
            cameraRef.current.position.x = Math.sin(time * 0.1) * 20;
            cameraRef.current.position.z = Math.cos(time * 0.1) * 20;
            cameraRef.current.lookAt(0, 0, 0);
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationIdRef.current = requestAnimationFrame(animate);
    }, [isAutoRotate, animationSpeed]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!mountRef.current) return;

        const rect = mountRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        if (isDraggingRef.current && selectedObjectRef.current && cameraRef.current) {
            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
            const intersects = raycasterRef.current.intersectObjects([selectedObjectRef.current]);

            if (intersects.length > 0) {
                const intersect = intersects[0];
                selectedObjectRef.current.position.copy(intersect.point);
                selectedObjectRef.current.position.y = Math.max(selectedObjectRef.current.position.y, -2);
            }
        }
    }, []);

    const handleMouseDown = useCallback((e: MouseEvent) => {
        if (!cameraRef.current || !sceneRef.current) return;

        isDraggingRef.current = true;
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(objectsRef.current);

        if (intersects.length > 0) {
            selectedObjectRef.current = intersects[0].object;
            // Highlight selected object
            (selectedObjectRef.current as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                color: 0xffff00,
                emissive: 0x444400
            });
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        isDraggingRef.current = false;

        if (selectedObjectRef.current) {
            // Reset material
            (selectedObjectRef.current as THREE.Mesh).material = createMaterial();
            selectedObjectRef.current = null;
        }
    }, [createMaterial]);

    const regenerateObjects = useCallback(() => {
        if (!sceneRef.current) return;

        // Remove existing objects
        objectsRef.current.forEach(obj => {
            sceneRef.current!.remove(obj);
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });

        // Create new objects
        objectsRef.current = [];
        for (let i = 0; i < objectCount; i++) {
            const geometry = createGeometry('random', 0.5 + Math.random() * 1.5);
            const material = createMaterial();
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(
                (Math.random() - 0.5) * 16,
                Math.random() * 8 - 1,
                (Math.random() - 0.5) * 16
            );

            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            (mesh as any).originalPosition = mesh.position.clone();
            (mesh as any).rotationSpeed = new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            );
            (mesh as any).bobSpeed = Math.random() * 0.02 + 0.01;
            (mesh as any).bobOffset = Math.random() * Math.PI * 2;

            sceneRef.current.add(mesh);
            objectsRef.current.push(mesh);
        }
    }, [objectCount, createGeometry, createMaterial]);

    const handleResize = useCallback(() => {
        if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
    }, []);

    useEffect(() => {
        initScene();
        animate();

        const handleMouseMoveEvent = (e: MouseEvent) => handleMouseMove(e);
        const handleMouseDownEvent = (e: MouseEvent) => handleMouseDown(e);
        const handleMouseUpEvent = () => handleMouseUp();
        const handleResizeEvent = () => handleResize();

        window.addEventListener('mousemove', handleMouseMoveEvent);
        window.addEventListener('mousedown', handleMouseDownEvent);
        window.addEventListener('mouseup', handleMouseUpEvent);
        window.addEventListener('resize', handleResizeEvent);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }

            window.removeEventListener('mousemove', handleMouseMoveEvent);
            window.removeEventListener('mousedown', handleMouseDownEvent);
            window.removeEventListener('mouseup', handleMouseUpEvent);
            window.removeEventListener('resize', handleResizeEvent);

            if (rendererRef.current && mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }

            // Cleanup
            objectsRef.current.forEach(obj => {
                if (obj instanceof THREE.Mesh) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(mat => mat.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });

            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, [initScene, animate, handleMouseMove, handleMouseDown, handleMouseUp, handleResize]);

    useEffect(() => {
        regenerateObjects();
    }, [objectCount]);

    return (
        <div className="min-h-screen bg-gray-900 dark:bg-black text-white">
            {/* Header */}
            <div className="bg-gray-800 dark:bg-gray-900 p-4 shadow-lg">
                <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Interactive 3D Playground
                </h1>
                <p className="text-center text-gray-300 mt-2 text-sm md:text-base">
                    Click and drag objects • Watch them float and dance • Customize the experience
                </p>
            </div>

            {/* Controls Panel */}
            <div className="bg-gray-800 dark:bg-gray-900 p-4 shadow-inner">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Auto Rotate Toggle */}
                    <div className="flex items-center justify-between bg-gray-700 dark:bg-gray-800 p-3 rounded-lg">
                        <label className="text-sm font-medium">Auto Rotate</label>
                        <button
                            onClick={() => setIsAutoRotate(!isAutoRotate)}
                            className={`w-12 h-6 rounded-full transition-colors duration-200 ${isAutoRotate ? 'bg-blue-500' : 'bg-gray-500'
                                }`}
                        >
                            <div
                                className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${isAutoRotate ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Light Intensity */}
                    <div className="bg-gray-700 dark:bg-gray-800 p-3 rounded-lg">
                        <label className="text-sm font-medium block mb-2">Light Intensity</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={lightIntensity}
                            onChange={(e) => setLightIntensity(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>

                    {/* Object Count */}
                    <div className="bg-gray-700 dark:bg-gray-800 p-3 rounded-lg">
                        <label className="text-sm font-medium block mb-2">Objects ({objectCount})</label>
                        <input
                            type="range"
                            min="3"
                            max="20"
                            step="1"
                            value={objectCount}
                            onChange={(e) => setObjectCount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>

                    {/* Animation Speed */}
                    <div className="bg-gray-700 dark:bg-gray-800 p-3 rounded-lg">
                        <label className="text-sm font-medium block mb-2">Animation Speed</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="max-w-6xl mx-auto mt-4 flex justify-center gap-4">
                    <button
                        onClick={regenerateObjects}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Regenerate Objects
                    </button>
                </div>
            </div>

            {/* 3D Scene */}
            <div className="flex-1 relative">
                <div
                    ref={mountRef}
                    className="w-full h-[calc(100vh-240px)] md:h-[calc(100vh-200px)] cursor-grab active:cursor-grabbing"
                    style={{ touchAction: 'none' }}
                />

                {/* Instructions Overlay */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg max-w-xs">
                    <h3 className="font-semibold mb-2 text-yellow-400">How to Play:</h3>
                    <ul className="text-xs md:text-sm space-y-1 text-gray-300">
                        <li>• Click and drag objects to move them</li>
                        <li>• Objects glow yellow when selected</li>
                        <li>• Watch automatic floating animations</li>
                        <li>• Adjust controls to customize the scene</li>
                        <li>• Use regenerate for new random objects</li>
                    </ul>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
        </div>
    );
};

export default StrickingObjects;
