const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const Empresa = require('./Empresa'); // Precisas de importar para a relação

const AtivoTecnologico = sequelize.define('ATIVOS_TECNOLOGICOS', {
    id_ativo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_empresa: {
        type: DataTypes.INTEGER,
        references: {
            model: Empresa,
            key: 'id_empresa'
        }
    },
    id_tipo_ativo: {
        type: DataTypes.INTEGER
        // Se criares o modelo TIPO_ATIVO, podes adicionar a referência aqui também
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    criticidade: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'ATIVOS_TECNOLOGICOS',
    timestamps: false
});

// Definir a relação: Uma Empresa tem muitos Ativos
Empresa.hasMany(AtivoTecnologico, { foreignKey: 'id_empresa' });
AtivoTecnologico.belongsTo(Empresa, { foreignKey: 'id_empresa' });

module.exports = AtivoTecnologico;