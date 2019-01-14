 <script>
        var $result = $("#result");
        $("#file").on("change", function (evt) {
            // remove content
            $result.html("");
            // Esto muestra lo que tiene el archivo
            //$("#result_block").removeClass("hidden").addClass("show");
            //$("#lecture_zip").removeClass("hidden").addClass("show");
            // Closure to capture the file information.
            function handleFile(f) {
                var $title = $("<h4>", {
                    text: f.name
                });
                var $fileContent = $("<ul>");
                $result.append($title);
                $result.append($fileContent);
                var dateBefore = new Date();
                var flag = true;
                JSZip.loadAsync(f)                                   // 1) read the Blob
                    .then(function (zip) {
                        var dateAfter = new Date();
                        $title.append($("<span>", {
                            "class": "small",
                            text: " (loaded in " + (dateAfter - dateBefore) + "ms)"
                        }));

                        var promises = []
                        zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                            promises.push(
                                zip.files[zipEntry.name].async("string")
                                    .then(function (data) {
                                        var datosfaltantes = wG.guessLayer(zipEntry.name);
                                        prototipo.addArchivo(zipEntry.name, data, datosfaltantes[0], datosfaltantes[1]);
                                        prototipo.layers++;
                                        return data;
                                    }));

                            $fileContent.append($("<li>", {
                                text: zipEntry.name

                            }));
                        });
                        var promesas = Promise.all(promises).then(function () {
                            return promises;
                        });
                        return promesas;
                    },
                        function (e) {
                            $result.append($("<div>", {
                                "class": "alert alert-danger",
                                text: "Error reading " + f.name + ": " + e.message
                            }));
                        })
                    //aqui  se cargaron los archivos, promesas no sirve para nada, 
                    //se utiliza para que todos los datos se pasen correctamente a order.js
                    .then(function (promesas) {
                        order.setLayers(0);
                        var layers = [];

                        for (i = 0; i < prototipo.Archivos.length; i++) {
                            procesarTexto(prototipo.Archivos[i][1]);
                            var g = wG.load(prototipo.Archivos[i][1])
                            g.type = prototipo.Archivos[i][3];
                            g.side = prototipo.Archivos[i][2];
                            g.name = prototipo.Archivos[i][0];

                            if (layers.push(g) >= prototipo.Archivos.length) {
                                //layers es un arreglo de "g"}
                                var limits = {};
                                var h;
                                var w
                                function draw(capa) {
                                    limits.minX = order.minX;
                                    limits.minY = order.minY;
                                    limits.maxX = order.maxX;
                                    limits.maxY = order.maxY;

                                    w = (limits.maxX - limits.minX);
                                    h = limits.maxY - limits.minY;
                                    var bottom = wG.makeBoard(w, h, false, "Bottom");
                                    var top = wG.makeBoard(w, h, true, "Top");
                                    wG.clearBoard(bottom), wG.clearBoard(top)
                                    capa.sort(function (a, b) {
                                        return (a.type || 10) - (b.type || 10);
                                    });
                                    for (i = 0; i < capa.length; i++) {
                                        if (capa[i].side & wG.BOTTOM)
                                            wG.renderBoard(bottom, capa[i], limits);//, bottomTexture.needsUpdate = true;
                                        if (capa[i].side & wG.TOP)
                                            wG.renderBoard(top, capa[i], limits);
                                    }
                                    $('#canvas-images').removeClass("hidden");
                                    $('#canvas-top').append(top);
                                    $('#canvas-bottom').append(bottom);
                                    var boton = $("<button>",{
                                        text:"Ver en 3D",
                                        style: "background-color: white",
                                    });
                                    $('#3D').append(boton).on("click",function(){
                                        print("aqui es cuando se abre un popup");
                                    });
                                }
                                draw(layers);
                            }
                        }
                    });

            }

            var files = evt.target.files;
            for (var i = 0; i < files.length; i++) {
                handleFile(files[i]);
            }

        });

    </script>