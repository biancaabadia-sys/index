// script.js
const API_URL = "http://127.0.0";

// REQUISITO: Requisição GET e exibição dinâmica dos dados reais
async function listarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Erro ao buscar produtos");
        
        const produtos = await resposta.json();
        const container = document.getElementById("lista-produtos");
        container.innerHTML = ""; // Limpa a lista antes de atualizar

        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card-produto";
            card.innerHTML = `
                <h3>${produto.nome}</h3>
                <p>Preço: R$ ${Number(produto.preco).toFixed(2)}</p>
                <p>Estoque: ${produto.quantidade} un.</p>
            `;
            container.appendChild(card);
        });
    } catch (erro) {
        console.error("Falha na requisição GET:", erro);
        exibirMensagem("Não foi possível carregar a lista de produtos.", "erro");
    }
}

// REQUISITO: Formulário conectado ao fetch POST com headers e body configurados
async function cadastrarProduto(evento) {
    evento.preventDefault(); // Evita que a página recarregue

    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const quantidade = document.getElementById("quantidade").value;

    const dadosProduto = { nome, preco: parseFloat(preco), quantidade: parseInt(quantidade) };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Requisito de Header
            },
            body: JSON.stringify(dadosProduto) // Requisito de corpo serializado
        });

        if (!resposta.ok) throw new Error("Erro ao cadastrar produto");

        const resultado = await resposta.json();
        
        // REQUISITO: Mensagem amigável de sucesso e atualização automática da lista
        exibirMensagem(resultado.mensagem || "Produto cadastrado com sucesso!", "sucesso");
        document.getElementById("form-produto").reset(); // Limpa o formulário
        
        await listarProdutos(); // Atualiza a tela sem recarregar a página inteira

    } catch (erro) {
        console.error("Falha na requisição POST:", erro);
        exibirMensagem("Erro ao salvar o produto. Tente novamente.", "erro");
    }
}

// Função auxiliar para dar feedback visual de UX na tela
function exibirMensagem(texto, tipo) {
    const elementoMsg = document.getElementById("mensagem-feedback");
    elementoMsg.textContent = texto;
    elementoMsg.className = `mensagem ${tipo}`;
}

// Executa a listagem assim que a página terminar de carregar
document.addEventListener("DOMContentLoaded", listarProdutos);
document.getElementById("form-produto").addEventListener("submit", cadastrarProduto);
