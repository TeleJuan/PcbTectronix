var order = {
    layers : 1,
    dimension_x : 100,
    dimension_y : 100,
    quantity: 10,
    thickness : 0.6,
    color  : "Green",
    surface : "HALS(c/plomo)",
    oz : 1,
    hole_diameter : 0.2,

    setLayers: function(nLayer){
        this.layers = nLayer,
        initialize()
    },
    setQuantity: function(number){
        this.quantity = number,
        initialize()
    },
    setDimX : function(dimX){
        this.dimension_x = dimX,
        initialize()
    },
    setDimY : function(dimY){
        this.dimension_y = dimY,
        initialize()
    },
    setThickness: function(thick){
        this.thickness = thick,
        initialize()
    },
    setColor: function(color){
        this.color = color,
        initialize()
    },
    setSurface :function(termination){
        this.surface = termination,
        initialize()        
    },
    setOz :function(ounces){
        this.oz = ounces
        initialize()  
    },
    setDiameter :function(diam){
        this.hole_diameter = diam,
        initialize()
        
    },
    calculateTotal: function(){
        return 0
    }
}
function initialize(){
    
    document.getElementById("Tcapa").innerHTML = order.layers,
    document.getElementById("TDimX").innerHTML = order.dimension_x,
    document.getElementById("TDimY").innerHTML = order.dimension_y,
    document.getElementById("Tcantidad").innerHTML = order.quantity,
    document.getElementById("Tcolor").innerHTML = order.color,
    document.getElementById("Tgrosor").innerHTML = order.thickness,
    document.getElementById("Toz").innerHTML = order.oz ,
    document.getElementById("Tsuperficie").innerHTML = order.surface,
    document.getElementById("Tdiametro").innerHTML = order.hole_diameter
    document.getElementById("Total").innerHTML = order.calculateTotal()
}
