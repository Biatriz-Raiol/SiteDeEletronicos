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
    categoria VARCHAR(50),
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(255),
    estoque INT DEFAULT 0
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nome VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

INSERT INTO produtos (nome, descricao, categoria, preco, imagem) VALUES
("Apple iPhone 16 Pro Max", "Cor: Titânio Preto. Memória: 256 GB / 8 GB RAM. Beleza em titânio com câmeras avançadas.", "celulares", 8500.00, "img/celular_iphone_16.jpg"),
("Samsung Galaxy Watch8 Smartwatch", "Cor: Prata. Alumínio reforçado, bateria 24h e monitoramento completo de saúde.", "relógios", 1500.00, "img/relógio vivoactive.jpg"),
("Headphone Philips Wireless", "Cor: Preto. Bluetooth 5.0, até 18h de bateria e som de alta qualidade.", "fones", 150.00, "img/fone Bluetooth.jpg"),
("Apple Watch SE GPS", "Cor: Branco. Cheio de possibilidades para saúde e conexões no pulso.", "relógios", 1000.00, "img/relógio apple watch.jpg"),
("Samsung Galaxy S24", "Cor: Cinza. 256 GB / 12 GB RAM. Design moderno e câmera poderosa.", "celulares", 5000.00, "img/Samsung Galaxy S24.jpg"),
("JBL PartyBox com Rodas", "Cor: Preto. 240W RMS, iluminação personalizável e bateria duradoura.", "caixa de som", 4200.00, "img/JBL, Caixa de Som, PartyBox Stage 320,.jpg"),
("Samsung Vision AI TV 43\"", "Cor: Preto. Resolução 4K UHD. Inteligência artificial para imagem e som.", "TV", 2500.00, "img/Samsung Combo Vision AI TV 43.jpg"),
("Samsung Galaxy Tab S10 Lite", "Cor: Prata. Tela 10.4'', desempenho octa-core.", "tablet", 4000.00, "img/Samsung Tablet Galaxy Tab S10 Lite.jpg"),
("GoPro HERO", "Cor: Preto. 4K60, resistente e à prova d'água até 10m.", "câmera", 3200.00, "img/camera de ação GoPro HERO.jpg"),
("Caixa de Som JBL Flip 6", "Cor: Preto. 30W RMS, resistente à água e som potente.", "caixa de som", 700.00, "img/caixa de som JBL.jpg"),
("Apple iPhone 15 Rosa", "Cor: Rosa. 256 GB / 8 GB RAM. Fotos impressionantes.", "celulares", 6500.00, "img/IPHONE 16 ROSA.jpg"),
("Apple iPhone 13 Luz das Estrelas", "Cor: Branco. 256 GB, chip A15 Bionic.", "celulares", 4200.00, "img/IPHONE_13.jpg");
