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

        // Verificar se produto já existe no carrinho
        const produtoExistente = carrinho.find(item => item.nome === produto.nome);
        if (produtoExistente) {
            produtoExistente.quantidade += 1;
        } else {
            carrinho.push(produto);
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));
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

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="carrinho-vazio">Carrinho vazio</p>';
        totalSpan.textContent = "0.00";
        document.querySelector(".checkout-container").style.display = "none";
        return;
    }

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;

        const li = document.createElement("li");
        li.className = "produto";
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
    document.querySelector(".checkout-container").style.display = "flex";
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarContadorCarrinho();
}

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const contador = document.getElementById("cart-count");

    if (contador) {
        contador.textContent = carrinho.length;
    }
}

// Checkout functions
document.querySelector(".btn-checkout")?.addEventListener("click", () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    if (carrinho.length === 0) {
        alert("Carrinho vazio!");
        return;
    }
    
    // Criar modal de checkout dinamicamente
    criarModalCheckout();
});

function criarModalCheckout() {
    const modalHTML = `
    <div id="checkout-modal" class="modal">
        <div class="modal-content">
            <h2>Finalizar Compra</h2>
            
            <div class="etapa active" id="etapa-0">
                <h3>Dados de Entrega</h3>
                <input type="text" id="nome-cliente" placeholder="Nome completo" required>
                <input type="email" id="email-cliente" placeholder="E-mail" required>
                <input type="text" id="cep" placeholder="CEP" required>
                <input type="text" id="endereco" placeholder="Endereço" required>
                <button onclick="calcularFrete()">Calcular Frete</button>
                <div id="resultado-frete"></div>
            </div>
            
            <div class="etapa" id="etapa-1">
                <h3>Pagamento</h3>
                <select id="pagamento">
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto</option>
                </select>
                <div id="dados-cartao" style="display: none;">
                    <input type="text" placeholder="Número do cartão">
                    <input type="text" placeholder="Nome no cartão">
                    <input type="text" placeholder="Validade (MM/AA)">
                    <input type="text" placeholder="CVV">
                </div>
                <button onclick="finalizarPedido()">Finalizar Pedido</button>
            </div>
            
            <div class="etapa" id="etapa-2">
                <h3>Pedido Finalizado!</h3>
                <p>Obrigado pela compra!</p>
                <button onclick="fecharModal()">Fechar</button>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById("checkout-modal").style.display = "flex";
}

function calcularFrete() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho"));
    const subtotal = carrinho.reduce((s, p) => s + p.preco * p.quantidade, 0);
    const frete = 19.90;
    
    document.getElementById("resultado-frete").innerHTML = 
        `Frete: R$ ${frete.toFixed(2)}<br>Total: R$ ${(subtotal + frete).toFixed(2)}`;
    
    // Mudar para próxima etapa
    document.querySelectorAll(".etapa").forEach(e => e.classList.remove("active"));
    document.getElementById("etapa-1").classList.add("active");
}

function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho"));
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const nomeCliente = document.getElementById("nome-cliente").value || "Cliente";
    const emailCliente = document.getElementById("email-cliente").value || "cliente@email.com";
    
    const dadosPedido = {
        cliente_nome: nomeCliente,
        cliente_email: emailCliente,
        total: total,
        itens: carrinho
    };
    
    fetch('finalizar_pedido.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosPedido)
    })
    .then(response => response.json())
    .then(resultado => {
        if (resultado.success) {
            localStorage.removeItem('carrinho');
            atualizarContadorCarrinho();
            
            // Mostrar etapa de confirmação
            document.querySelectorAll(".etapa").forEach(e => e.classList.remove("active"));
            document.getElementById("etapa-2").classList.add("active");
            
            setTimeout(() => {
                fecharModal();
                window.location.href = 'index.html';
            }, 3000);
        } else {
            alert('Erro ao finalizar pedido: ' + resultado.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    });
}

function fecharModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) {
        modal.remove();
    }
}

// Formulário de Cadastro
document.getElementById('form-cadastro')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('cadastrar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const mensagem = document.getElementById('mensagem');
        if (mensagem) {
            mensagem.textContent = data.message;
            mensagem.style.color = data.success ? 'green' : 'red';
            
            if (data.success) {
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        const mensagem = document.getElementById('mensagem');
        if (mensagem) {
            mensagem.textContent = 'Erro no cadastro!';
            mensagem.style.color = 'red';
        }
    });
});

// Formulário de Login
document.getElementById('form-login')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('login.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const mensagem = document.getElementById('mensagem-login');
        if (mensagem) {
            mensagem.textContent = data.message;
            mensagem.style.color = data.success ? 'green' : 'red';
            
            if (data.success) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        const mensagem = document.getElementById('mensagem-login');
        if (mensagem) {
            mensagem.textContent = 'Erro no login!';
            mensagem.style.color = 'red';
        }
    });
});

// Inicialização
window.onload = function() {
    atualizarContadorCarrinho();
    if (typeof carregarCarrinho === "function") {
        carregarCarrinho();
    }
};
// ========== CHECKOUT E CEP ==========

function criarModalCheckout() {
    // Remover modal existente se houver
    const modalExistente = document.getElementById("checkout-modal");
    if (modalExistente) {
        modalExistente.remove();
    }

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);

    const modalHTML = `
    <div id="checkout-modal" class="modal">
        <div class="modal-content">
            <span class="fechar-modal" onclick="fecharModal()" style="float: right; cursor: pointer; font-size: 20px;">&times;</span>
            
            <h2>Finalizar Compra</h2>
            
            <!-- Etapa 1: Dados de Entrega -->
            <div class="etapa active" id="etapa-1">
                <h3>📦 Dados de Entrega</h3>
                
                <div class="input-group">
                    <input type="text" id="nome-cliente" placeholder="Nome completo *" required style="width: 100%; padding: 10px; margin: 5px 0;">
                </div>
                
                <div class="input-group">
                    <input type="email" id="email-cliente" placeholder="E-mail *" required style="width: 100%; padding: 10px; margin: 5px 0;">
                </div>
                
                <div class="input-group" style="display: flex; gap: 10px;">
                    <input type="text" id="cep" placeholder="CEP *" maxlength="9" 
                           oninput="formatarCEP(this)" style="flex: 1; padding: 10px;">
                    <button type="button" onclick="buscarCEP()" style="padding: 10px 15px;">Buscar CEP</button>
                </div>
                
                <div class="input-group">
                    <input type="text" id="endereco" placeholder="Endereço *" readonly style="width: 100%; padding: 10px; margin: 5px 0; background: #f5f5f5;">
                </div>
                
                <div class="input-group">
                    <input type="text" id="cidade" placeholder="Cidade *" readonly style="width: 100%; padding: 10px; margin: 5px 0; background: #f5f5f5;">
                </div>
                
                <div class="input-group">
                    <input type="text" id="bairro" placeholder="Bairro *" readonly style="width: 100%; padding: 10px; margin: 5px 0; background: #f5f5f5;">
                </div>
                
                <div id="info-frete" style="margin: 15px 0; padding: 10px; background: #e8f5e8; border-radius: 5px; display: none;">
                    <strong>💰 Informações de Frete:</strong>
                    <div id="resultado-frete"></div>
                </div>
                
                <button type="button" onclick="avancarParaPagamento()" 
                        style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Continuar para Pagamento
                </button>
            </div>
            
            <!-- Etapa 2: Pagamento -->
            <div class="etapa" id="etapa-2">
                <h3>💳 Pagamento</h3>
                
                <div class="input-group">
                    <select id="metodo-pagamento" onchange="mostrarCamposPagamento()" style="width: 100%; padding: 10px; margin: 5px 0;">
                        <option value="">Selecione o método de pagamento</option>
                        <option value="cartao">Cartão de Crédito</option>
                        <option value="pix">PIX</option>
                        <option value="boleto">Boleto Bancário</option>
                    </select>
                </div>
                
                <!-- Campos do Cartão -->
                <div id="campos-cartao" style="display: none;">
                    <div class="input-group">
                        <input type="text" id="numero-cartao" placeholder="Número do cartão" maxlength="19" oninput="formatarCartao(this)" style="width: 100%; padding: 10px; margin: 5px 0;">
                    </div>
                    
                    <div class="input-group">
                        <input type="text" id="nome-cartao" placeholder="Nome no cartão" style="width: 100%; padding: 10px; margin: 5px 0;">
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="validade-cartao" placeholder="MM/AA" maxlength="5" oninput="formatarValidade(this)" style="flex: 1; padding: 10px;">
                        <input type="text" id="cvv-cartao" placeholder="CVV" maxlength="4" style="flex: 1; padding: 10px;">
                    </div>
                    
                    <div class="input-group">
                        <select id="parcelas" style="width: 100%; padding: 10px; margin: 5px 0;">
                            <option value="">Número de parcelas</option>
                        </select>
                    </div>
                </div>
                
                <!-- Resumo do Pedido -->
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h4>📋 Resumo do Pedido</h4>
                    <div id="resumo-pedido"></div>
                </div>
                
                <button type="button" onclick="finalizarPedido()" 
                        style="width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Finalizar Pedido
                </button>
                
                <button type="button" onclick="voltarParaEntrega()" 
                        style="width: 100%; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    Voltar
                </button>
            </div>
            
            <!-- Etapa 3: Confirmação -->
            <div class="etapa" id="etapa-3">
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #28a745;">✅ Pedido Finalizado com Sucesso!</h3>
                    <p>Obrigado pela sua compra!</p>
                    <p>Você receberá um e-mail com os detalhes do pedido.</p>
                    <div id="numero-pedido" style="font-weight: bold; margin: 15px 0;"></div>
                    <button onclick="fecharModalFinal()" 
                            style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Continuar Comprando
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById("checkout-modal").style.display = "flex";
    
    // Atualizar resumo
    atualizarResumoPedido();
}

