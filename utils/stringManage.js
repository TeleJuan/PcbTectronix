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
        //ESTO ES LO QUE IMPORTA
        var capas = 0;
        var minX = 10000000000;
        var maxX= -10000000000;
        var minY = 10000000000;
        var maxY= -10000000000;
        var minDiametro = 10000;
        //SE VAN RECORRIENDO LOS ARCHIVOS
        var lineas = completo.split("\n");
        //AQUI SE DEBERIA DETERMINAR SI ES DRILL
        var tipo = "not drill";//drill o no
        var comprobacion = "";
        for(i=0;i<3;i++){
        	comprobacion+=lineas[0][i];
        }
        if(comprobacion=="M48")tipo="drill";
        //SI ES DRILL
        if(tipo=="not drill"){
        
         	    var lineaInteres = lineas[4].split(" ");
        	    var descripcion = lineaInteres[2].split(",")
				if(descripcion[1]=="Copper")capas++;
				else if(descripcion == "Profile"){
					for(j=0;j<lineas.Lenght; j++){
						if(lineas[j][0]=="X"){
							var punto = lineas[j].substr(1).slice(0, -4).split("Y");
							var x = punto[0];
							var y = Punto[1];
							var 
							switch(x.lenght){
								case(7):
									
							}
							//deteminarLongitud
							if(punto
						
						}
					}
				}
        	}
        }
        else if(tipo=="drill"){
        	for(j=0;j<lineas.length; j++){
        		if(lineas[i][0] == "T" && linea[i].length==2){
        		var diametro = linea.split("c")[1]//toNumber
        		if(diametro < minDiametro)minDiametro=diametro;
        		}
        	}
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