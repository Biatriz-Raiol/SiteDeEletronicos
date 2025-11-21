<?php
session_start();
require 'conexao.php';

if (!isset($_SESSION['carrinho'])) {
    $_SESSION['carrinho'] = [];
}

$action = $_GET['action'] ?? '';

if ($action === 'add' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $produto_id = (int)($_POST['produto_id'] ?? 0);
    $quantidade = max(1, (int)($_POST['quantidade'] ?? 1));

    try {
        $stmt = $pdo->prepare('SELECT id, nome, preco, estoque, imagem FROM produtos WHERE id = ? AND estoque > 0');
        $stmt->execute([$produto_id]);
        $produto = $stmt->fetch();

        if ($produto) {

            if ($quantidade > $produto['estoque']) {
                $_SESSION['erro'] = "Quantidade solicitada indisponível em estoque.";
                header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? 'produtos.php'));
                exit;
            }

            $encontrado = false;
            foreach ($_SESSION['carrinho'] as &$item) {
                if ($item['produto_id'] == $produto_id) {
                    $nova_quantidade = $item['quantidade'] + $quantidade;
                    if ($nova_quantidade <= $produto['estoque']) {
                        $item['quantidade'] = $nova_quantidade;
                        $encontrado = true;
                    } else {
                        $_SESSION['erro'] = "Quantidade total excede o estoque disponível.";
                    }
                    break;
                }
            }

            if (!$encontrado && !isset($_SESSION['erro'])) {
                $_SESSION['carrinho'][] = [
                    'produto_id' => $produto['id'],
                    'nome' => $produto['nome'],
                    'preco' => $produto['preco'],
                    'imagem' => $produto['imagem'],
                    'quantidade' => $quantidade
                ];
            }

            if (!isset($_SESSION['erro'])) {
                $_SESSION['success'] = "Produto adicionado ao carrinho!";
            }
        } else {
            $_SESSION['erro'] = "Produto não encontrado ou fora de estoque.";
        }
    } catch (PDOException $e) {
        error_log("Erro ao adicionar ao carrinho: " . $e->getMessage());
        $_SESSION['erro'] = "Erro ao adicionar produto ao carrinho.";
    }

    header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? 'produtos.php'));
    exit;
}

if ($action === 'remove') {
    $produto_id = (int)($_GET['produto_id'] ?? 0);
    
    foreach ($_SESSION['carrinho'] as $key => $item) {
        if ($item['produto_id'] == $produto_id) {
            unset($_SESSION['carrinho'][$key]);
            $_SESSION['success'] = "Produto removido do carrinho.";
            break;
        }
    }
    
    $_SESSION['carrinho'] = array_values($_SESSION['carrinho']);
    header('Location: carrinho.php');
    exit;
}

if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $produto_id = (int)($_POST['produto_id'] ?? 0);
    $quantidade = max(0, (int)($_POST['quantidade'] ?? 0));

    if ($quantidade === 0) {
        foreach ($_SESSION['carrinho'] as $key => $item) {
            if ($item['produto_id'] == $produto_id) {
                unset($_SESSION['carrinho'][$key]);
                break;
            }
        }
        $_SESSION['carrinho'] = array_values($_SESSION['carrinho']);
    } else {
        foreach ($_SESSION['carrinho'] as &$item) {
            if ($item['produto_id'] == $produto_id) {
                try {
                    $stmt = $pdo->prepare('SELECT estoque FROM produtos WHERE id = ?');
                    $stmt->execute([$produto_id]);
                    $estoque = $stmt->fetchColumn();
                    
                    if ($quantidade <= $estoque) {
                        $item['quantidade'] = $quantidade;
                    } else {
                        $_SESSION['erro'] = "Quantidade indisponível em estoque.";
                    }
                } catch (PDOException $e) {
                    $_SESSION['erro'] = "Erro ao verificar estoque.";
                }
                break;
            }
        }
    }
    
    header('Location: carrinho.php');
    exit;
}

