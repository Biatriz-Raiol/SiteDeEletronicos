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
    btn.addEventListener("click", function () {
        
       
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
mostrarToast("Produto adicionado ao carrinho!");


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
            <strong>${item.nome}</strong> - R$ ${item.preco}
            <br>
            Quantidade: ${item.quantidade}
            <button onclick="removerItem(${index})">Remover</button>
            <hr>
        `;
        lista.appendChild(li);
    });

    totalSpan.textContent = total.toFixed(2);

    
    const checkoutBtn = document.querySelector(".checkout-container");

    if (carrinho.length === 0) {
        checkoutBtn.style.display = "none";
    } else {
        checkoutBtn.style.display = "flex"; 
    }
}


function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
}


window.onload = carregarCarrinho;

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    
    toast.classList.add("show");

   
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

    
    document.addEventListener("click", () => {
        toast.classList.remove("show");
    }, { once: true });
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const contador = document.getElementById("cart-count");

    if (contador) {
        contador.textContent = carrinho.length;
    }
}

window.onload = function() {
    atualizarContadorCarrinho();
    if (typeof carregarCarrinho === "function") {
        carregarCarrinho();
    }
}

if (cart.length === 0) {
    document.querySelector('.checkout-container').style.display = 'none';
}
ddocument.querySelector(".btn-checkout").addEventListener("click", () => {
    document.getElementById("checkout-modal").style.display = "flex";
});
document.getElementById("btn-calcular-frete").addEventListener("click", async () => {
    
    let cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido");
        return;
    }
    let dados = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r => r.json());
    if (dados.erro) {
        alert("CEP não encontrado!");
        return;
    }
    let carrinho = JSON.parse(localStorage.getItem("carrinho"));
    let subtotal = carrinho.reduce((s, p) => s + p.preco * p.quantidade, 0);

    let frete = 19.90;
    document.getElementById("resultado-frete").innerHTML =
        `Frete para ${dados.localidade} – R$ ${frete.toFixed(2)}
        <br>Total: R$ ${(subtotal + frete).toFixed(2)}`;
    mudarEtapa(1);
});
document.getElementById("pagamento").addEventListener("change", () => {
    let tipo = document.getElementById("pagamento").value;

    if (tipo === "cartao") {
        document.getElementById("parcelamento").style.display = "block";

        let carrinho = JSON.parse(localStorage.getItem("carrinho"));
        let total = carrinho.reduce((s, p) => s + p.preco * p.quantidade, 0);

        let select = document.getElementById("num-parcelas");
        select.innerHTML = "";

        for (let i = 1; i <= 12; i++) {
            let valorParcela = (total / i).toFixed(2);
            select.innerHTML += `<option value="${i}">${i}x de R$ ${valorParcela}</option>`;
        }

    } else {
        document.getElementById("parcelamento").style.display = "none";
    }
});
function mudarEtapa(numero) {
    let etapas = document.querySelectorAll(".etapa");
    etapas.forEach(e => e.classList.remove("active"));
    etapas[numero].classList.add("active");
}

document.getElementById("btn-finalizar-pagamento").addEventListener("click", () => {

    localStorage.removeItem("carrinho");
    atualizarContadorCarrinho();
    mudarEtapa(2);
});





