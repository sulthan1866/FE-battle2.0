"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Ripple } from "./Ripple"
import { Button } from "./ui/Button"

interface StrikingObject {
    id: number
    name: string
    geometry: THREE.BufferGeometry
    material: THREE.Material
    mesh?: THREE.Mesh
    originalPosition: THREE.Vector3
    isStruck: boolean
}

export function StrikingObjects3D() {
    const mountRef = useRef<HTMLDivElement>(null);

    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    const objectsRef = useRef<StrikingObject[]>([]);
    const animationIdRef = useRef<number | null>(null);

    const [selectedObject, setSelectedObject] = useState<number>(0)
    const [isAutoStrike, setIsAutoStrike] = useState(false)

    // Particle system for impact effects
    const createImpactParticles = (position: THREE.Vector3, color = 0xffffff) => {
        const particleCount = 50
        const particles = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const velocities = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3

            // Random positions around impact point
            positions[i3] = position.x + (Math.random() - 0.5) * 0.2
            positions[i3 + 1] = position.y + (Math.random() - 0.5) * 0.2
            positions[i3 + 2] = position.z + (Math.random() - 0.5) * 0.2

            // Random velocities
            velocities[i3] = (Math.random() - 0.5) * 10
            velocities[i3 + 1] = Math.random() * 10 + 5
            velocities[i3 + 2] = (Math.random() - 0.5) * 10

            // Colors
            const c = new THREE.Color(color)
            colors[i3] = c.r
            colors[i3 + 1] = c.g
            colors[i3 + 2] = c.b
        }

        particles.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        particles.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3))
        particles.setAttribute("color", new THREE.BufferAttribute(colors, 3))

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
        })

        const particleSystem = new THREE.Points(particles, particleMaterial)
        sceneRef.current?.add(particleSystem)

        // Animate particles
        let opacity = 1.0
        const animateParticles = () => {
            const positions = particles.attributes.position.array as Float32Array
            const velocities = particles.attributes.velocity.array as Float32Array

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3

                // Update positions
                positions[i3] += velocities[i3] * 0.016
                positions[i3 + 1] += velocities[i3 + 1] * 0.016
                positions[i3 + 2] += velocities[i3 + 2] * 0.016

                // Apply gravity
                velocities[i3 + 1] -= 9.8 * 0.016
            }

            particles.attributes.position.needsUpdate = true

            opacity -= 0.02
            particleMaterial.opacity = opacity

            if (opacity > 0) {
                requestAnimationFrame(animateParticles)
            } else {
                sceneRef.current?.remove(particleSystem)
            }
        }

        animateParticles()
    }

    // Strike animation with physics
    const strikeObject = (objectIndex: number) => {
        const obj = objectsRef.current[objectIndex]
        if (!obj || !obj.mesh || obj.isStruck) return

        obj.isStruck = true
        const mesh = obj.mesh

        // Create impact particles
        createImpactParticles(mesh.position.clone(), 0xff4444)

        // Strike animation
        const originalScale = mesh.scale.clone()
        const originalPosition = mesh.position.clone()

        // Impact deformation
        const deformTween = {
            scale: { x: 1.3, y: 0.7, z: 1.3 },
            rotation: { x: 0, y: 0, z: 0 },
            position: { x: 0, y: -0.5, z: 0 },
        }

        // Bounce back animation
        const bounceHeight = 2 + Math.random() * 3
        const bounceRotation = (Math.random() - 0.5) * Math.PI * 2

        let animationTime = 0
        const animationDuration = 2000 // 2 seconds

        const animate = () => {
            animationTime += 16
            const progress = Math.min(animationTime / animationDuration, 1)

            if (progress < 0.1) {
                // Impact deformation phase
                const deformProgress = progress / 0.1
                mesh.scale.lerp(
                    new THREE.Vector3(
                        originalScale.x * deformTween.scale.x,
                        originalScale.y * deformTween.scale.y,
                        originalScale.z * deformTween.scale.z,
                    ),
                    deformProgress * 0.5,
                )

                mesh.position.y = originalPosition.y + deformTween.position.y * deformProgress
            } else if (progress < 0.8) {
                // Bounce phase
                const bounceProgress = (progress - 0.1) / 0.7
                const bounceY = Math.sin(bounceProgress * Math.PI) * bounceHeight

                mesh.position.y = originalPosition.y + bounceY
                mesh.rotation.x = bounceRotation * bounceProgress
                mesh.rotation.z = bounceRotation * 0.5 * bounceProgress

                // Restore scale
                mesh.scale.lerp(originalScale, bounceProgress * 0.3)
            } else {
                // Landing phase
                const landProgress = (progress - 0.8) / 0.2
                mesh.position.lerp(originalPosition, landProgress)
                mesh.rotation.x *= 1 - landProgress
                mesh.rotation.z *= 1 - landProgress
                mesh.scale.lerp(originalScale, landProgress)
            }

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                // Reset object state
                mesh.position.copy(originalPosition)
                mesh.rotation.set(0, 0, 0)
                mesh.scale.copy(originalScale)
                obj.isStruck = false
            }
        }

        animate()
    }

    // Initialize Three.js scene
    useEffect(() => {
        if (!mountRef.current) return

        // Scene setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x1a1a1a)
        sceneRef.current = scene

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(0, 5, 10)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        rendererRef.current = renderer
        mountRef.current.appendChild(renderer.domElement)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(10, 10, 5)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = 2048
        directionalLight.shadow.mapSize.height = 2048
        scene.add(directionalLight)

        const pointLight = new THREE.PointLight(0xff4444, 0.5, 100)
        pointLight.position.set(-5, 5, 5)
        scene.add(pointLight)

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20)
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 })
        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.rotation.x = -Math.PI / 2
        ground.position.y = -2
        ground.receiveShadow = true
        scene.add(ground)

        // Create striking objects
        const objects: StrikingObject[] = [
            {
                id: 0,
                name: "Sphere",
                geometry: new THREE.SphereGeometry(0.8, 32, 32),
                material: new THREE.MeshPhongMaterial({ color: 0xff6b6b, shininess: 100 }),
                originalPosition: new THREE.Vector3(-4, 0, 0),
                isStruck: false,
            },
            {
                id: 1,
                name: "Cube",
                geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5),
                material: new THREE.MeshPhongMaterial({ color: 0x4ecdc4, shininess: 100 }),
                originalPosition: new THREE.Vector3(-2, 0, 0),
                isStruck: false,
            },
            {
                id: 2,
                name: "Cylinder",
                geometry: new THREE.CylinderGeometry(0.6, 0.6, 1.8, 32),
                material: new THREE.MeshPhongMaterial({ color: 0x45b7d1, shininess: 100 }),
                originalPosition: new THREE.Vector3(0, 0, 0),
                isStruck: false,
            },
            {
                id: 3,
                name: "Cone",
                geometry: new THREE.ConeGeometry(0.8, 1.8, 32),
                material: new THREE.MeshPhongMaterial({ color: 0xf9ca24, shininess: 100 }),
                originalPosition: new THREE.Vector3(2, 0, 0),
                isStruck: false,
            },
            {
                id: 4,
                name: "Torus",
                geometry: new THREE.TorusGeometry(0.8, 0.3, 16, 100),
                material: new THREE.MeshPhongMaterial({ color: 0x6c5ce7, shininess: 100 }),
                originalPosition: new THREE.Vector3(4, 0, 0),
                isStruck: false,
            },
        ]

        objects.forEach((obj) => {
            const mesh = new THREE.Mesh(obj.geometry, obj.material)
            mesh.position.copy(obj.originalPosition)
            mesh.castShadow = true
            mesh.receiveShadow = true
            obj.mesh = mesh
            scene.add(mesh)
        })

        objectsRef.current = objects

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate)

            // Rotate objects slightly
            objects.forEach((obj, index) => {
                if (obj.mesh && !obj.isStruck) {
                    obj.mesh.rotation.y += 0.005 * (index + 1)
                    obj.mesh.rotation.x += 0.003 * (index + 1)
                }
            })

            renderer.render(scene, camera)
        }
        animate()

        // Handle window resize
        const handleResize = () => {
            if (camera && renderer) {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()
                renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6)
            }
        }
        window.addEventListener("resize", handleResize)

        // Auto-strike mode
        let autoStrikeInterval: NodeJS.Timeout
        if (isAutoStrike) {
            autoStrikeInterval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * objects.length)
                strikeObject(randomIndex)
            }, 1500)
        }

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current)
            }
            if (autoStrikeInterval) {
                clearInterval(autoStrikeInterval)
            }
            window.removeEventListener("resize", handleResize)
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement)
            }
            renderer.dispose()
        }
    }, [isAutoStrike])

    return (
        <div className="w-full">
            {/* Video Reference */}
            <div className="mb-8 text-center">
                <Ripple className="inline-block rounded-2xl overflow-hidden shadow-2xl">
                    <video autoPlay loop muted playsInline className="w-full max-w-4xl h-auto">
                        <source src="/videos/striking-objects-reference.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Ripple>
            </div>

            {/* 3D Scene */}
            <div className="flex justify-center mb-8">
                <div
                    ref={mountRef}
                    className="border-2 border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden shadow-2xl"
                    style={{ width: "80vw", height: "60vh" }}
                />
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-6">
                {/* Object Selection */}
                <div className="flex flex-wrap justify-center gap-3">
                    {objectsRef.current.map((obj, index) => (
                        <Ripple key={obj.id}>
                            <Button
                                variant={selectedObject === index ? "default" : "outline"}
                                onClick={() => {
                                    setSelectedObject(index)
                                    strikeObject(index)
                                }}
                                className="text-sm px-4 py-2"
                                disabled={obj.isStruck}
                            >
                                Strike {obj.name}
                            </Button>
                        </Ripple>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Ripple>
                        <Button
                            onClick={() => strikeObject(selectedObject)}
                            disabled={objectsRef.current[selectedObject]?.isStruck}
                            className="px-6 py-3"
                        >
                            Strike Selected
                        </Button>
                    </Ripple>

                    <Ripple>
                        <Button
                            variant="outline"
                            onClick={() => {
                                objectsRef.current.forEach((_, index) => {
                                    setTimeout(() => strikeObject(index), index * 200)
                                })
                            }}
                            className="px-6 py-3"
                        >
                            Strike All
                        </Button>
                    </Ripple>

                    <Ripple>
                        <Button
                            variant={isAutoStrike ? "default" : "outline"}
                            onClick={() => setIsAutoStrike(!isAutoStrike)}
                            className="px-6 py-3"
                        >
                            {isAutoStrike ? "Stop Auto" : "Auto Strike"}
                        </Button>
                    </Ripple>
                </div>

                {/* Instructions */}
                <div className="text-center max-w-2xl">
                    <p className="text-gray-600 dark:text-gray-300">
                        Click on any object button to strike it with realistic physics. Watch as objects deform on impact, bounce
                        with particle effects, and return to their original state. Enable auto-strike mode for continuous action!
                    </p>
                </div>
            </div>
        </div>
    )
}

