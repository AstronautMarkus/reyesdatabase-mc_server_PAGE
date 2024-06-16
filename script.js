document.addEventListener("DOMContentLoaded", (event) => {
  verificarEstadoDelServidor();

  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("nav-active");
  });

  const verModsButton = document.getElementById("ver-mods");
  const modal = document.getElementById("modal");
  const closeButton = document.querySelector(".close-button");

  verModsButton.addEventListener("click", () => {
    modal.style.display = "block";
    cargarListaDeMods();
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});

function verificarEstadoDelServidor() {
  const ipDelServidor = "reyesdatabase.ddns.net";
  const elementoEstado = document.getElementById("status");
  const elementoServerStatus = document.getElementById("server-status");
  const elementoJugadores = document.getElementById("jugadores");
  const elementoMods = document.getElementById("mods");

  fetch(`https://api.mcsrvstat.us/2/${ipDelServidor}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.online) {
        elementoServerStatus.innerText = `Servidor en línea.`;
        elementoServerStatus.classList.add("online");
        elementoServerStatus.classList.remove("offline", "error");
        elementoEstado.innerText = `Información del Servidor`;

        // Mostrar jugadores
        if (data.players && data.players.online !== undefined) {
          elementoJugadores.innerText = `${data.players.online}/${data.players.max}`;
          elementoJugadores.classList.add("online");
          elementoJugadores.classList.remove("offline", "error");
        } else {
          elementoJugadores.innerText = "N/A";
          elementoJugadores.classList.add("offline");
          elementoJugadores.classList.remove("online", "error");
        }

        // Mostrar cantidad de mods
        if (data.mods && data.mods.names && data.mods.names.length > 0) {
          elementoMods.innerText = `${data.mods.names.length}`;
          elementoMods.classList.add("online");
          elementoMods.classList.remove("offline", "error");
        } else {
          elementoMods.innerText = "0";
          elementoMods.classList.add("offline");
          elementoMods.classList.remove("online", "error");
        }
      } else {
        elementoServerStatus.innerText = "El servidor está fuera de línea.";
        elementoServerStatus.classList.add("offline");
        elementoServerStatus.classList.remove("online", "error");
        elementoEstado.innerText = "Estado del Servidor";
        elementoJugadores.innerText = "";
        elementoMods.innerText = "";
      }
    })
    .catch((error) => {
      console.error("Error al verificar el estado del servidor:", error);
      elementoServerStatus.innerText =
        "Error al verificar el estado del servidor.";
      elementoServerStatus.classList.add("error");
      elementoServerStatus.classList.remove("online", "offline");
      elementoEstado.innerText = "Estado del Servidor";
      elementoJugadores.innerText = "";
      elementoMods.innerText = "";
    });
}

function cargarListaDeMods() {
  const ipDelServidor = "reyesdatabase.ddns.net";
  const modsTableBody = document.querySelector("#mods-table tbody");

  fetch(`https://api.mcsrvstat.us/2/${ipDelServidor}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.mods && data.mods.names) {
        modsTableBody.innerHTML = "";
        data.mods.names.forEach((mod) => {
          const row = document.createElement("tr");
          const cell = document.createElement("td");
          cell.textContent = mod;
          row.appendChild(cell);
          modsTableBody.appendChild(row);
        });
      } else {
        modsTableBody.innerHTML = "<tr><td>No se encontraron mods.</td></tr>";
      }
    })
    .catch((error) => {
      console.error("Error al cargar la lista de mods:", error);
      modsTableBody.innerHTML =
        "<tr><td>Error al cargar la lista de mods.</td></tr>";
    });
}
