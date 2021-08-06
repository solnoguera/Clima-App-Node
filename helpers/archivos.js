

const guardarDB = (lugar = {}) => {
    fs.writeFileSync(archivo, JSON.stringify(lugar));
}

const leerDB = () => {
    if(fs.existsSync(archivo)){
        const info = fs.readFileSync(archivo, { encoding : 'utf-8'});
        const data = JSON.parse(info);
        return data;
    } else return null;
}

module.exports = {
    guardarDB,
    leerDB
}