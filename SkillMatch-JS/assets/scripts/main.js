import {
    Vaga,
    VagaFrontEnd,
    criarCandidato,
    analisarTodasAsVagas,
    encontrarMelhorVaga,
    gerarRecomendacaoDeEstudo,
    criarContadorDeAnalises
} from "./motor.js";

import { buscarVagas, salvarPerfil, carregarPerfil } from './dados.js';

import * as ui from "./ui.js";



// ---------- Referências ao formulário ----------

const formulario = document.getElementById("form-perfil");

const campoNome = document.getElementById("nome");

const campoArea = document.getElementById("area");

const campoHabilidades = document.getElementById("habilidades");

const campoExperiencia = document.getElementById("experiencia");



// Closure: contador de análises feitas nesta sessão (não persiste)

const contarAnalise = criarContadorDeAnalises();


// VALIDAÇÃO DO FORMULÁRIO

function converterHabilidadesParaArray(texto) {

    return texto

        .split(",")

        .map((item) => item.trim())

        .filter((item) => item.length > 0);

}

/*
 * Valida os campos do formulário.

 * @returns {{valido: boolean, dados: object, erros: object}}

 */

function validarFormulario() {

    const nome = campoNome.value.trim();

    const area = campoArea.value;

    const habilidades = converterHabilidadesParaArray(campoHabilidades.value);

    const experienciaMeses = Number(campoExperiencia.value) || 0;



    const erros = { nome: "", area: "", habilidades: "", experiencia: "" };

    let valido = true;



    if (nome.length === 0) {

        erros.nome = "O nome é obrigatório.";

        valido = false;

    } else if (nome.length < 3) {

        erros.nome = "O nome deve ter no mínimo 3 caracteres.";

        valido = false;

    }

    if (area.length === 0) {

        erros.area = "Selecione uma área de atuação.";

        valido = false;

    }

    if (habilidades.length === 0) {

        erros.habilidades = "Informe ao menos uma habilidade.";

        valido = false;

    }

    if (campoExperiencia.value && experienciaMeses < 0) {

        erros.experiencia = "A experiência não pode ser negativa.";

        valido = false;

    }

    return {

        valido,

        dados: { nome, area, habilidades, experienciaMeses },

        erros

    };

}

// FLUXO PRINCIPAL
/*
 * Busca as vagas, transforma em instâncias do motor (Vaga/VagaFrontEnd),

 * calcula compatibilidade e manda renderizar. Trata os 3 estados do fetch.

 * @param {object} perfil

 */

async function executarAnalise(perfil) {

    ui.exibirCarregando();

    try {

        const vagasBrutas = await buscarVagas();

        if (!Array.isArray(vagasBrutas) || vagasBrutas.length === 0) {

            ui.exibirVazio();

            return;

        }

        // Dados (JSON) viram regras: cada objeto vira uma instância de Vaga.

        // Vagas de área "Front-end" usam a subclasse especializada.

        const vagas = vagasBrutas.map((dadosVaga) =>

            dadosVaga.area === "Front-end"

                ? new VagaFrontEnd(dadosVaga)

                : new Vaga(dadosVaga)

        );

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

        );

        const recomendacao = gerarRecomendacaoDeEstudo(melhorVaga);

        const totalAnalises = contarAnalise();

        ui.renderizarResultados(vagasAnalisadas, melhorVaga, recomendacao, totalAnalises);

    } catch (erro) {

        console.error("Erro ao analisar compatibilidade:", erro);

        ui.exibirErroDeCarregamento(

            "Erro ao carregar as vagas. Tente novamente mais tarde."

        );

    }

}

/* Manipulador de envio do formulário. */

async function tratarEnvioFormulario(evento) {

    evento.preventDefault();

    const { valido, dados, erros } = validarFormulario();

    ui.exibirErrosFormulario(erros);

    if (!valido) return;

    salvarPerfil(dados);

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

