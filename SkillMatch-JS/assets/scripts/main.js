import {//Informa ao JavaScript que você vai importar alguma coisa do motor.js.
    Vaga,
    VagaFrontEnd,
    criarCandidato,
    analisarTodasAsVagas,
    encontrarMelhorVaga,
    gerarRecomendacaoDeEstudo,
    criarContadorDeAnalises
} from "./motor.js";
//Traz as funções que fazem as contas e como calcular compatibilidade, sugerir estudos e criar objetos de vagas.
import { buscarVagas, salvarPerfil, carregarPerfil } from './dados.js';//Aqui importamos funções do arquivo dados.js
import * as ui from "./ui.js";//importa tudo, criando um apelido, dentro do objeto ui.js


// ---------- Referências ao formulário ----------
const formulario = document.getElementById("form-perfil");
//getElementById: procura um elemento pelo seu ID
const campoNome = document.getElementById("nome");

const campoArea = document.getElementById("area");

const campoHabilidades = document.getElementById("habilidades");

const campoExperiencia = document.getElementById("experiencia");

// Closure: Ativa um contador de quantas vezes o usuário rodou o teste nesta sessão do navegador
const contarAnalise = criarContadorDeAnalises();

// VALIDAÇÃO DO FORMULÁRIO
function converterHabilidadesParaArray(texto) {
    return texto
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
}//Essa função transforma essa única linha de texto em uma lista organizada
//e limpando espaços em branco extras e removendo itens vazios.


function validarFormulario() {
    const nome = campoNome.value.trim();
    const area = campoArea.value;
    const habilidades = converterHabilidadesParaArray(campoHabilidades.value);
    const experienciaMeses = Number(campoExperiencia.value) || 0;

    const erros = { nome: "", area: "", habilidades: "", experiencia: "" };

    let valido = true;
    //Lê todos os campos e cria um "objeto de erros" vazio.
    // Se algum campo estiver errado, nós preenchemos essa mensagem de erro e mudamos a variável valido para false.

    if (nome.length === 0) {
        erros.nome = "O nome é obrigatório.";
        valido = false;
        //Aplica as regras de validação. 
    } else if (nome.length < 3) {
        erros.nome = "O nome deve ter no mínimo 3 caracteres.";
        valido = false;
    } //O nome não pode ser menor que 3 letras

    if (area.length === 0) {
        erros.area = "Selecione uma área de atuação.";
        valido = false;
    }

    if (habilidades.length === 0) {
        erros.habilidades = "Informe ao menos uma habilidade.";
        valido = false;
    }// a área deve ser selecionada, precisa de pelo menos uma habilidade 

    if (campoExperiencia.value && experienciaMeses < 0) {
        erros.experiencia = "A experiência não pode ser negativa.";
        valido = false;
    }//A experiência não pode ser menor que zero.

    return {
        valido,
        dados: { nome, area, habilidades, experienciaMeses },
        erros
    }; // Ao final, devolve o resultado dizendo se o formulário está correto (valido)
    // //os dados limpos e os erros que encontrar.
}


// FLUXO PRINCIPAL
async function executarAnalise(perfil) {
    ui.exibirCarregando();

    try {
        const vagasBrutas = await buscarVagas();
        if (!Array.isArray(vagasBrutas) || vagasBrutas.length === 0) {
            ui.exibirVazio();
            return;
        }
        //Busca as vagas no servidor/JSON e, se não encontrar nada, exibe uma tela de estado vazio

        const vagas = vagasBrutas.map((dadosVaga) =>
            dadosVaga.area === "Front-end"
                ? new VagaFrontEnd(dadosVaga)
                : new Vaga(dadosVaga)
        );//Passa por todas as vagas recebidas e as transforma em objetos de classe estruturados.

        const vagasAnalisadas = analisarTodasAsVagas(
            vagas,
            perfil.habilidades,
            (vaga, resultado) => {
                // callback: recebe cada vaga já analisada (aqui, só logamos)
                console.log(`Analisado: ${vaga.cargo} → ${resultado.percentual}%`);
            }
        );

        if (vagasAnalisadas.length === 0) {
            ui.exibirVazio();
            return;
        }

        const melhorVaga = encontrarMelhorVaga(
            vagasAnalisadas,
            perfil.experienciaMeses
        );//Filtra para descobrir qual a melhor vaga para o perfil, levando em conta o tempo de experiência do usuário.

        const recomendacao = gerarRecomendacaoDeEstudo(melhorVaga);
        //Gera sugestões do que estudar para se adequar melhor a essa vaga.
        const totalAnalises = contarAnalise();
        //Incrementa e lê o nosso contador de análises feitas.
        ui.renderizarResultados(vagasAnalisadas, melhorVaga, recomendacao, totalAnalises);
        //Envia tudo para o arquivo de interface (ui.js) desenhar os resultados bonitinhos na tela para o usuário.

    } catch (erro) {
        console.error("Erro ao analisar compatibilidade:", erro);
        ui.exibirErroDeCarregamento(
            "Erro ao carregar as vagas. Tente novamente mais tarde."
        );//o catch segura o erro para que a página não trave e avisa o usuário com uma mensagem na tela.
    }
}

/* Manipulador de envio do formulário. */
async function tratarEnvioFormulario(evento) {
    evento.preventDefault();//Impede a página de recarregar
    const { valido, dados, erros } = validarFormulario();
    ui.exibirErrosFormulario(erros);//Roda a validação e mostra as mensagens de erro na tela caso existam.
    if (!valido) return;//Se houver erros a função é interrompida
    salvarPerfil(dados);//Se estiver tudo certo, salva o perfil do usuário  e inicia a busca de compatibilidade
    await executarAnalise(dados);
}

// Inicializa a aplicação.
function inicializar() {

    formulario.addEventListener("submit", tratarEnvioFormulario);
    // Limpa o erro de um campo assim que o usuário começa a corrigi-lo
    [campoNome, campoArea, campoHabilidades, campoExperiencia].forEach(

        (campo) => {

            campo.addEventListener("input", () => ui.limparErroDoCampo(campo.id));

        }

    );

    const perfilSalvo = carregarPerfil();

    if (perfilSalvo) {
        ui.preencherFormulario(perfilSalvo);
        // Já executa a análise automaticamente, sem exigir novo cadastro
        executarAnalise(perfilSalvo);
    }
}

document.addEventListener("DOMContentLoaded", inicializar);
//Essa função prepara a página assim que o navegador termina de carregar a estrutura HTML
