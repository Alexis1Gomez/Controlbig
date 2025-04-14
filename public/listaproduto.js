// Esperar que el DOM cargue
  document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3001/api/tonners")
      .then(response => response.json())
      .then(data => {
        const tabela = document.querySelector("[data-tabela]");
        data.forEach(item => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.tipo}</td>
            <td>${item.quantidade}</td>
            <td>${item.tipo}</td>
            <td>${item.quantidade}</td>
            <td><button>Editar</button></td>
          `;
          tabela.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Erro ao buscar os dados:", error);
      });
  });
