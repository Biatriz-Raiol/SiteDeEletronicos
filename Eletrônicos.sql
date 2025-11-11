CREATE DATABASE loja_eletronicos;
USE loja_eletronicos;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(255),
    estoque INT DEFAULT 0
);

CREATE TABLE carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE itens_carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_carrinho INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT DEFAULT 1,
    FOREIGN KEY (id_carrinho) REFERENCES carrinho(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pendente', 'pago', 'enviado', 'entregue', 'cancelado') DEFAULT 'pendente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);

INSERT INTO produtos (nome, descricao, preco, imagem, estoque) VALUES
('Apple iPhone 16 Pro Max (256 GB)', 'COM A BELEZA DO TITÂNIO. CONTROLE DA CÂMERA. FOTOS SURPREENDENTES.', 8250.00, 'img/celular_iphone_16.jpg', 10),
('Samsung Galaxy S24 Ultra (256 GB)', 'Câmera Quádrupla de 200 MP, Snapdragon 8 Gen 3, Tela 6,8" AMOLED.', 3999.00, 'img/Samsung Galaxy S24.jpg', 15),
('Fone Bluetooth JBL Tune 230NC TWS', 'Som Extra Bass e cancelamento de ruído.', 200.00, 'img/fone Bluetooth.jpg', 30),
('Apple Watch Series 9', 'Design moderno e recursos avançados de saúde e fitness.', 3999.00, 'img/relógio apple watch.jpg', 20);
