const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '28608890',
  database: 'control_stock'
});

db.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

// Ruta para insertar datos
app.post('/api/guardar', (req, res) => {
  const { tipo, cantidad, modelo, estado, codigo } = req.body;

  const query = 'INSERT INTO tonners (tipo, cantidad, modelo, estado, codigo) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [tipo, cantidad, modelo, estado, codigo], (err, result) => {
    if (err) {
      res.status(500).send('Error al guardar');
    } else {
      res.status(200).send('Datos guardados con éxito');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});