// Formatar CEP
function formatarCEP(input) {
    let cep = input.value.replace(/\D/g, '');
    
    if (cep.length > 5) {
        cep = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }
    
    input.value = cep;
}

// Buscar CEP na API
async function buscarCEP() {
    const cepInput = document.getElementById("cep");
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert("Por favor, digite um CEP válido com 8 dígitos.");
        return;
    }
    
    try {
        // Mostrar loading
        cepInput.disabled = true;
        
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        
        if (dados.erro) {
            alert("CEP não encontrado! Verifique o número digitado.");
            return;
        }
        
        // Preencher campos automaticamente
        document.getElementById("endereco").value = `${dados.logradouro}`;
        document.getElementById("cidade").value = dados.localidade;
        document.getElementById("bairro").value = dados.bairro;
        
        // Calcular frete automaticamente
        await calcularFrete(dados.localidade);
        
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar CEP. Tente novamente.");
    } finally {
        cepInput.disabled = false;
    }
}

// Calcular frete
async function calcularFrete(cidade) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    // Simulação de cálculo de frete (valores fictícios)
    let frete = 0;
    
    if (cidade.toLowerCase().includes("são paulo") || cidade.toLowerCase().includes("sao paulo")) {
        frete = 15.90; // Frete mais barato para SP
    } else if (cidade.toLowerCase().includes("rio de janeiro")) {
        frete = 22.90; // Frete para RJ
    } else {
        frete = 29.90; // Frete para outras cidades
    }
    
    // Frete grátis para compras acima de R$ 300
    if (subtotal > 300) {
        frete = 0;
    }
    
    const totalComFrete = subtotal + frete;
    
    // Mostrar informações do frete
    const infoFrete = document.getElementById("info-frete");
    const resultadoFrete = document.getElementById("resultado-frete");
    
    resultadoFrete.innerHTML = `
        <div>📮 Cidade: ${cidade}</div>
        <div>🚚 Frete: R$ ${frete.toFixed(2)} ${frete === 0 ? '<strong>(FRETE GRÁTIS)</strong>' : ''}</div>
        <div>🛒 Subtotal: R$ ${subtotal.toFixed(2)}</div>
        <div style="font-weight: bold; font-size: 1.1em;">💰 Total: R$ ${totalComFrete.toFixed(2)}</div>
    `;
    
    infoFrete.style.display = "block";
    
    // Salvar informações do frete para usar depois
    window.freteInfo = {
        valor: frete,
        cidade: cidade,
        total: totalComFrete
    };
}

