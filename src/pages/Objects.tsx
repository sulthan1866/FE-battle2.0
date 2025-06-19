import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

const Objects = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const objectsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particleSystemRef = useRef(null);
    const [selectedObject, setSelectedObject] = useState(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [objectCount, setObjectCount] = useState({ cross: 0, cylinder: 0, complex: 0 });
    const [showStats, setShowStats] = useState(true);
    const [renderMode, setRenderMode] = useState('normal');

    const createParticleSystem = useCallback(() => {
        const particleCount = 200;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            colors[i * 3] = Math.random() * 0.5 + 0.5;
            colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
            colors[i * 3 + 2] = Math.random() * 0.8 + 0.2;

            sizes[i] = Math.random() * 3 + 1;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        return new THREE.Points(particles, particleMaterial);
    }, []);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup with enhanced atmosphere
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog = new THREE.Fog(0x0a0a0a, 10, 25);
        sceneRef.current = scene;

        // Camera setup with better positioning
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 2, 10);
        cameraRef.current = camera;

        // Enhanced renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        scene.add(directionalLight);

        // Add colored accent lights
        const redLight = new THREE.PointLight(0xff3030, 0.8, 15);
        redLight.position.set(-8, 3, 2);
        scene.add(redLight);

        const blueLight = new THREE.PointLight(0x3030ff, 0.8, 15);
        blueLight.position.set(8, -3, 2);
        scene.add(blueLight);

        const greenLight = new THREE.PointLight(0x30ff30, 0.6, 12);
        greenLight.position.set(0, 8, -5);
        scene.add(greenLight);

        // Add particle system
        const particleSystem = createParticleSystem();
        scene.add(particleSystem);
        particleSystemRef.current = particleSystem;

        // Create interactive objects with enhanced materials
        const objects = [];
        let counts = { cross: 0, cylinder: 0, complex: 0 };

        // Enhanced Cross/Plus shapes with metallic finish
        for (let i = 0; i < 4; i++) {
            const group = new THREE.Group();

            const metalMaterial = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color().setHSL(0.6, 0.8, 0.6),
                metalness: 0.8,
                roughness: 0.2,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            });

            // Horizontal bar with rounded edges
            const hBar = new THREE.Mesh(
                new THREE.BoxGeometry(2.5, 0.5, 0.5),
                metalMaterial.clone()
            );
            hBar.castShadow = true;
            hBar.receiveShadow = true;

            // Vertical bar
            const vBar = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 2.5, 0.5),
                metalMaterial.clone()
            );
            vBar.castShadow = true;
            vBar.receiveShadow = true;

            // Add core sphere for visual interest
            const core = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 16, 12),
                new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    metalness: 1.0,
                    roughness: 0.0,
                    emissive: 0x222222
                })
            );
            core.castShadow = true;

            group.add(hBar);
            group.add(vBar);
            group.add(core);

            group.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6
            );

            group.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            group.userData = {
                type: 'cross',
                originalColor: 0x4169E1,
                baseScale: 1,
                targetScale: 1,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03
                ),
                rotationVelocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                energy: 0,
                lastInteraction: 0
            };

            scene.add(group);
            objects.push(group);
            counts.cross++;
        }

        // Enhanced Cylindrical objects with varied materials
        for (let i = 0; i < 5; i++) {
            const isGlass = i % 3 === 0;
            const geometry = new THREE.CylinderGeometry(0.6, 0.6, 2, 16);

            const material = isGlass
                ? new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    metalness: 0.0,
                    roughness: 0.0,
                    transmission: 0.9,
                    transparent: true,
                    opacity: 0.8
                })
                : new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
                    metalness: 0.6,
                    roughness: 0.3,
                    clearcoat: 0.8
                });

            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.castShadow = true;
            cylinder.receiveShadow = true;

            // Add caps for visual detail
            const capMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x333333,
                metalness: 0.9,
                roughness: 0.1
            });

            const topCap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.65, 0.65, 0.1, 16),
                capMaterial
            );
            topCap.position.y = 1.05;
            cylinder.add(topCap);

            const bottomCap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.65, 0.65, 0.1, 16),
                capMaterial
            );
            bottomCap.position.y = -1.05;
            cylinder.add(bottomCap);

            cylinder.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6
            );

            cylinder.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            cylinder.userData = {
                type: 'cylinder',
                originalColor: isGlass ? 0xffffff : material.color.getHex(),
                baseScale: 1,
                targetScale: 1,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03
                ),
                rotationVelocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                energy: 0,
                lastInteraction: 0,
                isGlass
            };

            scene.add(cylinder);
            objects.push(cylinder);
            counts.cylinder++;
        }

        // Enhanced Complex shapes with dynamic components
        for (let i = 0; i < 3; i++) {
            const group = new THREE.Group();

            // Main body with faceted design
            const body = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.8, 0),
                new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color().setHSL(0.8, 0.6, 0.4),
                    metalness: 0.7,
                    roughness: 0.2,
                    clearcoat: 1.0
                })
            );
            body.castShadow = true;
            body.receiveShadow = true;

            // Orbiting satellites
            const satelliteCount = 3;
            for (let j = 0; j < satelliteCount; j++) {
                const satellite = new THREE.Mesh(
                    new THREE.SphereGeometry(0.2, 12, 8),
                    new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color().setHSL(j / satelliteCount, 0.8, 0.6),
                        metalness: 0.9,
                        roughness: 0.1,
                        emissive: new THREE.Color().setHSL(j / satelliteCount, 0.5, 0.1)
                    })
                );
                satellite.castShadow = true;

                const angle = (j / satelliteCount) * Math.PI * 2;
                satellite.position.set(
                    Math.cos(angle) * 1.5,
                    Math.sin(angle) * 0.3,
                    Math.sin(angle) * 1.5
                );

                satellite.userData = { orbitAngle: angle, orbitRadius: 1.5 };
                group.add(satellite);
            }

            group.add(body);

            group.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 6
            );

            group.userData = {
                type: 'complex',
                originalColor: 0x696969,
                baseScale: 1,
                targetScale: 1,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03,
                    (Math.random() - 0.5) * 0.03
                ),
                rotationVelocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                energy: 0,
                lastInteraction: 0,
                orbitSpeed: 0.02 + Math.random() * 0.02
            };

            scene.add(group);
            objects.push(group);
            counts.complex++;
        }

        objectsRef.current = objects;
        setObjectCount(counts);

        // Enhanced raycaster for interactions
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Improved mouse interaction
        const onMouseMove = (event) => {
            event.preventDefault();

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            mouseRef.current = { x: mouse.x, y: mouse.y };

            if (!isMouseDown) {
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(objects, true);

                // Reset all objects
                objects.forEach(obj => {
                    obj.userData.targetScale = obj.userData.baseScale;

                    if (obj.userData.type === 'cross') {
                        obj.children.forEach(child => {
                            if (child.material) {
                                child.material.emissive.setHex(0x000000);
                            }
                        });
                    } else if (obj.userData.type === 'complex') {
                        obj.children.forEach(child => {
                            if (child.material) {
                                child.material.emissive.setHex(
                                    child.userData?.orbitAngle !== undefined ?
                                        child.material.color.getHex() * 0.1 : 0x000000
                                );
                            }
                        });
                    } else if (obj.material) {
                        obj.material.emissive.setHex(0x000000);
                    }
                });

                if (intersects.length > 0) {
                    const intersectedObject = intersects[0].object.parent || intersects[0].object;
                    setSelectedObject(intersectedObject);

                    // Enhanced hover effects
                    intersectedObject.userData.targetScale = 1.2;

                    if (intersectedObject.userData.type === 'cross') {
                        intersectedObject.children.forEach(child => {
                            if (child.material) {
                                child.material.emissive.setHex(0x440044);
                            }
                        });
                    } else if (intersectedObject.userData.type === 'complex') {
                        intersectedObject.children.forEach(child => {
                            if (child.material) {
                                child.material.emissive.setHex(0x404040);
                            }
                        });
                    } else if (intersectedObject.material) {
                        intersectedObject.material.emissive.setHex(0x444400);
                    }

                    document.body.style.cursor = 'pointer';
                } else {
                    setSelectedObject(null);
                    document.body.style.cursor = 'default';
                }
            }
        };

        const onMouseDown = (event) => {
            setIsMouseDown(true);

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(objects, true);

            if (intersects.length > 0) {
                const intersectedObject = intersects[0].object.parent || intersects[0].object;
                const currentTime = Date.now();

                // Enhanced click effects
                const impulse = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.15,
                    (Math.random() - 0.5) * 0.15,
                    (Math.random() - 0.5) * 0.15
                );
                intersectedObject.userData.velocity.add(impulse);

                // Increase energy and rotation
                intersectedObject.userData.energy = Math.min(intersectedObject.userData.energy + 0.5, 2.0);
                intersectedObject.userData.rotationVelocity.multiplyScalar(1.8);
                intersectedObject.userData.lastInteraction = currentTime;

                // Visual feedback
                intersectedObject.userData.targetScale = 1.5;

                if (intersectedObject.material) {
                    intersectedObject.material.emissive.setHex(0xff4444);
                } else {
                    intersectedObject.children.forEach(child => {
                        if (child.material) {
                            child.material.emissive.setHex(0xff4444);
                        }
                    });
                }
            }
        };

        const onMouseUp = () => {
            setIsMouseDown(false);
        };

        // Add event listeners
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('mousedown', onMouseDown);
        renderer.domElement.addEventListener('mouseup', onMouseUp);

        // Enhanced animation loop
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const currentTime = Date.now();

            // Update objects with enhanced physics
            objects.forEach(obj => {
                // Apply velocity with gravity-like effect
                obj.position.add(obj.userData.velocity);
                obj.userData.velocity.y -= 0.001; // Subtle gravity

                // Apply rotation
                obj.rotation.x += obj.userData.rotationVelocity.x;
                obj.rotation.y += obj.userData.rotationVelocity.y;
                obj.rotation.z += obj.userData.rotationVelocity.z;

                // Enhanced damping based on energy
                const energyDamping = 0.985 + (obj.userData.energy * 0.01);
                obj.userData.velocity.multiplyScalar(energyDamping);
                obj.userData.rotationVelocity.multiplyScalar(0.92);

                // Energy decay
                obj.userData.energy *= 0.99;

                // Scale animation
                const currentScale = obj.scale.x;
                const targetScale = obj.userData.targetScale;
                const newScale = currentScale + (targetScale - currentScale) * 0.1;
                obj.scale.setScalar(newScale);

                // Complex object satellite orbiting
                if (obj.userData.type === 'complex') {
                    obj.children.forEach(child => {
                        if (child.userData?.orbitAngle !== undefined) {
                            child.userData.orbitAngle += obj.userData.orbitSpeed;
                            const radius = child.userData.orbitRadius;
                            child.position.set(
                                Math.cos(child.userData.orbitAngle) * radius,
                                Math.sin(child.userData.orbitAngle) * 0.3,
                                Math.sin(child.userData.orbitAngle) * radius
                            );
                        }
                    });
                }

                // Enhanced boundary collision with energy transfer
                const bounds = { x: 8, y: 6, z: 4 };
                ['x', 'y', 'z'].forEach(axis => {
                    if (Math.abs(obj.position[axis]) > bounds[axis]) {
                        obj.userData.velocity[axis] *= -0.7;
                        obj.position[axis] = Math.sign(obj.position[axis]) * bounds[axis];
                        obj.userData.energy += 0.1;
                    }
                });
            });

            // Animate particle system
            if (particleSystemRef.current) {
                particleSystemRef.current.rotation.y += 0.001;
                particleSystemRef.current.rotation.x += 0.0005;
            }

            // Enhanced camera movement with smoothing
            const targetX = mouseRef.current.x * 3;
            const targetY = -mouseRef.current.y * 2 + 2;

            camera.position.x += (targetX - camera.position.x) * 0.03;
            camera.position.y += (targetY - camera.position.y) * 0.03;
            camera.lookAt(0, 0, 0);

            // Apply render mode effects
            if (renderMode === 'wireframe') {
                objects.forEach(obj => {
                    if (obj.material) {
                        obj.material.wireframe = true;
                    } else {
                        obj.children.forEach(child => {
                            if (child.material) child.material.wireframe = true;
                        });
                    }
                });
            } else {
                objects.forEach(obj => {
                    if (obj.material) {
                        obj.material.wireframe = false;
                    } else {
                        obj.children.forEach(child => {
                            if (child.material) child.material.wireframe = false;
                        });
                    }
                });
            }

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }

            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('mousemove', onMouseMove);
            renderer.domElement.removeEventListener('mousedown', onMouseDown);
            renderer.domElement.removeEventListener('mouseup', onMouseUp);

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            // Enhanced cleanup
            objects.forEach(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(mat => mat.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
                if (obj.children) {
                    obj.children.forEach(child => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(mat => mat.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    });
                }
            });

            renderer.dispose();
        };
    }, [isMouseDown, renderMode, createParticleSystem]);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            <div ref={mountRef} className="w-full h-full" />

            {/* Enhanced UI Overlay */}
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-70 p-4 rounded-xl backdrop-blur-md border border-gray-700">
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    3D Scene
                </h2>
                <div className="text-sm space-y-2">
                    <p className="flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        Move mouse to explore
                    </p>
                    <p className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Click objects for physics
                    </p>
                    <p className="flex items-center">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                        Hover for interaction
                    </p>
                    {selectedObject && (
                        <div className="mt-3 p-2 bg-gray-800 rounded-lg">
                            <p className="text-cyan-300 font-semibold">
                                Selected: {selectedObject.userData.type}
                            </p>
                            <p className="text-xs text-gray-400">
                                Energy: {selectedObject.userData.energy.toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Panel */}
            {showStats && (
                <div className="absolute top-4 right-4 text-white bg-black bg-opacity-70 p-4 rounded-xl backdrop-blur-md border border-gray-700">
                    <h3 className="text-lg font-bold mb-2">Scene Stats</h3>
                    <div className="text-sm space-y-1">
                        <p>Crosses: <span className="text-blue-400">{objectCount.cross}</span></p>
                        <p>Cylinders: <span className="text-green-400">{objectCount.cylinder}</span></p>
                        <p>Complex: <span className="text-purple-400">{objectCount.complex}</span></p>
                        <p>Particles: <span className="text-yellow-400">200</span></p>
                    </div>
                </div>
            )}

            {/* Control Panel */}
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-70 p-4 rounded-xl backdrop-blur-md border border-gray-700">
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                    >
                        {showStats ? 'Hide Stats' : 'Show Stats'}
                    </button>
                    <button
                        onClick={() => setRenderMode(renderMode === 'normal' ? 'wireframe' : 'normal')}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                    >
                        {renderMode === 'normal' ? 'Wireframe' : 'Normal'}
                    </button>
                </div>
            </div>

            {/* Performance indicator */}
            <div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-70 px-4 py-2 rounded-xl backdrop-blur-md border border-gray-700">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Enhanced 3D Physics</span>
                </div>
            </div>
        </div>
    );
};

export default Objects;
