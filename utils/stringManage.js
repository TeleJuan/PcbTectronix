function print(string) {
    console.log(string);
}
function leerArchivo(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        mostrarContenido(contenido);
        i = 0;
        var string = "";
        var completo = "";
        while (true) {
            string += contenido[i];
            completo += contenido[i];
            if (string == "M02") {
                console.log("archivo leido completamente");
                // console.log(string);
                break;
            }

            if (contenido[i] == "\n") {
                // console.log(string);
                string = "";
            }
            i++;
        }
        //print("contenido del archivo:\n\n" + completo);
        var lineas = completo.split("\n");
        for (j = 0; j < 6; j++) {
            var linea = lineas[j].split(" ");
            var descripcion = linea[2].split(",")
            if(descripcion[1]=="Copper")print("Capa encontrada");
            //print(linea[0]);
        }


    };
    lector.readAsText(archivo);
}

function mostrarContenido(contenido) {
    var elemento = document.getElementById('contenido-archivo');
    elemento.innerHTML = contenido;
}

document.getElementById('file-input')
    .addEventListener('change', leerArchivo, false);