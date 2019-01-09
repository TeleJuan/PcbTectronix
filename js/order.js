function print(algo) {
    console.log(algo);
}

var order = {
    layers: 1,
    dimension_x: 100,
    dimension_y: 100,
    quantity: 10,
    thickness: 0.6,
    color: "Verde",
    surface: "HALS(c/plomo)",
    numsurface: 1,
    oz: 1,
    hole_diameter: 0.2,
    aux_hole: 10,
    holes: [0.2, 0.25, 0.3, 0.4, 0.5],

    addLayers: function () {
        this.layers += 1;

        initialize()
    },
    changeHole: function (newhole) {
        if (newhole < this.aux_hole && this.holes.includes(newhole)) {
            document.getElementById("diametro" + this.hole_diameter).classList.remove("active");
            this.setDiameter(newhole);
            document.getElementById("diametro" + this.hole_diameter).classList.add("active");
            initialize();
        }
    },
    setDims: function (dimX, dimY) {
        this.dimension_x = dimX;
        this.dimension_y = dimY;
        document.getElementById("dimY").value = dimY;
        document.getElementById("dimX").value = dimX;;
        initialize();
    },
    setLayers: function (nLayer) {
        document.getElementById("nlayer" + this.layers).classList.remove("active");
        this.layers = nLayer;
        if (nLayer != 0) {
            document.getElementById("nlayer" + this.layers).classList.add("active");
        }
        initialize()
    },
    setQuantity: function (number) {
        this.quantity = number;
        initialize();
    },
    setDimX: function (dimX) {
        this.dimension_x = dimX;
        initialize();
    },
    setDimY: function (dimY) {
        this.dimension_y = dimY;
        initialize();
    },
    setThickness: function (thick) {
        document.getElementById("grosor" + this.thickness).classList.remove("active");
        this.thickness = thick;
        document.getElementById("grosor" + this.thickness).classList.add("active");
        initialize();
    },
    setColor: function (color) {
        document.getElementById("colorCapa" + this.color).classList.remove("active");
        this.color = color;
        document.getElementById("colorCapa" + this.color).classList.add("active");
        initialize();
    },
    setSurface: function (termination) {
        document.getElementById("superficie" + this.numsurface).classList.remove("active");
        switch (termination) {
            case 1:
                string = "HALS(c/plomo)";
                break;
            case 2:
                string = "HASL-RoHS(s/plomo)"
                break;
            case 3:
                string = "ENIG-RoHS";
                break;
        }
        this.surface = string;
        this.numsurface = termination;
        document.getElementById("superficie" + this.numsurface).classList.add("active");
        initialize();
    },
    setOz: function (ounces) {
        document.getElementById("ozlayer" + this.oz).classList.remove("remove");
        this.oz = ounces;
        document.getElementById("ozlayer" + this.oz).classList.add("active");
        initialize();
    },
    setDiameter: function (diam) {
        document.getElementById("diametro" + this.hole_diameter).classList.remove("active");
        this.hole_diameter = diam;
        document.getElementById("diametro" + this.hole_diameter).classList.add("active");
        initialize();

    },
    calculateTotal: function () {
        return 0
    }
}
function initialize() {

    document.getElementById("Tcapa").innerHTML = order.layers;
    document.getElementById("TDimX").innerHTML = order.dimension_x;
    document.getElementById("TDimY").innerHTML = order.dimension_y;
    document.getElementById("Tcantidad").innerHTML = order.quantity;
    document.getElementById("Tcolor").innerHTML = order.color;
    document.getElementById("Tgrosor").innerHTML = order.thickness;
    document.getElementById("Toz").innerHTML = order.oz;
    document.getElementById("Tsuperficie").innerHTML = order.surface;
    document.getElementById("Tdiametro").innerHTML = order.hole_diameter;
    document.getElementById("Total").innerHTML = order.calculateTotal();
}

var capas = 0;
var minX = 10000000000;
var maxX = -10000000000;
var minY = 10000000000;
var maxY = -10000000000;
var minDiametro = 10000;
var dimX = 0;
var dimY = 0;

function procesarTexto(f) {
    var lineas = f.split("\n");
    //AQUI SE DEBERIA DETERMINAR SI ES DRILL
    var tipo = "not drill";//drill o no
    var comprobacion = "";
    for (i = 0; i < 3; i++) {
        comprobacion += lineas[0][i];
    }
    if (comprobacion == "M48") tipo = "drill";
    //SI ES DRILL
    if (tipo == "not drill") {
        var lineaInteres = lineas[4].split(" ");
        var descripcion = lineaInteres[2].split(",")
        if (descripcion[1] == "Copper") {
            order.addLayers();

        }
        else if (descripcion[1] == "Profile") {
            for (j = 0; j < lineas.length; j++) {
                if (lineas[j][0] == "X") {
                    var punto = lineas[j].substr(1).slice(0, -4).split("Y");
                    var x = parseInt(punto[0], 10) / Math.pow(10, 6);
                    var y = parseInt(punto[1], 10) / Math.pow(10, 6);
                    if (x < minX) minX = x;
                    else if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    else if (y > maxY) maxY = y;

                }
            }
            dimX = Math.abs(maxX - minX);
            dimY = Math.abs(maxY - minY);
            order.setDims(dimX, dimY);
        }
    }
    else if (tipo == "drill") {
        length
        for (j = 0; j < lineas.length; j++) {
            var metr_diam = lineas[j].split("C");
            if (lineas[j][0] == "T" && metr_diam.length == 2) {
                var diametro = parseFloat(metr_diam[1]);
                if (diametro < minDiametro) minDiametro = diametro;
            }
        }
        order.changeHole(minDiametro);
    }
};
