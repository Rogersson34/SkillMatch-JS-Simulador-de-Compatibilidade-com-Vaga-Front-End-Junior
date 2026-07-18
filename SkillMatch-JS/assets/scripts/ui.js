
// Camada de tela: cria e atualiza elementos do DOM. Não conhece as regras
// do motor nem sabe de onde os dados vêm — só recebe dados prontos e
// desenha, ou captura eventos e devolve para quem chamou.


// ---------- Referências fixas ao DOM ----------
const containerResultados = document.getElementById("resultados");
const elementoStatus = document.getElementById("status-mensagem");
const elementoErro = document.getElementById("status-erro");
const elementoContador = document.getElementById("contador-analises");

// ---------- Estados do fetch (carregando / vazio / erro) ----------

// Mostra o estado de carregamento (aria-live="polite").
export function exibirCarregando() {
    limparResultados();
    elementoErro.textContent = "";
    elementoStatus.textContent = "Carregando vagas…";
}

// limpa resultados e mostra mensagem de "Nada encontrado".
export function exibirVazio() {
    limparResultados();
    elementoStatus.textContent = "Nada encontrado.";
    elementoErro.textContent = "";
}

//Mostra o estado de erro (role="alert", aria-live="assertive").
export function exibirErroDeCarregamento(mensagem) {// limpa resultados e exibe mensagem (ou uma mensagem padrão) no elemento de erro.
    limparResultados();//limpa texto de status e o conteúdo do container de resultados.
    elementoStatus.textContent = "";
    elementoErro.textContent =
        mensagem || "Erro ao carregar as vagas. Tente novamente mais tarde.";
}

// Limpa mensagens de status/erro e o container de resultados.
function limparResultados() {
    elementoStatus.textContent = "";
    containerResultados.innerHTML = "";
}

// ---------- Formulário: erros de validação ----------

/**
 * Exibe as mensagens de erro de validação nos campos do formulário.
 */
export function exibirErrosFormulario(erros) {
    Object.entries(erros).forEach(([campo, mensagem]) => {
        const spanErro = document.getElementById(`erro-${campo}`);
        const input = document.getElementById(campo);
        if (spanErro) spanErro.textContent = mensagem;
        if (input) input.setAttribute("aria-invalid", mensagem ? "true" : "false");
    });
}

//Limpa a mensagem de erro de um único campo (ao digitar).
export function limparErroDoCampo(idCampo) {
    const spanErro = document.getElementById(`erro-${idCampo}`);
    const input = document.getElementById(idCampo);
    if (spanErro) spanErro.textContent = "";
    if (input) input.setAttribute("aria-invalid", "false");
}

// Preenche o campo dos formulários com um perfil salvo anteriormente.
export function preencherFormulario(perfil) {
    document.getElementById("nome").value = perfil.nome || "";
    document.getElementById("area").value = perfil.area || "";
    document.getElementById("habilidades").value = Array.isArray(
        perfil.habilidades
    )
        ? perfil.habilidades.join(", ")
        : "";
    document.getElementById("experiencia").value = perfil.experienciaMeses ?? "";
}

// ---------- Renderização dos resultados ----------

/**
 * Renderiza a lista de vagas analisadas, o destaque da melhor vaga,
 * a recomendação de estudo e o contador de análises da sessão.
 */
export function renderizarResultados(
    vagasAnalisadas,
    melhorVaga,
    recomendacao,
    totalAnalises
) {
    limparResultados();

    if (vagasAnalisadas.length === 0) {
        exibirVazio();
        return;
    }

    elementoContador.textContent = `Análises feitas nesta sessão: ${totalAnalises}`;

    const destaque = criarDestaqueMelhorVaga(melhorVaga, recomendacao);
    containerResultados.appendChild(destaque);

    const lista = document.createElement("div");
    lista.className = "lista-vagas";

    vagasAnalisadas.forEach((vaga) => {
        const ehMelhor = melhorVaga && vaga.id === melhorVaga.id;
        lista.appendChild(criarCardVaga(vaga, ehMelhor));
    });

    containerResultados.appendChild(lista);
}

