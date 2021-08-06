//Para comenzar la app pusimos un script llamado start, ejecutamos el programa en la consola
//Poniendo 'npm start'

//Primero importaciones de terceros
require('dotenv').config();
require('colors');
const colors = require('colors');
//Luego las nuestras
const { menu, leerInput, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/Busquedas');


const main = async() => {

    let opt;
    const busquedas = new Busquedas();
    

    do{
        opt = await menu();
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const lugar = await leerInput('Lugar:');
                //Buscar ciudades
                const lugares = await busquedas.buscar(lugar);
                //Mostrar lugares
                //console.log(lugares);
                //Seleccione lugar
                const id = await listarLugares(lugares); 
                if(id === '0') continue; //Regresa a la iteracion del ciclo

                //Buscar lugar con su ID
                const lugarSelec = lugares.find( l => l.id === id );

                //Agregamos al historial y a DB
                busquedas.agregarHistorial(lugarSelec.nombre);

                //Clima
                const clima = await busquedas.climaDe(lugarSelec.lat, lugarSelec.lng);

                console.clear();
                //Mostrar resultados
                console.log('\nInformación del lugar: \n'.green);
                console.log('Cuidad: ', lugarSelec.nombre.green );
                console.log('Latitud: ', lugarSelec.lat);
                console.log('Longitud: ', lugarSelec.lng);
                console.log('Temperatura: ', clima.temp );
                console.log('Mínima: ', clima.min );
                console.log('Máxima: ', clima.max );
                console.log('Cómo está el clima: ', clima.desc.green );

                break;
            
            case 2:
                busquedas.historialCapitalizado;
                break;
        }

        

        if(opt != 0 ) await pausa();

    } while (opt != 0);


}

main();