
/**
 * Representa uma vaga de emprego genérica.
 * Concentra a regra de cálculo de compatibilidade em torno de "this",
 * para que subclasses possam especializar o comportamento (herança).
 */
export class Vaga {
    constructor({
        id,
        empresa,
        cargo,
        area,
        requisitos,
        salario,
        modalidade,
        experienciaRequerida
    }) {
        this.id = id;
        this.empresa = empresa;
        this.cargo = cargo;
        this.area = area;
        this.requisitos = requisitos;
        this.salario = salario;
        this.modalidade = modalidade;
        this.experienciaRequerida = experienciaRequerida ?? 0;

        // Preenchido depois que calcularCompatibilidade() é chamado
        this.resultado = null;
    }

    /**
     * Compara as habilidades do candidato com os requisitos desta vaga.
     * habilidadesEncontradas / totalDeRequisitos * 100
     * @param {string[]} habilidadesCandidato
     * @returns {{encontradas: string[], faltantes: string[], percentual: number, classificacao: string}}
     */
    calcularCompatibilidade(habilidadesCandidato) {
        const candidatoNormalizado = habilidadesCandidato.map((h) =>
            h.toLowerCase().trim()
        );

        const encontradas = this.requisitos.filter((requisito) =>
            candidatoNormalizado.includes(requisito.toLowerCase())
        );

        const faltantes = this.requisitos.filter(
            (requisito) => !candidatoNormalizado.includes(requisito.toLowerCase())
        );

        const percentual = Math.round(
            (encontradas.length / this.requisitos.length) * 100
        );

        this.resultado = { encontradas, faltantes, percentual };
        this.resultado.classificacao = this.classificar();

        return this.resultado;
    }

    /** Classifica a vaga em Alta / Média / Baixa, a partir do último cálculo. */
    classificar() {
        const percentual = this.resultado ? this.resultado.percentual : 0;
        if (percentual >= 80) return "Alta";
        if (percentual >= 50) return "Média";
        return "Baixa";
    }

    /** Texto de exibição padrão do card. Subclasses podem sobrescrever. */
    rotulo() {
        return `${this.cargo} · ${this.empresa}`;
    }
}

/**
 * Vaga especializada em front-end.
 * Por que existe herança aqui: vagas de front-end têm uma "stack"
 * principal (ex.: React). Quando o candidato já domina essa stack,
 * isso pesa mais do que apenas contar requisitos genéricos — por isso
 * a subclasse SOBRESCREVE calcularCompatibilidade para aplicar um bônus,
 * e sobrescreve rotulo() para deixar a stack visível no card.
 */
export class VagaFrontEnd extends Vaga {
    constructor(dadosVaga) {
        super(dadosVaga);
        this.stack = dadosVaga.stack || "Não informado";
    }

    calcularCompatibilidade(habilidadesCandidato) {
        // Reaproveita o cálculo padrão da classe-mãe (this.requisitos)
        const resultadoBase = super.calcularCompatibilidade(habilidadesCandidato);

        const candidatoNormalizado = habilidadesCandidato.map((h) =>
            h.toLowerCase().trim()
        );
        const dominaAStackPrincipal = candidatoNormalizado.includes(
            this.stack.toLowerCase()
        );

        if (dominaAStackPrincipal) {
            const BONUS_STACK = 10;
            resultadoBase.percentual = Math.min(
                100,
                resultadoBase.percentual + BONUS_STACK
            );
            resultadoBase.classificacao = this.classificar();
        }

        return resultadoBase;
    }
    rotulo() {
        return `${this.cargo} · ${this.empresa} (Stack: ${this.stack})`;
    }
}

/**
 * Cria o objeto do candidato a partir dos dados do formulário.
 * @param {{nome: string, area: string, habilidades: string[], experienciaMeses: number}} dados
 */
export function criarCandidato({ nome, area, habilidades, experienciaMeses }) {
    return {
        nome,
        area,
        habilidades,
        experienciaMeses: experienciaMeses ?? 0
    };
}

/**
 * Analisa uma lista de vagas contra as habilidades do candidato.
 * Recebe um CALLBACK opcional, chamado a cada vaga analisada — útil,
 * por exemplo, para dar feedback em tempo real na interface.
 * @param {Vaga[]} vagas
 * @param {string[]} habilidadesCandidato
 * @param {(vaga: Vaga, resultado: object) => void} [aoAnalisarVaga] callback
 * @returns {Vaga[]} as próprias vagas, agora com `.resultado` preenchido
 */
export function analisarTodasAsVagas(vagas, habilidadesCandidato, aoAnalisarVaga) {
    return vagas.map((vaga) => {
        const resultado = vaga.calcularCompatibilidade(habilidadesCandidato);

        if (typeof aoAnalisarVaga === "function") {
            aoAnalisarVaga(vaga, resultado); // uso do callback
        }

        return vaga;
    });
}

/**
 * Encontra a vaga de maior compatibilidade.
 * Em caso de empate no percentual, usa a experiência do candidato como
 * critério de desempate: vence a vaga cuja experiência exigida está
 * mais próxima da experiência que o candidato já tem.
 * @param {Vaga[]} vagasAnalisadas
 * @param {number} experienciaCandidato em meses
 * @returns {Vaga|null}
 */
export function encontrarMelhorVaga(vagasAnalisadas, experienciaCandidato) {
    if (vagasAnalisadas.length === 0) return null;

    return vagasAnalisadas.reduce((melhor, atual) => {
        if (!melhor) return atual;

        if (atual.resultado.percentual > melhor.resultado.percentual) {
            return atual;
        }

        if (atual.resultado.percentual === melhor.resultado.percentual) {
            const distanciaAtual = Math.abs(
                atual.experienciaRequerida - experienciaCandidato
            );
            const distanciaMelhor = Math.abs(
                melhor.experienciaRequerida - experienciaCandidato
            );
            return distanciaAtual < distanciaMelhor ? atual : melhor;
        }

        return melhor;
    }, null);
}

/**
 * Gera uma recomendação de estudo com base na habilidade que mais falta
 * na vaga de melhor compatibilidade.
 * @param {Vaga|null} melhorVaga
 */
export function gerarRecomendacaoDeEstudo(melhorVaga) {
    if (!melhorVaga) {
        return "Nenhuma vaga disponível para gerar uma recomendação no momento.";
    }

    if (melhorVaga.resultado.faltantes.length === 0) {
        return `Parabéns! Você já atende a todos os requisitos de "${melhorVaga.cargo}".`;
    }

    const [habilidadePrioritaria] = melhorVaga.resultado.faltantes;
    return `Para aumentar sua compatibilidade com "${melhorVaga.cargo}", priorize estudar ${habilidadePrioritaria}.`;
}

/** Verifica se o candidato atende 100% de TODAS as vagas analisadas. */
export function todasAsVagasForamAtendidas(vagasAnalisadas) {
    return vagasAnalisadas.every((vaga) => vaga.resultado.percentual === 100);
}

/** Retorna a primeira vaga encontrada com classificação "Alta". */
export function primeiraVagaAltaCompatibilidade(vagasAnalisadas) {
    return vagasAnalisadas.find((vaga) => vaga.resultado.classificacao === "Alta");
}

/**
 * Fábrica de um contador de análises feitas na sessão.
 * Usa CLOSURE: a variável `total` fica "presa" na função retornada,
 * sem ser acessível/alterável de fora.
 * @returns {() => number} função que incrementa e retorna o novo total
 */
export function criarContadorDeAnalises() {
    let total = 0;
    return function incrementar() {
        total += 1;
        return total;
    };
}