// Avançar para pagamento
function avancarParaPagamento() {
    const nome = document.getElementById("nome-cliente").value;
    const email = document.getElementById("email-cliente").value;
    const cep = document.getElementById("cep").value;
    
    if (!nome || !email || !cep) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    
    if (!window.freteInfo) {
        alert("Por favor, calcule o frete primeiro.");
        return;
    }
    
    mudarEtapa(2);
}

// Voltar para entrega
function voltarParaEntrega() {
    mudarEtapa(1);
}

// Mudar entre etapas
function mudarEtapa(numero) {
    document.querySelectorAll(".etapa").forEach(etapa => {
        etapa.classList.remove("active");
    });
    document.getElementById(`etapa-${numero}`).classList.add("active");
}

// Mostrar campos específicos do pagamento
function mostrarCamposPagamento() {
    const metodo = document.getElementById("metodo-pagamento").value;
    const camposCartao = document.getElementById("campos-cartao");
    
    if (metodo === "cartao") {
        camposCartao.style.display = "block";
        calcularParcelas();
    } else {
        camposCartao.style.display = "none";
    }
}

// Calcular parcelas do cartão
function calcularParcelas() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const frete = window.freteInfo?.valor || 0;
    const total = subtotal + frete;
    
    const selectParcelas = document.getElementById("parcelas");
    selectParcelas.innerHTML = '<option value="">Número de parcelas</option>';
    
    // Oferecer até 12x sem juros para compras acima de R$ 100
    const maxParcelas = total > 100 ? 12 : 6;
    
    for (let i = 1; i <= maxParcelas; i++) {
        const valorParcela = total / i;
        const juros = i > 6 ? ` (com juros)` : ` (sem juros)`;
        selectParcelas.innerHTML += `<option value="${i}">${i}x de R$ ${valorParcela.toFixed(2)}${i > 6 ? juros : ''}</option>`;
    }
}

