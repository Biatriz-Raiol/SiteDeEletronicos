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

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const botoes = document.querySelectorAll(".btn-add");

botoes.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        
        const card = this.closest(".card");
        const nome = card.querySelector("h3").textContent;
        const preco = card.querySelector(".preco").textContent.replace("R$", "").replace(".", "").replace(",", ".");
        const imagem = card.querySelector("img").getAttribute("src");

        const produto = {
            nome: nome,
            preco: Number(preco),
            imagem: imagem,
            quantidade: 1
        };

        carrinho.push(produto);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        
        mostrarToast("Produto adicionado ao carrinho!");
        atualizarContadorCarrinho();
    });
});

function carregarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const totalSpan = document.getElementById("total");

    if (!lista || !totalSpan) return;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    lista.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;

        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${item.imagem}" width="80">
            <strong>${item.nome}</strong> - R$ ${item.preco.toFixed(2)}
            <br>
            Quantidade: ${item.quantidade}
            <button onclick="removerItem(${index})">Remover</button>
            <hr>
        `;
        lista.appendChild(li);
    });

    totalSpan.textContent = total.toFixed(2);
    
    const checkoutBtn = document.querySelector(".checkout-container");
    if (checkoutBtn) {
        checkoutBtn.style.display = carrinho.length === 0 ? "none" : "flex";
    }
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarContadorCarrinho();
}

function mostrarToast(mensagem) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = mensagem;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 2500);
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const contador = document.getElementById("cart-count");

    if (contador) {
        contador.textContent = carrinho.length;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    const proximoBtn = document.getElementById("btn-proximo-pagamento");
    if (proximoBtn) {
        proximoBtn.addEventListener("click", () => {
            mudarEtapa(1);
        });
    }
    const modal = document.getElementById("checkout-modal");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});

    const calcularFreteBtn = document.getElementById("btn-calcular-frete");
    if (calcularFreteBtn) {
        calcularFreteBtn.addEventListener("click", async () => {
            let cep = document.getElementById("cep-input").value.replace(/\D/g, "");

            if (cep.length !== 8) {
                alert("CEP inválido");
                return;
            }
            
            try {
                let dados = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r => r.json());
                if (dados.erro) {
                    alert("CEP não encontrado!");
                    return;
                }
                
                let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
                let subtotal = carrinho.reduce((s, p) => s + p.preco * p.quantidade, 0);
                let frete = 19.90;
                
                document.getElementById("resultado-frete").innerHTML =
                    `Frete para ${dados.localidade} – R$ ${frete.toFixed(2)}<br>Total: R$ ${(subtotal + frete).toFixed(2)}`;
                    
            } catch (error) {
                alert("Erro ao calcular frete");
            }
        });
    }

    const pagamentoSelect = document.getElementById("pagamento");
    if (pagamentoSelect) {
        pagamentoSelect.addEventListener("change", () => {
            let tipo = pagamentoSelect.value;
            let parcelamento = document.getElementById("parcelamento");

            if (tipo === "cartao") {
                parcelamento.style.display = "block";
                let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
                let total = carrinho.reduce((s, p) => s + p.preco * p.quantidade, 0);
                let select = document.getElementById("num-parcelas");
                select.innerHTML = "";

                for (let i = 1; i <= 12; i++) {
                    let valorParcela = (total / i).toFixed(2);
                    select.innerHTML += `<option value="${i}">${i}x de R$ ${valorParcela}</option>`;
                }
            } else {
                parcelamento.style.display = "none";
            }
        });
    }

    const finalizarBtn = document.getElementById("btn-finalizar-pagamento");
    if (finalizarBtn) {
        finalizarBtn.addEventListener("click", () => {
            localStorage.removeItem("carrinho");
            atualizarContadorCarrinho();
            mudarEtapa(2);
            
            if (typeof carregarCarrinho === "function") {
                carregarCarrinho();
            }
        });
    }
    atualizarContadorCarrinho();
    if (typeof carregarCarrinho === "function") {
        carregarCarrinho();
    }
});

function mudarEtapa(numero) {
    let etapas = document.querySelectorAll(".etapa");
    etapas.forEach(e => e.classList.remove("active"));
    if (etapas[numero]) {
        etapas[numero].classList.add("active");
    }
}