/* Cria o bloco de destaque com a melhor vaga e a recomendação de estudo. */
function criarDestaqueMelhorVaga(melhorVaga, recomendacao) {
    const secao = document.createElement("section");
    secao.className = "destaque-recomendacao";
    secao.setAttribute("aria-label", "Melhor vaga e recomendação de estudo");

    if (melhorVaga) {
        const titulo = document.createElement("h3");
        titulo.textContent = `⭐ Melhor compatibilidade: ${melhorVaga.rotulo()}`;
        secao.appendChild(titulo);
    }

    const paragrafoRecomendacao = document.createElement("p");
    paragrafoRecomendacao.textContent = recomendacao;
    secao.appendChild(paragrafoRecomendacao);

    return secao;
}

/**
 * Cria o card de uma vaga usando createElement/classList ,
 * sem escrever HTML fixo.
 */
function criarCardVaga(vaga, ehMelhor) {
    const { encontradas, faltantes, percentual, classificacao } = vaga.resultado;

    const card = document.createElement("article");
    card.className = "vaga-card";
    card.classList.add(`classificacao-${classificacao.toLowerCase()}`);
    if (ehMelhor) card.classList.add("melhor-match");
    card.setAttribute(
        "aria-label",
        `${vaga.rotulo()}, compatibilidade ${percentual} por cento, classificação ${classificacao}`
    );

    const cabecalho = document.createElement("div");
    cabecalho.className = "vaga-cabecalho";

    const cargo = document.createElement("h4");
    cargo.className = "vaga-cargo";
    cargo.textContent = vaga.rotulo();
    cabecalho.appendChild(cargo);

    if (ehMelhor) {
        const selo = document.createElement("span");
        selo.className = "selo-melhor";
        selo.textContent = "⭐ Melhor vaga";
        cabecalho.appendChild(selo);
    }

    const meta = document.createElement("p");
    meta.className = "vaga-meta";
    meta.textContent = `${vaga.modalidade} · R$ ${vaga.salario.toLocaleString(
        "pt-BR"
    )} · exp. desejada: ${vaga.experienciaRequerida} meses`;

    const linhaPercentual = document.createElement("div");
    linhaPercentual.className = "percentual-linha";
    linhaPercentual.innerHTML = `<span>${classificacao}</span><span>${percentual}%</span>`;

    const barra = document.createElement("div");
    barra.className = "barra-progresso";
    barra.setAttribute("role", "progressbar");
    barra.setAttribute("aria-valuenow", String(percentual));
    barra.setAttribute("aria-valuemin", "0");
    barra.setAttribute("aria-valuemax", "100");

    const preenchimento = document.createElement("div");
    preenchimento.className = "barra-progresso-preenchimento";
    preenchimento.classList.add(`faixa-${classificacao.toLowerCase()}`);
    preenchimento.style.width = `${percentual}%`;
    barra.appendChild(preenchimento);

    const grupoHabilidades = document.createElement("div");
    grupoHabilidades.className = "grupo-habilidades";
    grupoHabilidades.appendChild(
        criarBlocoHabilidades("Encontradas", encontradas, "habilidade-encontrada")
    );
    grupoHabilidades.appendChild(
        criarBlocoHabilidades("Faltantes", faltantes, "habilidade-faltante")
    );

    card.appendChild(cabecalho);
    card.appendChild(meta);
    card.appendChild(linhaPercentual);
    card.appendChild(barra);
    card.appendChild(grupoHabilidades);

    return card;
}

/* Cria um bloco (título + lista) de habilidades encontradas/faltantes. */
function criarBlocoHabilidades(titulo, habilidades, classeItem) {
    const bloco = document.createElement("div");

    const tituloElemento = document.createElement("h5");
    tituloElemento.textContent = titulo;
    bloco.appendChild(tituloElemento);

    if (habilidades.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "sem-habilidades";
        vazio.textContent = "Nenhuma";
        bloco.appendChild(vazio);
        return bloco;
    }

    const lista = document.createElement("ul");
    lista.className = "lista-habilidades";

    habilidades.forEach((habilidade) => {
        const item = document.createElement("li");
        item.className = classeItem;
        item.textContent = habilidade;
        lista.appendChild(item);
    });

    bloco.appendChild(lista);
    return bloco;
}