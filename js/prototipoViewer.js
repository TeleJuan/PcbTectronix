function print(algo){
    console.log(algo);
}
var prototipo = {};
prototipo.numLayers = 0;
prototipo.Archivos=[];
prototipo.limits = {};
prototipo.addArchivo = function addArchivo(nombre,texto,lado,tipo){
    prototipo.Archivos.push([nombre,texto,lado,tipo]);    
}

prototipo.files;
