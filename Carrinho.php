<?php
session_start();
require 'conexao.php';

if (!isset($_SESSION['cart'])) $_SESSION['cart'] = [];

$action = $_GET['action'] ?? null;

if ($action === 'add' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $produto_id = (int)$_POST['produto_id'];
    $quantidade = max(1, (int)$_POST['quantidade']);

    $stmt = $pdo->prepare('SELECT id, nome, preco FROM produtos WHERE id = ?');
    $stmt->execute([$produto_id]);
    $p = $stmt->fetch();

    if ($p) {
        $found = false;
        foreach ($_SESSION['cart'] as &$item) {
            if ($item['produto_id'] == $produto_id) {
                $item['quantidade'] += $quantidade;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $_SESSION['cart'][] = [
                'produto_id' => $p['id'],
                'nome' => $p['nome'],
                'preco' => $p['preco'],
                'quantidade' => $quantidade
            ];
        }
    }
    header('Location: produtos.php');
    exit;
}

if ($action === 'remove') {
    $pid = (int)($_GET['pid'] ?? 0);
    foreach ($_SESSION['cart'] as $k => $item) {
        if ($item['produto_id'] == $pid) {
            unset($_SESSION['cart'][$k]);
        }
    }
    $_SESSION['cart'] = array_values($_SESSION['cart']);
    header('Location: carrinho.php');
    exit;
}

if ($action === 'clear') {
    $_SESSION['cart'] = [];
    header('Location: carrinho.php');
    exit;
}

if ($action === 'save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    if (empty($nome) || empty($email) || empty($_SESSION['cart'])) {
        $error = 'Preencha nome, email e adicione produtos ao carrinho.';
    } else {
        $total = 0;
        foreach ($_SESSION['cart'] as $item) $total += $item['preco'] * $item['quantidade'];

        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO pedidos (cliente_nome, cliente_email, total) VALUES (?, ?, ?)');
        $stmt->execute([$nome, $email, $total]);
        $pedido_id = $pdo->lastInsertId();

        $stmtItem = $pdo->prepare('INSERT INTO pedido_items (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)');
        foreach ($_SESSION['cart'] as $item) {
            $stmtItem->execute([$pedido_id, $item['produto_id'], $item['quantidade'], $item['preco']]);
        }
        $pdo->commit();
        $_SESSION['cart'] = [];
        $success = 'Pedido salvo com sucesso! ID do pedido: ' . $pedido_id;
    }
}

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Carrinho - HawkTech</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header>
    <div class="container">
        <h1 class="logo">HawkTech - Carrinho</h1>
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
    <h2>Seu Carrinho</h2>
    <?php if (!empty($error)): ?>
        <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>
    <?php if (!empty($success)): ?>
        <div class="success"><?= htmlspecialchars($success) ?></div>
    <?php endif; ?>

    <?php if (empty($_SESSION['cart'])): ?>
        <p>Seu carrinho está vazio.</p>
    <?php else: ?>
        <table border="1" cellpadding="8" cellspacing="0">
            <tr><th>Produto</th><th>Preço unit.</th><th>Qtd</th><th>Subtotal</th><th>Ação</th></tr>
            <?php $total=0; foreach ($_SESSION['cart'] as $item): $subtotal = $item['preco'] * $item['quantidade']; $total += $subtotal; ?>
                <tr>
                    <td><?= htmlspecialchars($item['nome']) ?></td>
                    <td>R$ <?= number_format($item['preco'],2,',','.') ?></td>
                    <td><?= $item['quantidade'] ?></td>
                    <td>R$ <?= number_format($subtotal,2,',','.') ?></td>
                    <td><a href="carrinho.php?action=remove&pid=<?= $item['produto_id'] ?>">Remover</a></td>
                </tr>
            <?php endforeach; ?>
            <tr><td colspan="3"><strong>Total</strong></td><td colspan="2"><strong>R$ <?= number_format($total,2,',','.') ?></strong></td></tr>
        </table>

        <h3>Finalizar pedido</h3>
        <form method="post" action="carrinho.php?action=save">
            <label>Nome: <input type="text" name="nome" required></label><br>
            <label>Email: <input type="email" name="email" required></label><br>
            <button type="submit">Salvar Pedido</button>
        </form>
        <p><a href="carrinho.php?action=clear">Limpar carrinho</a></p>
    <?php endif; ?>
</main>
<footer>
    <p>© 2025 HawkTech - Todos os direitos reservados.</p>
</footer>
</body>
</html>
