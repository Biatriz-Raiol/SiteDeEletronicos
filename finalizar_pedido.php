<?php
require_once 'config.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dados = json_decode(file_get_contents('php://input'), true);
    
    $cliente_nome = $dados['cliente_nome'] ?? 'Cliente';
    $cliente_email = $dados['cliente_email'] ?? 'cliente@email.com';
    $total = $dados['total'] ?? 0;
    $itens = $dados['itens'] ?? [];
    $usuario_id = isset($_SESSION['usuario']) ? $_SESSION['usuario']['id'] : null;
    
    try {
        $pdo->beginTransaction();

        $stmt_pedido = $pdo->prepare("INSERT INTO pedidos (cliente_nome, cliente_email, total, usuario_id) VALUES (?, ?, ?, ?)");
        $stmt_pedido->execute([$cliente_nome, $cliente_email, $total, $usuario_id]);
        $pedido_id = $pdo->lastInsertId();

        $stmt_item = $pdo->prepare("INSERT INTO pedido_items (pedido_id, produto_id, quantidade, preco_unitario, nome_produto) VALUES (?, ?, ?, ?, ?)");
        
        foreach ($itens as $item) {
            $produto_id = null;
            $nome_produto = $item['nome'] ?? 'Produto Desconhecido';
            $quantidade = $item['quantidade'] ?? 1;
            $preco = $item['preco'] ?? 0;

            if (isset($item['nome'])) {
                $stmt_produto = $pdo->prepare("SELECT id FROM produtos WHERE nome LIKE ? LIMIT 1");
                $stmt_produto->execute(['%' . $item['nome'] . '%']);
                $produto = $stmt_produto->fetch(PDO::FETCH_ASSOC);
                
                if ($produto) {
                    $produto_id = $produto['id'];
                }
            }

            $stmt_item->execute([
                $pedido_id, 
                $produto_id, 
                $quantidade, 
                $preco,
                $nome_produto
            ]);
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true, 
            'pedido_id' => $pedido_id,
            'message' => 'Pedido finalizado com sucesso!'
        ]);
        
    } catch(PDOException $e) {
        $pdo->rollBack();
        
        echo json_encode([
            'success' => false, 
            'message' => 'Erro ao finalizar pedido: ' . $e->getMessage()
        ]);
    }
}
?>
