module.exports = { 

		
    data_con: 
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "portfolio",
        typeCast: function (field, next) {     return field.string();
            
            return next();
        }
    }
}