if ($action === 'clear') {
    $_SESSION['carrinho'] = [];
    $_SESSION['success'] = "Carrinho limpo.";
    header('Location: carrinho.php');
    exit;
}

$total = 0;
$total_itens = 0;
foreach ($_SESSION['carrinho'] as $item) {
    $total += $item['preco'] * $item['quantidade'];
    $total_itens += $item['quantidade'];
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrinho - HawkTech</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <main class="container">
        <h1>Meu Carrinho</h1>

        <?php if (isset($_SESSION['success'])): ?>
            <div class="alert alert-success">
                <p><?= htmlspecialchars($_SESSION['success']) ?></p>
                <?php unset($_SESSION['success']); ?>
            </div>
        <?php endif; ?>

        <?php if (isset($_SESSION['erro'])): ?>
            <div class="alert alert-error">
                <p><?= htmlspecialchars($_SESSION['erro']) ?></p>
                <?php unset($_SESSION['erro']); ?>
            </div>
        <?php endif; ?>

        <?php if (empty($_SESSION['carrinho'])): ?>
            <div class="carrinho-vazio">
                <p>Seu carrinho está vazio.</p>
                <a href="produtos.php" class="btn btn-primary">Continuar Comprando</a>
            </div>
        <?php else: ?>
            <div class="carrinho-container">
                <div class="carrinho-itens">
                    <?php foreach ($_SESSION['carrinho'] as $item): ?>
                        <div class="carrinho-item">
                            <div class="item-imagem">
                                <img src="<?= htmlspecialchars($item['imagem']) ?>" 
                                     alt="<?= htmlspecialchars($item['nome']) ?>"
                                     onerror="this.src='assets/img/placeholder.jpg'">
                            </div>
                            <div class="item-info">
                                <h3><?= htmlspecialchars($item['nome']) ?></h3>
                                <p class="preco-unitario">R$ <?= number_format($item['preco'], 2, ',', '.') ?></p>
                            </div>
                            <div class="item-quantidade">
                                <form method="post" action="carrinho.php?action=update" class="quantidade-form">
                                    <input type="hidden" name="produto_id" value="<?= $item['produto_id'] ?>">
                                    <label>Qtd:</label>
                                    <input type="number" name="quantidade" value="<?= $item['quantidade'] ?>" 
                                           min="0" max="99" onchange="this.form.submit()">
                                </form>
                            </div>
                            <div class="item-subtotal">
                                <p>R$ <?= number_format($item['preco'] * $item['quantidade'], 2, ',', '.') ?></p>
                            </div>
                            <div class="item-acoes">
                                <a href="carrinho.php?action=remove&produto_id=<?= $item['produto_id'] ?>" 
                                   class="btn-remover" 
                                   onclick="return confirm('Remover este produto do carrinho?')">
                                    Remover
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="carrinho-resumo">
                    <div class="resumo-card">
                        <h3>Resumo do Pedido</h3>
                        <div class="resumo-linha">
                            <span>Itens (<?= $total_itens ?>):</span>
                            <span>R$ <?= number_format($total, 2, ',', '.') ?></span>
                        </div>
                        <div class="resumo-linha">
                            <span>Frete:</span>
                            <span>Grátis</span>
                        </div>
                        <div class="resumo-linha total">
                            <span><strong>Total:</strong></span>
                            <span><strong>R$ <?= number_format($total, 2, ',', '.') ?></strong></span>
                        </div>
                        
                        <div class="resumo-acoes">
                            <a href="checkout.php" class="btn btn-primary btn-block">
                                Finalizar Compra
                            </a>
                            <a href="carrinho.php?action=clear" class="btn btn-secondary btn-block"
                               onclick="return confirm('Limpar todo o carrinho?')">
                                Limpar Carrinho
                            </a>
                            <a href="produtos.php" class="btn btn-link btn-block">
                                Continuar Comprando
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </main>

    <?php include 'includes/footer.php'; ?>
    
    <script src="assets/js/script.js"></script>
</body>
</html>
