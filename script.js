document.addEventListener('DOMContentLoaded', function() {
    function mostrarToast(mensagem, tipo = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.textContent = mensagem;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${tipo === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const required = this.querySelectorAll('[required]');
            let valid = true;
            
            required.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = '#dc3545';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!valid) {
                e.preventDefault();
                mostrarToast('Preencha todos os campos obrigatórios', 'error');
            }
        });
    });

    function atualizarContadorCarrinho() {
        console.log('Contador do carrinho atualizado');
    }

    const filtroBtns = document.querySelectorAll('.filtro-btn');
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });

    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < parseInt(this.min)) {
                this.value = this.min;
            }
            if (this.value > parseInt(this.max)) {
                this.value = this.max;
            }
        });
    });

    const submitButtons = document.querySelectorAll('button[type="submit"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.form.checkValidity()) {
                this.disabled = true;
                this.innerHTML = '<span class="loading">Carregando...</span>';
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = this.getAttribute('data-original-text') || this.textContent;
                }, 3000);
            }
        });
    });

    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    addToCartForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Adicionando...';
            
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarToast('Produto adicionado ao carrinho!');
                    atualizarContadorCarrinho();
                } else {
                    mostrarToast(data.error || 'Erro ao adicionar produto', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarToast('Erro ao adicionar produto', 'error');
            })
            .finally(() => {
                button.disabled = false;
                button.textContent = originalText;
            });
        });
    });

    console.log('HawkTech - Sistema inicializado');
});
    }
}

