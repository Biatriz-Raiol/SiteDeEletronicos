const botoesFiltro = document.querySelectorAll(".filtro-btn");
const cards = document.querySelectorAll(".card");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
    botoesFiltro.forEach(btn => btn.classList.remove("ativo"));
    botao.classList.add("ativo");

    const categoria = botao.getAttribute("data-categoria");

    cards.forEach(card => {
        if (categoria === "todos" || card.getAttribute("data-categoria") === categoria) {
        card.style.display = "flex";
    } else {
        card.style.display = "none";
    }
    });
});
});
