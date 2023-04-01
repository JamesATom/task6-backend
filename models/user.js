module.exports = (Sequelize, DataTypes) => {
    const users = Sequelize.define("users", {
        name: {
           type: DataTypes.STRING,
           allowNull: false, 
        }
    },
    {
        timestamps: false
    })  

    users.associate = ((models) => {
        users.hasMany(models.messages, {
            foreignKey: "from",
        }) 
    })

    return users;
}