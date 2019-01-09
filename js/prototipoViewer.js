function print(algo){
    console.log(algo);
}
var prototipo = {};

prototipo.Archivos=[];
prototipo.addArchivo = function addArchivo(nombre,texto,lado,tipo){
    prototipo.Archivos.push([nombre,texto,lado,tipo]);    
}

prototipo.files;
