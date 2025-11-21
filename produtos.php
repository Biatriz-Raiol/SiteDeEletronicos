<?php
session_start();
require 'conexao.php';

$categoria = $_GET['categoria'] ?? 'todos';
$busca = $_GET['busca'] ?? '';

$sql = "SELECT * FROM produtos WHERE estoque > 0";
$params = [];

if ($categoria !== 'todos') {
    $sql .= " AND categoria = ?";
    $params[] = $categoria;
}

if (!empty($busca)) {
    $sql .= " AND (nome LIKE ? OR descricao LIKE ?)";
    $searchTerm = "%$busca%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

$sql .= " ORDER BY nome";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $produtos = $stmt->fetchAll();
} catch (PDOException $e) {
    error_log("Erro ao buscar produtos: " . $e->getMessage());
    $produtos = [];
}

try {
    $stmt = $pdo->query("SELECT DISTINCT categoria FROM produtos WHERE estoque > 0 ORDER BY categoria");
    $categorias = $stmt->fetchAll(PDO::FETCH_COLUMN);
} catch (PDOException $e) {
    $categorias = [];
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produtos - HawkTech</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'header.php'; ?>

    <main class="container">
        <h1>Nossos Produtos</h1>
        
        <div class="filtros-busca">
            <form method="get" class="search-form">
                <input type="text" name="busca" placeholder="Buscar produtos..." 
                       value="<?= htmlspecialchars($busca) ?>">
                <button type="submit" class="btn btn-secondary">Buscar</button>
                <?php if (!empty($busca)): ?>
                    <a href="produtos.php" class="btn btn-link">Limpar busca</a>
                <?php endif; ?>
            </form>
            
            <div class="filtros">
                <a href="produtos.php" class="filtro-btn <?= $categoria === 'todos' ? 'ativo' : '' ?>">
                    Todos
                </a>
                <?php foreach ($categorias as $cat): ?>
                    <a href="produtos.php?categoria=<?= urlencode($cat) ?>" 
                       class="filtro-btn <?= $categoria === $cat ? 'ativo' : '' ?>">
                        <?= htmlspecialchars(ucfirst($cat)) ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="produtos-info">
            <p>
                <?php if (!empty($busca)): ?>
                    Resultados para "<?= htmlspecialchars($busca) ?>"
                <?php endif; ?>
                - <?= count($produtos) ?> produto(s) encontrado(s)
            </p>
        </div>

        <?php if (empty($produtos)): ?>
            <div class="no-products">
                <p>Nenhum produto encontrado.</p>
                <a href="produtos.php" class="btn btn-primary">Ver todos os produtos</a>
            </div>
        <?php else: ?>
            <div class="lista-produtos">
                <?php foreach ($produtos as $produto): ?>
                    <div class="card" data-categoria="<?= htmlspecialchars($produto['categoria']) ?>">
                        <div class="card-image">
                            <img src="<?= htmlspecialchars($produto['imagem']) ?>" 
                                 alt="<?= htmlspecialchars($produto['nome']) ?>"
                                 onerror="this.src='assets/img/placeholder.jpg'">
                            <?php if ($produto['estoque'] < 5): ?>
                                <span class="estoque-baixo">Últimas unidades!</span>
                            <?php endif; ?>
                        </div>
                        <div class="card-content">
                            <h3><?= htmlspecialchars($produto['nome']) ?></h3>
                            <p class="descricao"><?= htmlspecialchars($produto['descricao']) ?></p>
                            <p class="preco">R$ <?= number_format($produto['preco'], 2, ',', '.') ?></p>
                            <p class="estoque">Estoque: <?= $produto['estoque'] ?></p>
                            <div class="card-actions">
                                <form method="post" action="carrinho.php?action=add" class="add-to-cart-form">
                                    <input type="hidden" name="produto_id" value="<?= $produto['id'] ?>">
                                    <div class="quantidade-container">
                                        <label>Qtd:</label>
                                        <input type="number" name="quantidade" value="1" 
                                               min="1" max="<?= $produto['estoque'] ?>">
                                    </div>
                                    <button type="submit" class="btn btn-primary">
                                        Adicionar ao Carrinho
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </main>

    <?php include 'footer.php'; ?>
    
    <script script.js"></script>
</body>
</html>
