var mongoose =  require("mongoose");

//conecta la promesa
var Promise = require("bluebird");
Promise.promisifyAll(require("mongoose"));
mongoose.Promise = Promise;

//------------------------------//
//Abrir la conexión - es una promesa
var promiseAbrirConexion = new Promise (function(resolve, reject){
	var conn = mongoose.createConnection("localhost","senquiu",27017, function(err){
		if (err){
			conn.close();
			reject (err);
		}
		resolve (conn);
	});
}).then(function(conn){
	return promiseGuardarPromotor (conn);	
}).then(function(){
	return "Todo se completó con éxito";	
}).catch(function(err){
	console.log("Error en la conexión --> " + err.message);
});

//------------------------------//
//Guardar los datos del promotor - es una promesa
var promiseGuardarPromotor = function(conn){
	return new Promise (function(resolve, reject){
		var promotorSchema = new mongoose.Schema({
			primerNombre : String,
			primerApellido : String,
			permalink : String,
			correoElectronico : String
		});
		var Promotor = conn.model("Promotor", promotorSchema, "promotores");
		var promotor = new Promotor({
			//asigno los datos del promotor
			primerNombre : "James",
			primerApellido : "Rodríguez",
			permalink : "jamesrodriguez",
			correoElectronico : "james@example.com"
		});
		console.log(promotor.primerNombre + " " + promotor.primerApellido);

		//utiliza ls función save
		promotor.save(function(err){
			if (err){
				reject(err);
			}else{
				console.log("guardado! --> ", promotor);
				conn.close();
			}
		});

	});
};
promiseAbrirConexion;
