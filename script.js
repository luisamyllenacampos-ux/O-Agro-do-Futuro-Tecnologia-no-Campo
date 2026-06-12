document.addEventListener('DOMContentLoaded', () => {

    /* --- SISTEMA DE SEÇÕES EXPANSÍVEIS (ACCORDION) --- */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const body = header.nextElementSibling;

            document.querySelectorAll('.accordion-header').forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                body.style.maxHeight = null;
            } else {
                header.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });


    /* --- SISTEMA DE ACESSIBILIDADE NATIVA --- */
    let tamanhoFonteAtual = 100; 
    const bodyElement = document.body;
    const btnAumentar = document.getElementById('btnAumentarFonte');
    const btnDiminuir = document.getElementById('btnDiminuirFonte');
    const btnContraste = document.getElementById('btnAlternarContraste');
    const btnIniciarVoz = document.getElementById('btnIniciarVoz');
    const btnPararVoz = document.getElementById('btnPararVoz');

    // Escalonamento de fontes integrado ao clamp()
    btnAumentar.addEventListener('click', () => {
        if (tamanhoFonteAtual < 140) {
            tamanhoFonteAtual += 10;
            document.documentElement.style.fontSize = `calc(clamp(10px, 1vw + 10px, 16px) * ${tamanhoFonteAtual / 100})`;
        }
    });

    btnDiminuir.addEventListener('click', () => {
        if (tamanhoFonteAtual > 80) {
            tamanhoFonteAtual -= 10;
            document.documentElement.style.fontSize = `calc(clamp(10px, 1vw + 10px, 16px) * ${tamanhoFonteAtual / 100})`;
        }
    });

    // Alternar Contraste / Dark Mode
    btnContraste.addEventListener('click', () => {
        bodyElement.classList.toggle('dark-mode');
    });

    // Leitura por Voz Inteligente (SpeechSynthesis API) focada no Conteúdo Principal
    let sinteseVoz = window.speechSynthesis;
    let expressaoUtterance = null;

    btnIniciarVoz.addEventListener('click', () => {
        sinteseVoz.cancel(); // Para execuções anteriores residuais

        const mainContent = document.getElementById('conteudo');
        // Seleciona exclusivamente tags informativas contextuais para evitar leitura de elementos de UI
        const blocosDeTexto = mainContent.querySelectorAll('h2, h3, p:not(.form-callout):not(.comments-intro):not(.comment-text)');
        let textoParaLer = "";
        
        blocosDeTexto.forEach(bloco => {
            textoParaLer += bloco.textContent + " . ";
        });

        if (textoParaLer.trim() !== "") {
            expressaoUtterance = new SpeechSynthesisUtterance(textoParaLer);
            expressaoUtterance.lang = 'pt-BR';
            expressaoUtterance.rate = 1.0; 
            sinteseVoz.speak(expressaoUtterance);
        }
    });

    btnPararVoz.addEventListener('click', () => {
        sinteseVoz.cancel();
    });


    /* --- VALIDAÇÃO DO FORMULÁRIO DE INSCRIÇÃO --- */
    const seminarioForm = document.getElementById('seminarioForm');
    const formFeedback = document.getElementById('formFeedback');

    seminarioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('inputNome').value.trim();
        const email = document.getElementById('inputEmail').value.trim();
        const cidade = document.getElementById('inputCidade').value.trim();
        const estado = document.getElementById('inputEstado').value.trim();
        const pais = document.getElementById('inputPais').value.trim();

        if (!nome || !email || !cidade || !estado || !pais) {
            formFeedback.className = "form-feedback error";
            formFeedback.textContent = "Por favor, preencha todos os campos do formulário.";
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formFeedback.className = "form-feedback error";
            formFeedback.textContent = "Por favor, insira um endereço de e-mail válido.";
            return;
        }

        formFeedback.className = "form-feedback success";
        formFeedback.textContent = `Inscrição realizada com sucesso! Parabéns, ${nome}.`;
        seminarioForm.reset();
    });


    /* --- SESSÃO INTERATIVA DE COMENTÁRIOS --- */
    const commentForm = document.getElementById('commentForm');
    const txtComentario = document.getElementById('txtComentario');
    const commentsFeed = document.getElementById('commentsFeed');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const texto = txtComentario.value.trim();

        if (texto === "") return;

        const novoComentario = document.createElement('div');
        novoComentario.className = 'comment-item';
        novoComentario.innerHTML = `
            <div class="comment-meta"><strong>Leitor Anônimo</strong> — Agora mesmo</div>
            <p class="comment-text">${texto}</p>
        `;

        commentsFeed.insertBefore(novoComentario, commentsFeed.firstChild);
        txtComentario.value = "";
    });
});