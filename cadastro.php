<?php
require 'conexao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';

    if (empty($nome) || empty($email) || empty($senha)) {
        header("Location: cadastro.html?error=Preencha todos os campos");
        exit;
    }

    // Verificar se email já existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        header("Location: cadastro.html?error=Email já cadastrado");
        exit;
    }

    // Criar usuário
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
    
    if ($stmt->execute([$nome, $email, $senha_hash])) {
        header("Location: login.html?success=Cadastro realizado com sucesso");
        exit;
    } else {
        header("Location: cadastro.html?error=Erro ao cadastrar");
        exit;
    }
}

header("Location: cadastro.html");
exit;
?>
