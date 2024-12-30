// Seleciona os elementos HTML necessários
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Elementos para alternar o tema
const themeToggler = document.getElementById("theme-toggler");
const body = document.body;

/**
 * Função assíncrona que realiza a busca na API do Wikipedia.
 * @param {string} query - Termo de pesquisa
 * @returns {Object} - Resultado da pesquisa
 */
async function searchWikipeida(query) {
  const encodedQuery = encodeURIComponent(query); // Codifica a consulta para ser usada na URL
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

  const reponse = await fetch(endpoint); // Faz a requisição para a API

  if (!reponse.ok) {
    // Se não conseguir fazer a requisição
    throw new Error("Faild to fetch search results form wikipedia API.");
  }

  const json = await reponse.json(); // Converte a resposta para JSON
  return json; // Retorna os dados da API
}

/**
 * Função para exibir os resultados da pesquisa na tela.
 * @param {Array} results - Lista de resultados da pesquisa
 */
function displayResults(results) {
  searchResults.innerHTML = ""; // Limpa os resultados anteriores

  results.forEach((result) => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`; // Cria o link do artigo
    const titleLink = `<a href="${url}" target="_blank" rel="noopener">${result.title} </a>`; // Link do título
    const urlLink = `<a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>`; // Link para o URL

    const resultItme = document.createElement("div"); // Cria o item de resultado
    resultItme.className = "result-item";
    resultItme.innerHTML = `
        <h3 class="result-title">${titleLink}</h3>
        ${urlLink}
        <p class="result-snippet">${result.snippet}</p>
        `; // Adiciona o conteúdo HTML

    searchResults.appendChild(resultItme); // Adiciona o item de resultado à tela
  });
}

/**
 * Evento de submissão do formulário de pesquisa
 */
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Previne o envio do formulário

  const query = searchInput.value.trim(); // Obtém o valor da pesquisa

  if (!query) {
    // Se o valor de pesquisa estiver vazio
    searchResults.innerHTML = "<p>Please enter a valid search term.</p>";
    return;
  }

  searchResults.innerHTML = "<div class='spinner'>Loading ... </div>"; // Exibe um spinner enquanto carrega

  try {
    const results = await searchWikipeida(query); // Realiza a pesquisa

    if (results.query.searchinfo.totalhits === 0) {
      // Se não houver resultados
      searchResults.innerHTML = "<p>No results found.</p>";
    } else {
      displayResults(results.query.search); // Exibe os resultados
    }
  } catch (error) {
    // Em caso de erro na requisição
    console.error(error);
    searchResults.innerHTML = `<p>An error occurred while searching. Please try again later.</p>`;
  }
});

/**
 * Evento para alternar entre os temas
 */
themeToggler.addEventListener("click", () => {
  body.classList.toggle("dark-theme"); // Alterna entre os temas

  // Atualiza o texto e estilo do botão de alternância
  if (body.classList.contains("dark-theme")) {
    themeToggler.textContent = "Dark";
    themeToggler.style.background = "#fff";
    themeToggler.style.color = "#333";
  } else {
    themeToggler.textContent = "Light";
    themeToggler.style.border = "2px solid #ccc";
    themeToggler.style.color = "#333";
  }
});
