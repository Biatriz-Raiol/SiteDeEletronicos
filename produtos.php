<?php
session_start();
require 'conexao.php';

$stmt = $pdo->prepare("SELECT * FROM produtos ORDER BY id DESC");
$stmt->execute();
$produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Produtos - HawkTech</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header>
    <div class="container">
        <h1 class="logo">HawkTech - Produtos</h1>
        <nav>
            <ul class="menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="produtos.php">Produtos</a></li>
                <li><a href="carrinho.php">Carrinho</a></li>
            </ul>
        </nav>
    </div>
</header>

<main class="produtos">
    <h2>Produtos - Eletrônicos</h2>
    
    <div class="filtros">
        <button class="filtro-btn ativo" data-categoria="todos">Todos</button>
        <button class="filtro-btn" data-categoria="celulares">Celulares</button>
        <button class="filtro-btn" data-categoria="fones">Fones</button>
        <button class="filtro-btn" data-categoria="relógios">Relógios</button>
        <button class="filtro-btn" data-categoria="caixa de som">Caixa de Som</button>
        <button class="filtro-btn" data-categoria="TV">TV</button>
        <button class="filtro-btn" data-categoria="tablet">Tablet</button>
        <button class="filtro-btn" data-categoria="câmera">Câmera</button>
    </div>

    <div class="lista-produtos" id="listaProdutos">
        <?php if (count($produtos) == 0): ?>
            <p>Nenhum produto encontrado.</p>
        <?php else: ?>
            <?php foreach ($produtos as $p): ?>
                <div class="card" data-categoria="<?= htmlspecialchars($p['categoria']) ?>">
                    <img src="<?= htmlspecialchars($p['imagem']) ?>" alt="<?= htmlspecialchars($p['nome']) ?>" style="width: 100%; height: 180px; object-fit: cover;">
                    <h3><?= htmlspecialchars($p['nome']) ?></h3>
                    <p><?= htmlspecialchars($p['descricao']) ?></p>
                    <p class="preco">R$ <?= number_format($p['preco'], 2, ',', '.') ?></p>
                    <form method="post" action="carrinho.php?action=add">
                        <input type="hidden" name="produto_id" value="<?= $p['id'] ?>">
                        <input type="number" name="quantidade" value="1" min="1" style="width: 60px; padding: 5px; margin: 5px 0;">
                        <button type="submit" class="btn-add" style="background: #0077ff; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
                            Adicionar ao carrinho
                        </button>
                    </form>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</main>

<footer>
    <p>© 2025 HawkTech - Todos os direitos reservados.</p>
</footer>

<script>
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
</script>
</body>
</html>
