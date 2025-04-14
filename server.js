const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); // << importante para rutas absolutas

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@100620@Alexis",
  database: "controltock",
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión:", err);
  } else {
    console.log("✅ Conectado a MySQL");
  }
});

// Ruta principal: enviar el HTML de inicio
// Ruta que devuelve los tonners
app.get("/api/tonners", (req, res) => {
  const sql = "SELECT * FROM tonners";
  db.query(sql, (erro, resultado) => {
    if (erro) {
      console.error("Erro ao buscar dados:", erro);
      res.status(500).send("Erro ao buscar dados");
      return;
    }
    res.json(resultado); // devuelve como JSON
  });
});

// rota principal 
// Ruta para servir HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "telainicial.html"));
});

// Ruta para insertar datos
app.post("/api/guardar", (req, res) => {
  const { tipo, cantidad, modelo, estado, codigo } = req.body;

  console.log("📦 Datos recibidos del formulario:", req.body);

  const query =
    "INSERT INTO tonners (tipo, cantidad, modelo, estado, codigo) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [tipo, cantidad, modelo, estado, codigo], (err, result) => {
    if (err) {
      console.error(
        "❌ Error al guardar en la BD:",
        err.sqlMessage || err.message
      );
      return res.status(500).send("❌ Error al guardar en la base de datos");
    }

    console.log("✅ Registro insertado correctamente");
    res.status(200).send("✅ Datos guardados con éxito");
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
