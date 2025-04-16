document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");

  if (!form) {
    console.error("❌ Formulario no encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      tipo: document.getElementById("tipo").value,
      modelo: document.getElementById("modelo").value,
      codigo: document.getElementById("codigo").value,
      cantidad: document.getElementById("cantidad").value,
      estado: document.getElementById("estado").value,
    };

    try {
      const res = await fetch("http://localhost:3001/api/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.text();
      // alert(result || "Datos guardados con éxito");
      form.reset();
      window.location.href = "/telas/cadastroexitoso.html";
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al guardar los datos.");
    }
  });
});
