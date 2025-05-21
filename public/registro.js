document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  const mensaje = document.getElementById('mensaje');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      mensaje.textContent = data.mensaje;

      // ✅ Redirección después de éxito
      if (data.mensaje === 'Usuario registrado con éxito') {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000); // Pequeña pausa opcional para mostrar el mensaje
      }
    } catch (error) {
      mensaje.textContent = 'Error en la comunicación con el servidor.';
      console.error(error);
    }
  });
});