// Atualizar resumo do pedido
function atualizarResumoPedido() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    const frete = window.freteInfo?.valor || 0;
    const total = subtotal + frete;
    
    const resumo = document.getElementById("resumo-pedido");
    resumo.innerHTML = `
        <div>Itens: R$ ${subtotal.toFixed(2)}</div>
        <div>Frete: R$ ${frete.toFixed(2)}</div>
        <div style="font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">
            Total: R$ ${total.toFixed(2)}
        </div>
    `;
}

// Formatar número do cartão
function formatarCartao(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = valor.substring(0, 19);
}

// Formatar validade do cartão
function formatarValidade(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length >= 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }
    input.value = valor;
}

// Finalizar pedido
async function finalizarPedido() {
    const metodoPagamento = document.getElementById("metodo-pagamento").value;
    
    if (!metodoPagamento) {
        alert("Por favor, selecione um método de pagamento.");
        return;
    }
    
    if (metodoPagamento === "cartao") {
        const numeroCartao = document.getElementById("numero-cartao").value;
        const nomeCartao = document.getElementById("nome-cartao").value;
        const validade = document.getElementById("validade-cartao").value;
        const cvv = document.getElementById("cvv-cartao").value;
        const parcelas = document.getElementById("parcelas").value;
        
        if (!numeroCartao || !nomeCartao || !validade || !cvv || !parcelas) {
            alert("Por favor, preencha todos os dados do cartão.");
            return;
        }
    }
    
    // Coletar dados do pedido
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const nomeCliente = document.getElementById("nome-cliente").value;
    const emailCliente = document.getElementById("email-cliente").value;
    const total = window.freteInfo?.total || 0;
    
    const dadosPedido = {
        cliente_nome: nomeCliente,
        cliente_email: emailCliente,
        total: total,
        itens: carrinho
    };
    
    try {
        // Enviar para o backend
        const response = await fetch('finalizar_pedido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosPedido)
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            // Mostrar confirmação
            document.getElementById("numero-pedido").textContent = `Nº do Pedido: ${resultado.pedido_id}`;
            mudarEtapa(3);
            
            // Limpar carrinho
            localStorage.removeItem('carrinho');
            carrinho.length = 0;
            atualizarContadorCarrinho();
            
        } else {
            alert('Erro ao finalizar pedido: ' + resultado.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        // Simular sucesso se o backend não estiver disponível
        document.getElementById("numero-pedido").textContent = `Nº do Pedido: SIM-${Date.now()}`;
        mudarEtapa(3);
        localStorage.removeItem('carrinho');
        atualizarContadorCarrinho();
    }
}

function fecharModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) {
        modal.remove();
    }
}

function fecharModalFinal() {
    fecharModal();
    window.location.href = 'index.html';
}

// ========== INICIALIZAÇÃO DO CHECKOUT ==========
document.addEventListener("DOMContentLoaded", function() {
    // Botão de checkout na página do carrinho
    const checkoutBtn = document.querySelector(".btn-checkout");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
            if (carrinho.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }
            criarModalCheckout();
        });
    }
});