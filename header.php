<?php
$carrinho_count = isset($_SESSION['carrinho']) ? count($_SESSION['carrinho']) : 0;
?>
<header>
    <div class="container">
        <div class="header-content">
            <div class="logo">
                <a href="index.php">HawkTech</a>
            </div>
            
            <nav class="nav-menu">
                <ul>
                    <li><a href="index.php">Home</a></li>
                    <li><a href="produtos.php">Produtos</a></li>
                    <li>
                        <a href="carrinho.php" class="carrinho-link">
                            Carrinho
                            <?php if ($carrinho_count > 0): ?>
                                <span class="carrinho-count"><?= $carrinho_count ?></span>
                            <?php endif; ?>
                        </a>
                    </li>
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <li class="user-menu">
                            <span>Olá, <?= htmlspecialchars($_SESSION['user_nome']) ?></span>
                            <ul class="submenu">
                                <li><a href="meus-pedidos.php">Meus Pedidos</a></li>
                                <li><a href="logout.php">Sair</a></li>
                            </ul>
                        </li>
                    <?php else: ?>
                        <li><a href="login.php">Login</a></li>
                        <li><a href="cadastro.php">Cadastrar</a></li>
                    <?php endif; ?>
                </ul>
            </nav>
        </div>
    </div>
</header>
