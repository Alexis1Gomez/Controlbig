document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("loginForm");

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await res.json();

      if (data.acceso === true) {
        alert("Login correcto. Redirigiendo...");
        window.location.href = "/"; // redirige a tu página principal
      } else {
        alert("Error: " + data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error en login:", err);
      alert("Error al conectar con el servidor.");
    }
  });
});