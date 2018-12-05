var express = require('express')
var bodyParser = require('body-parser')
var Connection = require('tedious').Connection

// Create connection to database
var config = {
    userName: 'sa', // update me
    password: '', // update me
    server: 'localhost',
    options: {
        database: 'SampleDB',
        encrypt: true
    }
  }
var connection = new Connection(config);
  
// Attempt to connect and execute queries if connection goes through

connection.on('connect', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected');
    }
});
  

var app = express()

//create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(express.static('public'))

app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + "/" + "index.html")
})

// Como es un POST, lo uso para lo que se usa el POST, crear o updatear algun recurso, en este caso la informacion que le estas mandando.
app.post('/process_post', urlencodedParser, (req, res) => {
  // Recibis la informacion en el body del request (req.body)
  const {first_name, last_name} = req.body; // uso destructuring, es un shorthand para no hacer req.body.first_name y req.body.last_name 
  // una vez que tengo los datos
  // hacer el insert en la base
  const request = new Request("INSERT INTO MyTable (first_name, last_name) VALUES (@first_name, @last_name)", (err, rowCount, rows) => {
    if (err) {
      // si hay un error mando lo logueo por consola y lo mando con el res.send (tmb podria hacer un throw)
      console.log("Se produjo un error tratando de hacer el request: ", err);
      return res.send(`error: ${err}`);
    };
    // si no hay error mando el resultado
    return res.send(rows);
  });

  // agrego los parametros que defini arriba en el request
  request.addParameter('first_name', TYPES.NVarChar, first_name);
  request.addParameter('last_name', TYPES.NVarChar, last_name);

  // Ejecuto la query
  connection.execSql(request);
})

var server =app.listen(8081, () => {
    var host = server.address().address
    var port = server.address().port

    console.log("ejemplo corriendo en http://%s:%s", host, port)
})
