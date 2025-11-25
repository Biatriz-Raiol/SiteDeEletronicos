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
function abrirDadosEntrega() {
    document.getElementById("areaEndereco").style.display = "block";
}
function mascaraCEP() {
    let cep = document.getElementById("cep").value;
    cep = cep.replace(/\D/g, "");
    if (cep.length > 5) {
        cep = cep.replace(/(\d{5})(\d)/, "$1-$2");
    }
    document.getElementById("cep").value = cep;
}

function buscarCEP() {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido!");
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado!");
                return;
            }

            document.getElementById("Rua").value = data.logradouro;
            document.getElementById("Cidade").value = data.localidade;
            document.getElementById("UF").value = data.uf;
        })
        .catch(() => {
            alert("Erro ao consultar CEP!");
        });
}
function calcularFretePorCEP() {
    const uf = document.getElementById("uf").value.toUpperCase();
    let valorFrete = 0;

    switch (uf) {
        case "SP":
        case "RJ":
        case "MG":
        case "ES":
            valorFrete = 15;
            break;

        case "PR":
        case "SC":
        case "RS":
            valorFrete = 20;
            break;

        default:
            valorFrete = 25;
            break;
    }
    const totalCarrinho = 8500.00;
    const totalFinal = totalCarrinho + valorFrete;

    document.getElementById("frete").innerHTML = `Frete: R$ ${valorFrete.toFixed(2)}`;
    document.getElementById("totalFinal").innerHTML = `Total: R$ ${totalFinal.toFixed(2)}`;
}
function validarPedido() {
    const cep = document.getElementById("CEP").value.replace(/\D/g, "");
    const rua = document.getElementById("Rua").value;
    const cidade = document.getElementById("Cidade").value;
    const uf = document.getElementById("UF").value;

    if (cep.length !== 8) {
        alert("Digite um CEP válido.");
        return false;
    }

    if (!rua || !cidade || !uf) {
        alert("Preencha o endereço completo.");
        return false;
    }

    alert("Pedido finalizado com sucesso!");
    return true;
}
