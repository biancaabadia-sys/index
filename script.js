// URL base da API centralizada em uma constante (boa prática da apostila)
const API_URL = 'https://viacep.com.br/ws/';

const formulario = document.getElementById('formulario');
const campoNome = document.getElementById('nome');
const campoCep = document.getElementById('cep');
const campoNumero = document.getElementById('numero');
const botao = document.getElementById('btnBuscar');
const textoBotao = document.getElementById('textoBotao');
const mensagem = document.getElementById('mensagem');
const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');
const contador = document.getElementById('contador');

let enderecoAtual = null; // dados JSON do último CEP encontrado
const cadastros = [];     // endereços salvos (viram cards)

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo || '';
  mensagem.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
}

function preencherCampos(e) {
  document.getElementById('rua').value = e ? e.logradouro : '';
  document.getElementById('bairro').value = e ? e.bairro : '';
  document.getElementById('cidade').value = e ? e.localidade : '';
  document.getElementById('uf').value = e ? e.uf : '';
  enderecoAtual = e;
}

function carregando(ativo) {
  botao.disabled = ativo;
  botao.classList.toggle('carregando', ativo);
  textoBotao.textContent = ativo ? 'Buscando...' : 'Buscar CEP';
}

// Função assíncrona com fetch(), try/catch e atualização do DOM
async function buscarCEP(cep) {
  carregando(true);
  mostrarMensagem('Buscando endereço...', 'info');
  preencherCampos(null);

  try {
    const resposta = await fetch(`${API_URL}${cep}/json/`);
    if (!resposta.ok) throw new Error('Falha na requisição: ' + resposta.status);

    const dados = await resposta.json();
    // O ViaCEP responde 200 com { "erro": true } quando o CEP não existe
    if (dados.erro) throw new Error('CEP não encontrado');

    preencherCampos(dados);
    campoCep.classList.remove('invalido');
    mostrarMensagem('Endereço encontrado. Informe o número e salve.', 'sucesso');
    campoNumero.focus();
  } catch (erro) {
    console.error('Erro ao buscar o CEP:', erro);
    campoCep.classList.add('invalido');
    mostrarMensagem('Não foi possível buscar o CEP. Confira os números ou tente novamente em instantes.', 'erro');
  } finally {
    carregando(false);
  }
}

function iniciarBusca() {
  const cep = campoCep.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    campoCep.classList.add('invalido');
    preencherCampos(null);
    mostrarMensagem('Digite um CEP com 8 números.', 'erro');
    return;
  }
  buscarCEP(cep);
}

// Gera um card (etiqueta) por cadastro, usando createElement
function criarElemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function renderizarCards() {
  lista.innerHTML = '';
  cadastros.forEach(function (c, indice) {
    const card = criarElemento('article', 'etiqueta');
    card.appendChild(criarElemento('h3', '', c.nome));
    card.appendChild(criarElemento('p', '', c.rua + ', ' + c.numero));
    card.appendChild(criarElemento('p', '', [c.bairro, c.cidade + ', ' + c.uf].filter(Boolean).join(' · ')));
    card.appendChild(criarElemento('p', 'cep', c.cep));

    const remover = criarElemento('button', 'remover', 'Remover');
    remover.type = 'button';
    remover.addEventListener('click', function () {
      cadastros.splice(indice, 1);
      renderizarCards();
    });
    card.appendChild(remover);
    lista.appendChild(card);
  });
  contador.textContent = '(' + cadastros.length + ')';
  vazio.hidden = cadastros.length > 0;
}

formulario.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!enderecoAtual) {
    campoCep.classList.add('invalido');
    mostrarMensagem('Busque um CEP válido antes de salvar.', 'erro');
    campoCep.focus();
    return;
  }
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }
  cadastros.unshift({
    nome: campoNome.value.trim(),
    cep: enderecoAtual.cep,
    rua: enderecoAtual.logradouro,
    bairro: enderecoAtual.bairro,
    cidade: enderecoAtual.localidade,
    uf: enderecoAtual.uf,
    numero: campoNumero.value.trim()
  });
  renderizarCards();
  formulario.reset();
  preencherCampos(null);
  mostrarMensagem('Endereço salvo com sucesso!', 'sucesso');
});

campoCep.addEventListener('input', function () {
  const n = campoCep.value.replace(/\D/g, '').slice(0, 8);
  campoCep.value = n.length > 5 ? n.slice(0, 5) + '-' + n.slice(5) : n;
  campoCep.classList.remove('invalido');
  if (n.length === 8) iniciarBusca();
});
campoCep.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') { e.preventDefault(); iniciarBusca(); }
});
botao.addEventListener('click', iniciarBusca);

renderizarCards();
