document.addEventListener('DOMContentLoaded', () => {

    // 1. ACESSOS DA CAIXA EXPANSÍVEL (ACCORDION)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isCurrentlyActive = item.classList.contains('active');
            
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.accordion-header').forEach(h => h.setAttribute('aria-expanded', 'false'));
            
            if (!isCurrentlyActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 2. ACESSIBILIDADE: ALTERAÇÃO DA ESCALA DE FONTE DA PÁGINA
    let currentFontScale = 100;
    const btnIncreaseFont = document.getElementById('btn-increase-font');
    const btnDecreaseFont = document.getElementById('btn-decrease-font');

    btnIncreaseFont.addEventListener('click', () => {
        if(currentFontScale < 135) {
            currentFontScale += 5;
            document.documentElement.style.fontSize = `${currentFontScale}%`;
        }
    });

    btnDecreaseFont.addEventListener('click', () => {
        if(currentFontScale > 85) {
            currentFontScale -= 5;
            document.documentElement.style.fontSize = `${currentFontScale}%`;
        }
    });

    // 3. ACESSIBILIDADE: TOGGLE DE MODO ESCURO/CLARO
    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    btnToggleTheme.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if(currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    });

    // 4. ACESSIBILIDADE: LEITURA POR VOZ VIA SPEECHSYNTHESIS API
    const btnSpeak = document.getElementById('btn-speak');
    const btnStopSpeak = document.getElementById('btn-stop-speak');
    let speechUtterance = null;

    btnSpeak.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        
        // Coleta o texto exclusivamente do conteúdo principal (main)
        const textToRead = document.getElementById('main-content').innerText;
        
        speechUtterance = new SpeechSynthesisUtterance(textToRead);
        speechUtterance.lang = 'pt-BR';
        speechUtterance.rate = 1.0;
        
        window.speechSynthesis.speak(speechUtterance);
    });

    btnStopSpeak.addEventListener('click', () => {
        window.speechSynthesis.cancel();
    });

    // 5. INTERATIVIDADE E VALIDAÇÃO DO FORMULÁRIO DO SEMINÁRIO
    const seminarForm = document.getElementById('agro-seminar-form');
    const formFeedback = document.getElementById('form-feedback');

    seminarForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('input-name').value.trim();
        const email = document.getElementById('input-email').value.trim();
        const city = document.getElementById('input-city').value.trim();
        const state = document.getElementById('input-state').value.trim();
        const country = document.getElementById('input-country').value.trim();

        if(name && email && city && state && country) {
            formFeedback.style.color = '#4da6ff';
            formFeedback.textContent = `Sucesso! Inscrição de ${name} confirmada no Seminário Agro do Futuro.`;
            seminarForm.reset();
        } else {
            formFeedback.style.color = '#ff4d4d';
            formFeedback.textContent = 'Erro: Por favor preencha todos os campos corretamente.';
        }
    });

    // 6. ADICIONAR COMENTÁRIOS DE FORMA DINÂMICA
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textElement = document.getElementById('comment-text');
        const commentText = textElement.value.trim();

        if (commentText) {
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            commentItem.innerHTML = `
                <p class="comment-meta"><strong>Leitor Participante</strong> • Agora mesmo</p>
                <p class="comment-body">${commentText}</p>
            `;
            commentsList.insertBefore(commentItem, commentsList.firstChild);
            textElement.value = '';
        }
    });
});