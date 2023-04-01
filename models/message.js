module.exports = (Sequelize, DataTypes) => {
    const messages = Sequelize.define("messages", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        to: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }, 
        fromOf: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    messages.associate = ((models) => {
        messages.belongsTo(models.users, {
            foreignKey: "from",
        }) 
    })

    return messages;
}