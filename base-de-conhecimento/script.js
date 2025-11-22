// Variáveis globais para o container de cards e para armazenar os dados
let cardContainer = document.querySelector(".card-container");
let dados = [];

// Função executada quando a página é carregada
window.addEventListener('DOMContentLoaded', async () => {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
    renderizarCards(dados);
});

// Função para iniciar a busca com base no termo digitado pelo usuário
async function iniciarBusca() {
    // Captura o valor do campo de busca
    let campoBusca = document.getElementById("input-busca");
    let termoBusca = campoBusca.value.toLowerCase().trim();
    
    // Garante que os dados foram carregados
    if (dados.length === 0) {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
    }
    
    // Se o campo estiver vazio, exibe todos os jogos
    if (termoBusca === "") {
        renderizarCards(dados);
        return;
    }
    
    // Filtra os dados com base no termo de busca (nome ou descrição)
    let dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca)
    );
    
    // Renderiza os cards filtrados
    renderizarCards(dadosFiltrados);
}

// Função para renderizar os cards na página
function renderizarCards(dadosParaRenderizar) {
    // Limpa o container antes de renderizar novos cards
    cardContainer.innerHTML = "";
    
    // Verifica se há resultados
    if (dadosParaRenderizar.length === 0) {
        cardContainer.innerHTML = "<p style='text-align: center; padding: 20px; color: #666;'>Nenhum jogo encontrado com esse termo de busca.</p>";
        return;
    }
    
    // Renderiza cada card
    for (let dado of dadosParaRenderizar) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
            <img src="${dado.imagem}" alt="${dado.nome}" class="card-image">
            <div class="card-content"> 
                <h2>${dado.nome}</h2>
                <p>${dado.descricao}</p>
                <button class="btn-trailer" onclick="abrirTrailer('${dado.trailer}', '${dado.nome}')">▶ Assistir Trailer</button>
                <a href="${dado.link}" target="_blank">Saiba mais</a>
            </div>
        `;
        cardContainer.appendChild(article);
    }
}

// Função para abrir o modal com o trailer
function abrirTrailer(trailerUrl, nomeJogo) {
    const modal = document.getElementById('trailer-modal');
    const iframe = document.getElementById('trailer-iframe');
    const titulo = document.getElementById('trailer-titulo');
    
    iframe.src = trailerUrl + '?autoplay=1';
    titulo.textContent = nomeJogo;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal
function fecharTrailer() {
    const modal = document.getElementById('trailer-modal');
    const iframe = document.getElementById('trailer-iframe');
    
    iframe.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fechar modal ao clicar fora do conteúdo
window.onclick = function(event) {
    const modal = document.getElementById('trailer-modal');
    if (event.target === modal) {
        fecharTrailer();
    }
}