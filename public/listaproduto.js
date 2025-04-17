document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3001/api/tonners")
    .then((response) => response.json())
    .then((data) => {
      const tabela = document.querySelector("[data-tabela]");
      data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="td" data-tf>${item.tipo}</td>
          <td>${item.cantidad}</td>
          <td>${item.tipo}</td>
          <td>${item.cantidad}</td>
          <td>
            <ul class="tabela__botoes-controle">
              <li>
                <a href="../telas/edita_cliente.html?id=${item.id}" class="botao-simples botao-simples--editar">Editar</a>
              </li>
              <li>
                <button class="botao-simples botao-simples--excluir" type="button" data-id="${item.id}">Excluir</button>
              </li>
            </ul>
          </td>
        `;
        tabela.appendChild(row);
      });

      // Ahora que los botones existen, les agregamos los eventos
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
