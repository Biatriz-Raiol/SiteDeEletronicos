<?php
session_start();
require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';
    $confirmar_senha = $_POST['confirmar_senha'] ?? '';
    $erros = [];
    
    if (empty($nome) || strlen($nome) < 2) {
        $erros[] = "Nome deve ter pelo menos 2 caracteres";
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erros[] = "Email inválido";
    }
    
    if (strlen($senha) < 6) {
        $erros[] = "Senha deve ter pelo menos 6 caracteres";
    }
    
    if ($senha !== $confirmar_senha) {
        $erros[] = "Senhas não coincidem";
    }

    if (empty($erros)) {
        try {
            $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                $erros[] = "Email já cadastrado";
            } else {
                // Inserir usuário
                $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
                
                if ($stmt->execute([$nome, $email, $senha_hash])) {
                    $_SESSION['success'] = "Cadastro realizado com sucesso! Faça login para continuar.";
                    header("Location: login.php");
                    exit;
                }
            }
        } catch (PDOException $e) {
            error_log("Erro no cadastro: " . $e->getMessage());
            $erros[] = "Erro interno do sistema. Tente novamente.";
        }
    }
    
    if (!empty($erros)) {
        $_SESSION['erros'] = $erros;
        $_SESSION['dados_form'] = ['nome' => $nome, 'email' => $email];
        header("Location: cadastro.php");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HawkTech - Cadastro</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <div class="container auth-container">
        <div class="auth-form">
            <h1>Cadastro</h1>
            
            <?php if (isset($_SESSION['erros'])): ?>
                <div class="alert alert-error">
                    <?php foreach ($_SESSION['erros'] as $erro): ?>
                        <p><?= htmlspecialchars($erro) ?></p>
                    <?php endforeach; ?>
                    <?php unset($_SESSION['erros']); ?>
                </div>
            <?php endif; ?>

            <form method="post" action="">
                <div class="form-group">
                    <input type="text" name="nome" placeholder="Nome completo" 
                           value="<?= htmlspecialchars($_SESSION['dados_form']['nome'] ?? '') ?>" required>
                    <?php unset($_SESSION['dados_form']); ?>
                </div>
                
                <div class="form-group">
                    <input type="email" name="email" placeholder="Email" 
                           value="<?= htmlspecialchars($_SESSION['dados_form']['email'] ?? '') ?>" required>
                </div>
                
                <div class="form-group">
                    <input type="password" name="senha" placeholder="Senha (mínimo 6 caracteres)" required>
                </div>
                
                <div class="form-group">
                    <input type="password" name="confirmar_senha" placeholder="Confirmar senha" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Cadastrar</button>
            </form>
            
            <p class="auth-link">
                Já tem conta? <a href="login.php">Faça login</a>
            </p>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
