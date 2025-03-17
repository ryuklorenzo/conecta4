document.addEventListener("DOMContentLoaded", () => {
    const scenes = document.querySelectorAll(".scene");
    const buttons = {
        siguienteIntro: document.getElementById("siguienteIntro"),
        siguienteJuego: document.getElementById("siguienteJuego"),
        anteriorJuego: document.getElementById("anteriorJuego"),
        anteriorFin: document.getElementById("anteriorFin"),
        reiniciar: document.getElementById("reiniciar")
    };

    buttons.siguienteIntro.addEventListener("click", () => {
        changeScene("intro", "juego");
    });

    buttons.siguienteJuego.addEventListener("click", () => {
        changeScene("juego", "fin");
    });

    buttons.anteriorJuego.addEventListener("click", () => {
        changeScene("juego", "intro");
    });

    buttons.anteriorFin.addEventListener("click", () => {
        changeScene("fin", "juego");
    });

    buttons.reiniciar.addEventListener("click", () => {
        changeScene("fin", "intro");
    });

    function changeScene(current, next) {
        document.getElementById(current).classList.remove("activo");
        document.getElementById(current).classList.add("desactivado");
        document.getElementById(next).classList.remove("desactivado");
        document.getElementById(next).classList.add("activo");
    }
});