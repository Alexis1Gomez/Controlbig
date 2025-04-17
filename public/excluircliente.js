document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3001/api/tonners")
      .then((response) => response.json())
      .then((data) => {
        const tabela = document.querySelector("[data-tabela]");
  
        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.tipo}</td>
            <td>${item.cantidad}</td>
            <td>
              <button class="botao-simples botao-simples--excluir" data-id="${item.id}">Excluir</button>
            </td>
          `;
          tabela.appendChild(row);
        });
  
        // Ahora agregar los eventos a los botones excluir
        document.querySelectorAll(".botao-simples--excluir").forEach((button) => {
          button.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            const confirmacao = confirm("¿Deseas eliminar este ítem?");
  
            if (!confirmacao) return;
  
            try {
              const response = await fetch(`http://localhost:3001/api/tonners/${id}`, {
                method: "DELETE",
              });
  
              if (response.ok) {
                e.target.closest("tr").remove(); // quitar de la tabla
              } else {
                alert("Error al eliminar");
              }
            } catch (error) {
              console.error("Error:", error);
            }
          });
        });
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados:", error);
      });
  });