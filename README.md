# Cadastro de endereços com busca de CEP

Prática Independente · Semana 2 · 4º Bimestre · DWS

Página que consome a API pública **ViaCEP** com `fetch()`. O endereço encontrado
preenche o formulário e cada cadastro salvo vira um card (etiqueta) gerado
dinamicamente, sem recarregar a página.

## Planejamento da funcionalidade

| O que decidir | Minha escolha | Trecho de código relacionado |
|---|---|---|
| API escolhida | ViaCEP | `fetch(`${API_URL}${cep}/json/`)` |
| Dado que será buscado | Rua, bairro, cidade e UF a partir do CEP | `dados.logradouro`, `dados.bairro`, `dados.localidade`, `dados.uf` |
| Elemento HTML que será atualizado | Inputs `rua`, `bairro`, `cidade`, `uf` e a lista de cards `#lista` | `document.getElementById('rua').value = ...` |
| Mensagem exibida em caso de erro | "Não foi possível buscar o CEP. Confira os números ou tente novamente em instantes." | `mostrarMensagem(..., 'erro')` no `catch` |

## Cenários testados

| # | Entrada | Resultado esperado |
|---|---|---|
| 1 | CEP válido: `01001-000` | Preenche Praça da Sé, Sé, São Paulo, SP |
| 2 | CEP inexistente: `99999-999` | Mensagem de erro amigável |
| 3 | CEP incompleto: `123` + Enter | "Digite um CEP com 8 números." |
| 4 | Salvar sem buscar o CEP | "Busque um CEP válido antes de salvar." |
| 5 | Sem internet (DevTools > Network > Offline) | Mensagem de erro amigável, página não trava |

## Como publicar

```
git add .
git commit -m "Adiciona busca de CEP com fetch e cards dinamicos"
git push origin main
```

Depois: Settings → Pages → branch `main`.
