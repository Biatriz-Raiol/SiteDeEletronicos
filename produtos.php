<?php
require_once 'includes/header.php';
require_once 'database/conexao.php';

$stmt = $pdo->prepare("SELECT * FROM products ORDER BY id DESC");
$stmt->execute();
$produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<div class="container">
    <h1 class="titulo">Produtos</h1>

    <div class="grid-produtos">

        <?php if (count($produtos) == 0): ?>
            <p>Nenhum produto encontrado.</p>
        <?php else: ?>
            <?php foreach ($produtos as $p): ?>
                <div class="card-produto">
                    <img src="uploads/<?php echo $p['image']; ?>" alt="<?php echo $p['name']; ?>">

                    <h2><?php echo $p['name']; ?></h2>

                    <p class="preco">
                        R$ <?php echo number_format($p['price'], 2, ',', '.'); ?>
                    </p>

                    <a href="add_to_cart.php?id=<?php echo $p['id']; ?>" class="btn">
                        Adicionar ao carrinho
                    </a>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>

    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
