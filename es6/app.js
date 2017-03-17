/**
 * Created by zhengsl on 2017/3/16.
 */
//创建观察者模式代码
var pubSub = {};
(function (q) {
    var topics = {}, // 回调函数存放的数组
        subUid = -1;
    // 发布方法
    q.publish = function (topic, args) {

        if (!topics[topic]) {
            return false;
        }

        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;

        while (len--) {
            subscribers[len].func(topic, args);
        }
        return true;

    };
    //订阅方法
    q.subscribe = function (topic, func) {

        if (!topics[topic]) {
            topics[topic] = [];
        }

        var token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };
    //退订方法
    q.unsubscribe = function (token) {
        for (var m in topics) {
            if (topics[m]) {
                for (var i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    };
} (pubSub));

//创建全局配置参数
var Three=(function () {
    var config = {
        center: {
            x: 478035.68,
            y: 3759269.43
        },
        renderer: null,
        camera: null,
        scene: null,
        light: null,
        stats: null,
        controls: null,
        raycaster: null,
        mouse: null
    };
    return {
        config: config
    }
})();

var RegisterEvent=function RegisterEvent() {
    pubSub.subscribe("Render", function (ags) {
        var renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(0x87A0AB);
        renderer.autoClear = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.shadowMap.CullFaceFront = true;
        //renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        Three.config.renderer=renderer;
    });
    pubSub.subscribe("Camera", function (ags) {
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
        camera.position.set(0, 10000, 15000);
        Three.config.camera = camera;
    });
    pubSub.subscribe("Scene", function (ags) {
        Three.config.scene=scene= new THREE.Scene();
        scene.add(Three.config.camera);

        Three.config.camera.lookAt(scene.position);
    });
    pubSub.subscribe("Stats", function (ags) {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style = "position:absolute;top:0;left:0;";
        Three.config.stats = stats;
        document.body.appendChild(stats.domElement);
    });
    pubSub.subscribe("Controls", function (ags) {
        var controls = new THREE.OrbitControls(Three.config.camera, Three.config.renderer.domElement);
        controls.minDistance = 2000;
        controls.maxDistance = 9000;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = 7 * Math.PI / 15;
        Three.config.controls = controls;
    });
    pubSub.subscribe("Light", function (ags) {
        var ambientLight = new THREE.AmbientLight("#EBE7E7");
        ambientLight.intensity = 0.7;
        Three.config.scene.add(ambientLight);

        //  key light to distinguish faces of buildings
        var dirLightKey = new THREE.DirectionalLight(0xffffff, 1);
        dirLightKey.position.set(1000, 1000, 1000);
        Three.config.scene.add(dirLightKey);
        // Rim light to enhance the profile
        //dirLightRim = new THREE.DirectionalLight(0xffffff, 0.3);
        //dirLightRim.position.set(-100, 50, 0);
        //Three.config.scene.add(dirLightRim);
        //// Fill light to supply brightness of side face
        //dirLightFill = new THREE.DirectionalLight(0xffffff, 0.3);
        //dirLightFill.position.set(100, 50, -100);
        //Three.config.scene.add(dirLightFill);
    });
    pubSub.subscribe("Animate", function (ags) {
        animate();
        function animate() {
            requestAnimationFrame(animate);
            if (Three.config.controls != null)
                Three.config.controls.update();
            if (Three.config.stats != null)
                Three.config.stats.update();
            Three.config.renderer.render(Three.config.scene, Three.config.camera);
        }
    });
    pubSub.subscribe("Renderer", function (ags) {
        Three.config.renderer.render(Three.config.scene, Three.config.camera);
    });
    pubSub.subscribe("Axis", function (ags) {
        Three.config.scene.add(new THREE.AxisHelper(1000));
    });
    pubSub.subscribe("MousePick", function (ags) {
        var selectMesh=null;
        Three.config.raycaster = raycaster = new THREE.Raycaster(); // create once
        Three.config.mouse = mouse = new THREE.Vector2(); // create once
        window.addEventListener('mousemove', function (event) {
            event.preventDefault();
            mouse.x = ( event.clientX / Three.config.renderer.domElement.clientWidth ) * 2 - 1;
            mouse.y = -( event.clientY / Three.config.renderer.domElement.clientHeight ) * 2 + 1;
            raycaster.setFromCamera(mouse, Three.config.camera);
            var intersects = raycaster.intersectObjects(Three.config.scene.children);
            if (selectMesh != null) {
                selectMesh.material.color.set(0xffffff);
            }
            if (intersects.length > 0) {
                intersects[0].object.material.color.set(0xff0000);
                selectMesh = intersects[0].object;
            }
        }, false);
    });
    pubSub.subscribe("Resize", function (ags) {
        window.addEventListener('resize', function () {
            Three.config.camera.aspect = window.innerWidth / window.innerHeight;
            Three.config.camera.updateProjectionMatrix();
            Three.config.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    });

    pubSub.subscribe("Polygon", function (topic,ags) {
        var geometry = ags.geometry;
        var coordinates = geometry.coordinates[0];
        var baseGeo = [];
        coordinates.forEach(function (coordinate) {
            var vector2 = new THREE.Vector2(coordinate[0] - Three.config.center.x, coordinate[1] - Three.config.center.y);
            baseGeo.push(vector2);
        });
        ags.callback([new THREE.Shape(baseGeo)]);
    });
    pubSub.subscribe("MultiPolygon", function (topic,ags) {
        var geometry = ags.geometry, polygonShapes = [];
        geometry.coordinates.forEach(function (coordinates) {
            var baseGeo = [];
            coordinates[0].forEach(function (coordinate) {
                var vector2 = new THREE.Vector2(coordinate[0] - Three.config.center.x, coordinate[1] - Three.config.center.y);
                baseGeo.push(vector2);
            });
            var polygonShape = new THREE.Shape(baseGeo);
            polygonShapes.push(polygonShape);
        });
        ags.callback(polygonShapes);
    });
    pubSub.subscribe("LineString", function (name,ags) {
        var geometry = ags.geometry;
        var lineGeometry = new THREE.Geometry();
        geometry.coordinates.forEach(function (coordinate) {
            lineGeometry.vertices.push(
                new THREE.Vector3( coordinate[0] - Three.config.center.x, coordinate[1] - Three.config.center.y, 0 )
            );
        });
        ags.callback([lineGeometry]);
    });
    pubSub.subscribe("MultiLine", function (name,ags) {
        var geometry = ags.geometry, lineGeometries = [];
        geometry.coordinates.forEach(function (coordinates) {
            var lineGeometry = new THREE.Geometry();
            coordinates.forEach(function (coordinate) {
                lineGeometry.vertices.push(
                    new THREE.Vector3( coordinate[0] - Three.config.center.x, coordinate[1] - Three.config.center.y, 0 )
                );
            });
            lineGeometries.push(lineGeometry);
        });
        ags.callback(lineGeometries);
    });
};