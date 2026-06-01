const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database'); // Ajusta o caminho conforme o teu ficheiro

const Empresa = sequelize.define('EMPRESA', {
    id_empresa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nif: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'EMPRESA',
    timestamps: false
});

module.exports = Empresa;