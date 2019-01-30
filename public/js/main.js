        window.addEventListener('DOMContentLoaded', function(){
            // get the canvas DOM element
            const canvas = document.getElementById('renderCanvas');

            // load the 3D engine
            const engine = new BABYLON.Engine(canvas, true);

            // createScene function that creates and return the scene
            const createScene = function(){
                // create a basic BJS Scene object
                const scene = new BABYLON.Scene(engine);
                scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);

                // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
                const camera = new BABYLON.ArcRotateCamera("Camera", 300, Math.PI / 2, 5, new BABYLON.Vector3(0, 0, 0), scene);

                // target the camera to scene origin
                camera.setTarget(BABYLON.Vector3.Zero());

                // attach the camera to the canvas
                camera.attachControl(canvas, false);

                //Glow layer
                const glowPack = new BABYLON.GlowLayer("glow", scene);
                let t = 0;
                scene.onBeforeRenderObservable.add(function() {
                    t += 0.01;
                    glowPack.intensity = Math.cos(t) * 0.5 + 0.5;
                });

                //Mouse event for texture pickers
                const colors = document.getElementById('colors');
                const gold = document.getElementById('gold');
                const crystal = document.getElementById('glass');
                const leatherFab = document.getElementById('leather');
                const woodPan = document.getElementById('wood');
                const cityScape = document.getElementById('city');
                const rgb = document.querySelector('.rgb');

                // Skybox
                const skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
                const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.disableLighting = true;
                skybox.material = skyboxMaterial;
                skybox.infiniteDistance = true;
                skyboxMaterial.disableLighting = true;
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/textures/fieldEnvHDR.dds", scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

                // create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation 
                const sphere = BABYLON.Mesh.CreateSphere('sphere1', 60, 2, scene);

                const hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/fieldEnvHDR.dds", scene);
                hdrTexture.gammaSpace = true;
                scene.environmentTexture = hdrTexture;
                scene.imageProcessingConfiguration.exposure = 2.6;
                scene.imageProcessingConfiguration.contrast = 1.6;
                
                //PBR Texture
                const pbr = new BABYLON.PBRMaterial("pbr", scene);
                pbr.reflectionTexture = hdrTexture;
                pbr.directIntensity = 16.0;
                pbr.environmentIntensity = 2.3;
                pbr.indexOfRefraction = 1.52;
                pbr.cameraExposure = 0.30;
                pbr.cameraContrast = 0.99;
                pbr.microSurface = 1;
                pbr.reflectivityColor = new BABYLON.Color3(0.001, 0.001, 0.001);
                pbr.enableSpecularAntiAliasing = true;
                sphere.material = pbr; 
                
                //Oxidized Gold Texture
                const oxgold = new BABYLON.PBRMaterial("", scene);
                oxgold.reflectivityTexture = new BABYLON.Texture("textures/oxgold/oxgold_refl.jpg", scene);
                oxgold.albedoTexture = new BABYLON.Texture("textures/oxgold/oxgold_spec.jpg", scene);
                oxgold.reflectivityColor = new BABYLON.Vector3(0.862, 0.729, 0.341);
                oxgold.bumpTexture = new BABYLON.Texture("textures/oxgold/oxgold_nrm.jpg", scene);
                oxgold.cameraExposure = 0.30;
                oxgold.cameraContrast = 0.99;
                oxgold.microSurface = 0.0;
                oxgold.environmentIntensity = 1;
                oxgold.specularIntensity = 0.0;
                oxgold.useMicroSurfaceFromReflectivityMapAlpha = false;

                //Leather Texture
                const leather = new BABYLON.PBRMaterial("", scene);
                leather.reflectivityTexture = new BABYLON.Texture("textures/leather/leather_refl.jpg", scene);
                leather.albedoTexture = new BABYLON.Texture("textures/leather/leather.jpg", scene);
                leather.bumpTexture = new BABYLON.Texture("textures/leather/leather_nrm.jpg", scene);
                leather.cameraExposure = 0.30;
                leather.cameraContrast = 0.99;
                leather.microSurface = 0.2;
                leather.environmentIntensity = 1;
                leather.specularIntensity = 0.0;
                leather.useMicroSurfaceFromReflectivityMapAlpha = true;
                leather.forceIrradianceInFragment = true;

                //Wood Texture
                const wood = new BABYLON.PBRMaterial("", scene);
                wood.reflectivityTexture = new BABYLON.Texture("textures/wood/wood_refl.jpg", scene);
                wood.albedoTexture = new BABYLON.Texture("textures/wood/wood.jpg", scene);
                wood.bumpTexture = new BABYLON.Texture("textures/wood/wood_nrm.jpg", scene);
                wood.cameraExposure = 0.30;
                wood.cameraContrast = 0.99;
                wood.microSurface = 1.0;
                wood.useMicroSurfaceFromReflectivityMapAlpha = true;
                wood.forceIrradianceInFragment = true;

                //Emission Texture
                const glow = new BABYLON.PBRMaterial("", scene);
                glow.reflectionTexture = hdrTexture;
                glow.refractionTexture = hdrTexture;
                glow.linkRefractionWithTransparency = true;
                glow.indexOfRefraction = 0.2168;
                glow.alpha = 0;
                glow.cameraExposure = 0.90;
                glow.cameraContrast = 0.99;
                glow.microSurface = 0.9;
                glow.emissiveColor = new BABYLON.Color3(1.0, 1.0, 1.0);
                
                //Glass
                const glass = new BABYLON.PBRMaterial("glass", scene);
                glass.reflectionTexture = hdrTexture;
                glass.refractionTexture = hdrTexture;
                glass.linkRefractionWithTransparency = true;
                glass.indexOfRefraction = 0.2168;
                glass.alpha = 0;
                glass.cameraExposure = 0.20;
                glass.cameraContrast = 0.99;
                glass.microSurface = 0.9;
                glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
                                
                //Mouse event for color picker
                const input = document.querySelectorAll('input');

                //color picker 
                for (let i = 0; i < input.length; i++) {
                    input[i].addEventListener('input', () => {
                        //slider values
                        let red = document.getElementById('red').value,
                            green = document.getElementById('green').value,
                            blue = document.getElementById('blue').value;

                            redval = document.getElementById('redval');
                            greenval = document.getElementById('greenval');
                            blueval = document.getElementById('blueval');

                            document.body.style.background = `rgb(${red}, ${green}, ${blue})`;
                            redval.innerHTML = `${red}`;
                            greenval.innerHTML = `${green}`;
                            blueval.innerHTML = `${blue}`;

                        let r = parseFloat(red / 255).toFixed(3),
                            g = parseFloat(green/  255).toFixed(3),
                            b = parseFloat(blue / 255).toFixed(3);

                        pbr.reflectivityColor = new BABYLON.Color3(r, g, b);
                    });
                }  

             
                //event listeners
                colors.addEventListener('click', () => {
                    const pbr = new BABYLON.PBRMaterial("pbr", scene);
                    pbr.reflectionTexture = hdrTexture;
                    pbr.directIntensity = 16.0;
                    pbr.environmentIntensity = 2.3;
                    pbr.indexOfRefraction = 1.52;
                    pbr.cameraExposure = 0.60;
                    pbr.cameraContrast = 0.99;
                    pbr.microSurface = 1;
                    pbr.reflectivityColor = new BABYLON.Color3(0.001, 0.001, 0.001);
                    pbr.enableSpecularAntiAliasing = true;
                    sphere.material = pbr; 

                //color picker 
                for (let i = 0; i < input.length; i++) {
                    input[i].addEventListener('input', () => {
                        //slider values
                        let red = document.getElementById('red').value,
                            green = document.getElementById('green').value,
                            blue = document.getElementById('blue').value;

                            redval = document.getElementById('redval');
                            greenval = document.getElementById('greenval');
                            blueval = document.getElementById('blueval');

                            document.body.style.background = `rgb(${red}, ${green}, ${blue})`;
                            redval.innerHTML = `${red}`;
                            greenval.innerHTML = `${green}`;
                            blueval.innerHTML = `${blue}`;

                        let r = parseFloat(red / 255).toFixed(3),
                            g = parseFloat(green/  255).toFixed(3),
                            b = parseFloat(blue / 255).toFixed(3);

                        pbr.reflectivityColor = new BABYLON.Color3(r, g, b);
                    });
                }  

                    rgb.style.display = "block";
                });

                gold.addEventListener('click', () => {
                    sphere.material = oxgold;
                    rgb.style.display = "none";
                });

                leatherFab.addEventListener('click', () => {
                    sphere.material = leather;
                    rgb.style.display = "none";
                });

                woodPan.addEventListener('click', () => {
                    sphere.material = wood;
                    rgb.style.display = "none";
                });

                cityScape.addEventListener('click', () => {
                    sphere.material = glow;

                    //color picker 
                for (let i = 0; i < input.length; i++) {
                    input[i].addEventListener('input', () => {
                        //slider values
                        let red = document.getElementById('red').value,
                            green = document.getElementById('green').value,
                            blue = document.getElementById('blue').value;

                            redval = document.getElementById('redval');
                            greenval = document.getElementById('greenval');
                            blueval = document.getElementById('blueval');

                            document.body.style.background = `rgb(${red}, ${green}, ${blue})`;
                            redval.innerHTML = `${red}`;
                            greenval.innerHTML = `${green}`;
                            blueval.innerHTML = `${blue}`;

                        let r = parseFloat(red / 255).toFixed(3),
                            g = parseFloat(green/  255).toFixed(3),
                            b = parseFloat(blue / 255).toFixed(3);

                        glow.emissiveColor = new BABYLON.Color3(r, g, b);
                    });
                }  

                    rgb.style.display = "block";
                });

                crystal.addEventListener('click', () => {
                    sphere.material = glass;
                    rgb.style.display = "none";
                });

                // return the created scene
                return scene;
            }

            // call the createScene function
            const scene = createScene();

            // run the render loop
            engine.runRenderLoop(function(){
                scene.render();
            });

            // the canvas/window resize event handler
            window.addEventListener('resize', function(){
                engine.resize();
            });
        });

