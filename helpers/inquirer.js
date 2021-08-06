require('colors');

const inquirer = require('inquirer')

const preguntas = [

    {
        type : 'list',
        name : 'opcion',
        value : '¿Qué deseas hacer?',
        choices : [

            {
                value: 1, 
                name: `${'1.'.green} Buscar locación.`
            },
            {
                value: 2, 
                name: `${'2.'.green} Mi historial.`
            },
            {
                value: 0, 
                name: `${'0.'.green} Salir.`
            }
        ]
    },

]

//Devuelve una promesa
const menu = async() => {
    console.clear();
    console.log("******************************\n".green);
    console.log("******************************\n".green);
    console.log("    Seleccione una opción     \n".white);
    console.log("******************************\n".green);
    console.log("******************************\n".green);
    //Esperamos la promesa que devuelve el inquire

    //IMPORTANTE el nombre es depende del nombre que le pusimos en el objeto preguntas
    const {opcion}  =  await inquirer.prompt(preguntas);

    return opcion;
}

//Devuelve una promesa
const pausa = async() => {

    const pregunta = [
        {
            type : 'input',
            name : 'enter', //Esto en realidad no nos sirve de nada
            message : `Presione ${'ENTER'.green} para continuar.`
        }
    ]
    console.log('\n');
    //Esperamos la promesa que devuelve el inquire
    //El await va a esperar a que se presione ENTER para continuar
    await inquirer.prompt(pregunta);

}

const confirmacion = async( message ) => {
    const pregunta = [

        {
            type : 'confirm',
            name : 'ok',
            message
        }

    ]

    const {ok} = await inquirer.prompt(pregunta);
    return ok;
}

const leerInput = async(message = '') => {

    const pregunta = [
        {
            type : 'input',
            name : 'preg', //Esto en realidad no nos sirve de nada
            message,
            validate( value ) {
                if (value.length === 0){
                    return 'Por favor, ingrese un valor.'
                }
                return true;
            }
        }
    ];
    //desestructuramos para que devuelva solo el dato, no un objeto
    const { preg } = await inquirer.prompt(pregunta);
    return preg;

}


/**
{
    value: tarea.id, 
    name: `${'1.'.green} descripcion.`
},

*/

const listarLugares = async(lugares = []) => {
    //El metodo map recorre los elementos del array y crea otro array hijo
    const choices = lugares.map( (lugar, index) => {

        const idx = `${index + 1}.`.green;
        return {
            value : lugar.id,
            name : `${idx} ${lugar.nombre}`
        }

    } );
    //Agrega al principio del array
    choices.unshift({
        value : '0',
        name : '0.'.green + 'Cancelar.'
    });

    const preguntas = [

        {
            type : 'list',
            name : 'id',
            message : 'Seleccione el lugar:',
            choices 
        }
    ]
    
    const { id }  =  await inquirer.prompt(preguntas);

    return id;
}


const listadoCheckList = async(tareas = []) => {
    //El metodo map recorre los elementos del array y crea otro array hijo
    const choices = tareas.map( (tarea, index) => {

        const idx = `${index + 1}.`.green;
        return {
            //Value es lo que nos regresa
            value : tarea.id,
            name : `${idx} ${tarea.descripcion}`,
            checked : tarea.completado
        }

    } );


    const pregunta = [

        {
            type : 'checkbox',
            name : 'ids',
            message : 'Seleccione',
            choices 
        }
    ]
    
    const {ids}  =  await inquirer.prompt(pregunta);

    return ids;
}





module.exports = {
    menu,
    pausa,
    leerInput,
    listarLugares,
    confirmacion,
    listadoCheckList
}



