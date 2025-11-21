<?php
session_start();
require 'conexao.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM produtos ORDER BY RAND() LIMIT 8");
    $stmt->execute();
    $produtos_destaque = $stmt->fetchAll();
} catch (PDOException $e) {
    error_log("Erro ao buscar produtos: " . $e->getMessage());
    $produtos_destaque = [];
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HawkTech - Eletrônicos</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <?php include 'header.php'; ?>

    <main class="container">
        <section class="hero">
            <div class="hero-content">
                <h1>Bem-vindo à HawkTech</h1>
                <p>Os melhores eletrônicos com preços incríveis</p>
                <a href="produtos.php" class="btn btn-primary">Ver Produtos</a>
            </div>
        </section>

        <section class="produtos-destaque">
            <h2>Produtos em Destaque</h2>
            
            <?php if (empty($produtos_destaque)): ?>
                <p class="no-products">Nenhum produto encontrado.</p>
            <?php else: ?>
                <div class="lista-produtos">
                    <?php foreach ($produtos_destaque as $produto): ?>
                        <div class="card" data-categoria="<?= htmlspecialchars($produto['categoria']) ?>">
                            <div class="card-image">
                                <?= htmlspecialchars($produto['imagem']) ?>" 
                                     alt="<?= htmlspecialchars($produto['nome']) ?>"
                                     img/placeholder.jpg'">
                            </div>
                            <div class="card-content">
                                <h3><?= htmlspecialchars($produto['nome']) ?></h3>
                                <p class="descricao"><?= htmlspecialchars($produto['descricao']) ?></p>
                                <p class="preco">R$ <?= number_format($produto['preco'], 2, ',', '.') ?></p>
                                <div class="card-actions">
                                    <form method="post" action="carrinho.php?action=add" class="add-to-cart-form">
                                        <input type="hidden" name="produto_id" value="<?= $produto['id'] ?>">
                                        <input type="number" name="quantidade" value="1" min="1" max="<?= $produto['estoque'] ?>">
                                        <button type="submit" class="btn btn-primary btn-sm">
                                            Adicionar ao Carrinho
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </section>
    </main>

    <?php include 'footer.php'; ?>
    
    <script = "script.js"></script>
</body>
</html>
