const fs = require('fs');

const axios = require('axios');

const archivo = './db/data.json';

class Busquedas {

    historial =  [];

    constructor(){
        //Leer db si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        this.historial.forEach( (lugar, i) => {
            const idx = `${ i + 1 }. `.green;
            console.log(idx, `${lugar}`.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))) );

        })
    }

    get paramsMapbox(){
        //Hacemos uso de la variable de entorno creada por dotenv
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es'
        }
    }

    get paramsWeather(){
        return {
            appid : process.env.OPENWEATHER_KEY,
            units : 'metric',
            lang : 'es'
        }
    }
    async buscar(lugar  = ''){
        /**
         * Peticion HTTP
         * URL completo:
         * https://api.mapbox.com/geocoding/v5/mapbox.places/Madrid.json?access_token=pk.
         * eyJ1Ijoic29sbiIsImEiOiJja3J2YXRnb3kwNHMxMm5sam1hazNqejJzIn0.tQ6znd_NZX3QlFazX49Rew&limit=5&
         * language=es
         * 
         * Lo desarmamos en una instancia de axion para hacerlo reutilizable
         */

        try{

            const instance = axios.create( {
    
                baseURL : `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params : this.paramsMapbox
    
            } );
            const resp = await instance.get();
    
            const ciudades = resp.data.features;
            //Regresa un arreglo de objetos de los lugares que coincidan con la búsqueda.
            //La llave indica que devuelve un objeto js
            return ciudades.map( lugar => (  {
                id: lugar.id,
                nombre : lugar.place_name,
                lng : lugar.center[0],
                lat : lugar.center[1]
    
            }   ));

        }catch(err){
            console.log(err);
        }
    }

    async climaDe(lat, lon){
        try {
            const instance = axios.create( {
                //No olvidarse de poner https porque sino no funciona
                baseURL : `https://api.openweathermap.org/data/2.5/weather`,
                params : { ...this.paramsWeather, lat, lon }
                //Desestructuramos todo el paramsWeather y le agregamos la lat y long
    
            } );

            const resp = await instance.get();

            const { weather, main } = resp.data;

            return {
                min: main.temp_min,
                max: main.temp_max,
                desc: weather[0].description,
                temp: main.temp
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = ''){
        
        //Prevenimos duplicados
        const minuscula = lugar.toLocaleLowerCase();
        if( this.historial.includes( minuscula ) ){ 
            return;
        };
        this.historial = this.historial.splice(0,5);

        //unshift es para grabar al principio del array
        this.historial.unshift( minuscula );

        //Grabar en db
        this.guardarDB();
    }

    guardarDB(){
        //Buscamos los valores existentes
        const payload = {
            historial : this.historial
        };

        fs.writeFileSync(archivo, JSON.stringify(payload));
        
    }

    leerDB() {
        if(fs.existsSync(archivo)){
            const info = fs.readFileSync(archivo, { encoding : 'utf-8'});
            const data = JSON.parse(info);
            this.historial = data.historial;
        } else return;
    }
}

module.exports = Busquedas;