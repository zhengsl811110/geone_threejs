if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
window.onload=function () {
    RegisterEvent();

    //pubSub.publish("Stats");
    pubSub.publish("Render");
    pubSub.publish("Camera");
    pubSub.publish("Scene");
    //pubSub.publish("Axis");
    pubSub.publish("Controls");
    pubSub.publish("Light");
    pubSub.publish("Resize");
    pubSub.publish("Animate");
    //pubSub.publish("MousePick");

    loadPlane();
    loadRoad();
    loadProject();
    loadPipe();
    setTimeout(function () {
        loadBuilding();
    },500)
    pubSub.publish("Renderer");
};

function loadPlane() {
    $.getJSON("http://localhost/threejs/plane.ashx", {}, function (res) {
        res.forEach(function (geo) {
            var meshes = [];
            var geometry = JSON.parse(geo.geometry);
            pubSub.publish(geometry.type, {
                geometry: geometry,
                callback: function (shapes) {
                    var planeGroup = new THREE.Group();
                    shapes.forEach(function (shape) {
                        var meshMaterial = new THREE.MeshLambertMaterial({
                            color: 0x777777,
                            transparent: true,
                            opacity: 1
                        });
                        var mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
                                amount: geo.height * 2,
                                bevelEnabled: false
                            }),
                            meshMaterial);
                        planeGroup.add(mesh);
                    });
                    planeGroup.position.y = -110;
                    planeGroup.rotation.x = THREE.Math.degToRad(-90);
                    Three.config.scene.add(planeGroup);
                }
            });

        });
    });
}
function loadRoad() {
    $.getJSON("http://localhost/threejs/Road.ashx", {}, function (res) {
        res.forEach(function (geo) {
            var meshes = [];
            var geometry = JSON.parse(geo.geometry);
            pubSub.publish(geometry.type, {
                geometry: geometry,
                callback: function (shapes) {
                    var roadGroup = new THREE.Group();
                    shapes.forEach(function (shape) {
                        var meshMaterial = new THREE.MeshLambertMaterial({
                            color: 0x343434,
                            transparent: true,
                            opacity: 1,
                            depthTest:false
                        });
                        var mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
                                amount: geo.height * 2,
                                bevelEnabled: false
                            }),
                            meshMaterial);
                        roadGroup.add(mesh);
                    });
                    roadGroup.rotation.x = THREE.Math.degToRad(-90);
                    Three.config.scene.add(roadGroup);
                }
            });

        });
    });
}
function loadProject() {
    $.getJSON("http://localhost/threejs/Project.ashx", {}, function (res) {
        res.forEach(function (geo) {
            var meshes = [];
            var geometry = JSON.parse(geo.geometry);
            pubSub.publish(geometry.type, {
                geometry: geometry,
                callback: function (shapes) {
                    var projectGroup = new THREE.Group();
                    shapes.forEach(function (shape) {
                        var meshMaterial = new THREE.MeshLambertMaterial({
                            color: 0x666666,
                            transparent: true,
                            opacity: 1
                        });
                        var mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
                                amount: geo.height * 2,
                                bevelEnabled: false
                            }),
                            meshMaterial);
                        projectGroup.add(mesh);
                    });
                    projectGroup.rotation.x = THREE.Math.degToRad(-90);
                    Three.config.scene.add(projectGroup);
                }
            });

        });
    });
}
function loadBuilding(){
    var serverRange = [[0, 1000], [1001, 2000], [2001, 3000], [3001, 4000], [4001, 5000], [5001, 6000], [6001, 7000], [7001, 8000], [8001, 9000], [9001, 10000], [10001, 11000], [11001, 12000], [12001, 13000], [13001, 14000]];
    serverRange.forEach(function (range) {
        $.getJSON("http://localhost/threejs/Building.ashx", {s:range[0],e:range[1]}, function (res) {
            res.forEach(function (geo) {
                var meshes = [];
                var geometry = JSON.parse(geo.geometry);
                pubSub.publish(geometry.type, {
                    geometry: geometry,
                    callback: function (shapes) {
                        var buildGroup=new THREE.Group();
                        shapes.forEach(function (shape) {
                            var meshMaterial = new THREE.MeshLambertMaterial({
                                color: 0xFFFFFF,
                                transparent: true,
                                opacity: 0.8
                            });
                            var mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, {
                                    amount: geo.height * 2,
                                    bevelEnabled: false
                                }),
                                meshMaterial);
                            buildGroup.add(mesh);
                        });
                        buildGroup.rotation.x = THREE.Math.degToRad(-90);
                        Three.config.scene.add(buildGroup);
                    }
                });

            });
        });
    });
}
function  loadPipe(){
    $.getJSON("http://localhost/threejs/Pipe.ashx", {name:"zxgh_gd_dlx_l"}, function (res) {
        res.forEach(function (geo) {
            var meshes = [];
            var geometry = JSON.parse(geo.geometry);
            pubSub.publish(geometry.type, {
                geometry: geometry,
                callback: function (lineGeometries) {
                    var lineGroup = new THREE.Group();
                    lineGeometries.forEach(function (lineGeometry) {
                        var material = new THREE.LineBasicMaterial({
                            color: 0xeef66e,
                            transparent: true,
                            opacity: 0.8
                        });
                        var line = new THREE.Line( lineGeometry, material);
                        lineGroup.add(line);
                    });

                    lineGroup.rotation.x = THREE.Math.degToRad(-90);
                    lineGroup.position.y=10;
                    Three.config.scene.add( lineGroup );
                }
            });

        });
    });
}