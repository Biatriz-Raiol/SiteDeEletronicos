<?php
session_start();
require_once __DIR__ . '/../config/database.php';

$cart = $_SESSION['cart'] ?? [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'clear') {
        unset($_SESSION['cart']);
        header('Location: carrinho.php');
        exit;
    }
}
?>
<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Carrinho - HawkTech</title><link rel="stylesheet" href="css/style.css"></head>
<body>
  <main class="container">
    <h1>Carrinho</h1>
    <?php if(empty($cart)): ?>
      <p>Seu carrinho está vazio. <a href="index.php">Ver produtos</a></p>
    <?php else: ?>
      <table class="cart-table">
        <thead><tr><th>Produto</th><th>Qtd</th><th>Preço</th><th>Total</th></tr></thead>
        <tbody>
        <?php $sum = 0; foreach($cart as $item): $total = $item['qty'] * $item['price']; $sum += $total; ?>
          <tr>
            <td><?php echo htmlspecialchars($item['name'], ENT_QUOTES, 'UTF-8'); ?></td>
            <td><?php echo (int)$item['qty']; ?></td>
            <td>R$ <?php echo number_format($item['price'],2,',','.'); ?></td>
            <td>R$ <?php echo number_format($total,2,',','.'); ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
        <tfoot><tr><th colspan="3">Total</th><th>R$ <?php echo number_format($sum,2,',','.'); ?></th></tr></tfoot>
      </table>

      <form method="POST">
        <button type="submit" name="action" value="clear">Limpar carrinho</button>
      </form>
    <?php endif; ?>
  </main>
</body>
</html>
