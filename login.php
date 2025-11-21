<?php
session_start();
require 'conexao.php';
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';

    $erros = [];

    if (empty($email) || empty($senha)) {
        $erros[] = "Preencha email e senha";
    }

    if (empty($erros)) {
        try {
            $stmt = $pdo->prepare("SELECT id, nome, senha FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($senha, $user['senha'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_nome'] = $user['nome'];
                $_SESSION['success'] = "Login realizado com sucesso!";
                $redirect = $_SESSION['redirect_url'] ?? 'index.php';
                unset($_SESSION['redirect_url']);
                header("Location: $redirect");
                exit;
            } else {
                $erros[] = "Email ou senha incorretos";
            }
        } catch (PDOException $e) {
            error_log("Erro no login: " . $e->getMessage());
            $erros[] = "Erro interno do sistema";
        }
    }

    if (!empty($erros)) {
        $_SESSION['erros'] = $erros;
        header("Location: login.php");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HawkTech - Login</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container auth-container">
        <div class="auth-form">
            <h1>Login</h1>
            
            <?php if (isset($_SESSION['erros'])): ?>
                <div class="alert alert-error">
                    <?php foreach ($_SESSION['erros'] as $erro): ?>
                        <p><?= htmlspecialchars($erro) ?></p>
                    <?php endforeach; ?>
                    <?php unset($_SESSION['erros']); ?>
                </div>
            <?php endif; ?>

            <?php if (isset($_SESSION['success'])): ?>
                <div class="alert alert-success">
                    <p><?= htmlspecialchars($_SESSION['success']) ?></p>
                    <?php unset($_SESSION['success']); ?>
                </div>
            <?php endif; ?>

            <form method="post" action="">
                <div class="form-group">
                    <input type="email" name="email" placeholder="Email" required>
                </div>
                
                <div class="form-group">
                    <input type="password" name="senha" placeholder="Senha" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Entrar</button>
            </form>
            
            <p class="auth-link">
                Não tem conta? <a href="cadastro.php">Cadastre-se</a>
            </p>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
