const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken'); // Añade esta línea al inicio con los demás requires
const cors = require("cors");
const path = require("path"); // << importante para rutas absolutas
const bcrypt = require('bcrypt');  // biblioteca para encriptars as senhas 


const app = express();
const port = 3001;
process.env.JWT_SECRET = 'tuSuperSecreto123'; // Cambia esto por un secreto fuerte

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

// ruta para registro del usuario 

app.post('/api/registrar', (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error al registrar:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }
    res.json({ mensaje: 'Usuario registrado con éxito' });
  });
});


// esta es la ruta de login para acesso a la pagina 
app.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;
  console.log("Datos recibidos:", { usuario, senha });

  // Validación básica
  if (!usuario || !senha) {
    return res.status(400).json({
      success: false,
      message: "Usuario y contraseña requeridos"
    });
  }

  const sql = 'SELECT * FROM usuarios WHERE usuario = ?';
  db.query(sql, [usuario], async (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err);
      return res.status(500).json({
        success: false,
        message: 'Error de servidor'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = results[0];
    console.log("Datos del usuario:", {
      id: user.id,
      usuario: user.usuario,
      senha: user.senha
    });

    // Comparación directa (sin hash temporal)
    if (senha !== user.senha) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    // Generación del token
    try {
      // Asegúrate de que SECRET esté definido
      if (!process.env.JWT_SECRET) {
        throw new Error("Falta la clave secreta JWT");
      }

      // Verifica que tengamos los datos necesarios
      if (!user.id || !user.usuario) {
        throw new Error("Datos de usuario incompletos");
      }

      const token = jwt.sign(
        {
          id: user.id,
          usuario: user.usuario
        },
        process.env.JWT_SECRET || 'fallbackSecret', // Usa una variable de entorno
        { expiresIn: '1h' }
      );

      console.log("Token generado correctamente");

      return res.json({
        success: true,
        acceso: true, // 👈 ESTA PROPIEDAD ES LA QUE TU FRONTEND BUSCA
        token,
        user: {
          id: user.id,
          username: user.usuario
        }
      });

    } catch (error) {
      console.error("Error detallado al generar token:", error);
      return res.status(500).json({
        success: false,
        message: 'Error al generar token',
        error: error.message // Enviamos el mensaje de error detallado
      });
    }
  });
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
  res.sendFile(path.join(__dirname, "public", "telas", "telainicial.html"));
});

// rota de cadastro de produtos
app.get("/telacadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "telas", "telacadastro.html"));
});

// rota de tela de cadastro con suceso
app.get("/suceso", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "telas", "cadastroexitoso.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "telas", "telaLogin.html"));
});

app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "telas", "registro.html"));
});





app.delete('/api/tonners/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM tonners WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir:', err);
      return res.status(500).json({ error: 'Erro ao excluir' });
    }
    res.status(200).json({ message: 'Item excluido com sucesso' });
  });
});


// Ruta para insertar datos
app.post("/api/guardar", (req, res) => {
  const { tipo, quantidade, modelo, estado, codigo } = req.body;

  console.log("📦 Datos recibidos del formulario:", req.body);

  const query =
    "INSERT INTO tonners (tipo, quantidade, modelo, estado, codigo) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [tipo, quantidade, modelo, estado, codigo], (err, result) => {
    if (err) {
      console.error(
        "❌ Error al guardar en la BD:",
        err.sqlMessage || err.message
      );
      return res.status(500).send("❌ Error al guardar en la base de datos");
    }

    // console.log("✅ Registro insertado correctamente");
    res.redirect("/suceso"); // Redirección aquí
  });

});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
