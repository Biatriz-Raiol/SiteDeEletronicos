CREATE DATABASE IF NOT EXISTS loja_eletronicos;
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
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    imagem VARCHAR(255),
    estoque INT DEFAULT 0,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nome VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'processando', 'enviado', 'entregue', 'cancelado') DEFAULT 'pendente',
    usuario_id INT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    nome_produto VARCHAR(100) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE SET NULL
);

INSERT INTO produtos (nome, descricao, preco, categoria, imagem, estoque) VALUES
('Apple iPhone 16 Pro Max', 'Cor: Titânio Preto, Memória: 256 GB e 8 GB (RAM), Beleza em titânio. Controle total da câmera. Fotos impressionantes.', 8500.00, 'celulares', 'img/celular_iphone_16.jpg', 10),
('Samsung Galaxy Watch8 Smartwatch', 'Cor: Prata, Alumínio reforçado, bateria de 24 horas, Manter a conexão, monitorar sua saúde e ficar em segurança.', 1500.00, 'relógios', 'img/relógio vivoactive.jpg', 18),
('Headphone Philips Wireless', 'Cor: Preto, Conectividade: Bluetooth 5.0, Bateria: Até 18 horas de reprodução, Design confortável e som de alta qualidade.', 150.00, 'fones', 'img/fone Bluetooth.jpg', 25),
('Apple Watch SE GPS, Caixa Estelar de Alumínio', 'Cor: Branco, Manter a conexão, monitorar sua saúde e ficar em segurança. O Apple Watch SE é cheio de possibilidades ao alcance do seu pulso.', 1000.00, 'relógios', 'img/relógio apple watch.jpg', 20),
('Samsung Galaxy S24', 'Cor: Cinza, Memória: 256 GB e 12GB (RAM), O Design moderno e sofisticado do Galaxy S24 combina com o desempenho poderoso e a câmera de alta resolução para capturar cada momento com clareza impressionante.', 5000.00, 'celulares', 'img/Samsung Galaxy S24.jpg', 12),
('JBL PartyBox com Rodas', 'Cor: Preto, Potência: 240W RMS, Iluminação personalizável, conectividade Bluetooth e bateria de longa duração para festas sem fim.', 4200.00, 'caixa de som', 'img/JBL, Caixa de Som, PartyBox Stage 320,.jpg', 8),
('Samsung Combo Vision AI TV 43"', 'Cor: Preto, Resolução: 4K UHD, Experiência de visualização imersiva com inteligência artificial para otimizar a qualidade da imagem e som.', 2500.00, 'TV', 'img/Samsung Combo Vision AI TV 43.jpg', 6),
('Samsung Galaxy Tab S10 Lite', 'Cor: Prata, Tela: 10.4 polegadas, Desempenho potente com processador octa-core, ideal para trabalho e entretenimento em qualquer lugar.', 4000.00, 'tablet', 'img/Samsung Tablet Galaxy Tab S10 Lite.jpg', 10),
('Câmera de ação GoPro - HERO', 'Cor: Preto, Resolução: 4K60, Capture cada aventura com qualidade de cinema, resistente e à prova d''água até 10 metros.', 3200.00, 'câmera', 'img/camera de ação GoPro HERO.jpg', 15),
('Caixa de som portátil JBL Flip 6', 'Cor: Preto, Potência: 30W RMS, Som potente e graves profundos em um design compacto e resistente à água.', 700.00, 'caixa de som', 'img/caixa de som JBL.jpg', 20),
('Apple iPhone 15 Rosa', 'Cor: Rosa, Memória: 256 GB e 8 GB (RAM), Beleza em rosa. Controle total da câmera. Fotos impressionantes.', 6500.00, 'celulares', 'img/IPHONE 16 ROSA.jpg', 8),
('Apple iPhone 13 - Luz das Estrelas', 'Cor: Branco, Memória: 256 GB e 8GB, O sistema de câmera dupla mais avançado em um iPhone. Chip A15 Bionic com velocidade impressionante.', 4200.00, 'celulares', 'img/IPHONE_13.jpg', 15);

INSERT INTO usuarios (nome, email, senha) VALUES 
('João Silva', 'joao@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')

CREATE USER IF NOT EXISTS 'loja_user'@'localhost' IDENTIFIED BY 'senha_segura123';
GRANT ALL PRIVILEGES ON loja_eletronicos.* TO 'loja_user'@'localhost';
FLUSH PRIVILEGES;

SHOW TABLES;

DESCRIBE usuarios;
DESCRIBE produtos;
DESCRIBE pedidos;
DESCRIBE pedido_items;

SELECT id, nome, preco, categoria FROM produtos;
