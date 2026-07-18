
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

/*
 *Vaga especializada em front-end.
 *Temos uma herança aqui: vagas de front-end têm uma "stack"
 */
export class VagaFrontEnd extends Vaga {
    constructor(dadosVaga) {
        super(dadosVaga);
        this.stack = dadosVaga.stack || "Não informado";
    }

    /* Quando o candidato já domina essa stack,
  *isso pesa mais do que apenas contar requisitos genéricos — por isso
  *a subclasse SOBRESCREVE calcularCompatibilidade para aplicar um bônus,
  *e sobrescreve rotulo() para deixar a stack visível no card.*/
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
 */
export function criarCandidato({ nome, area, habilidades, experienciaMeses }) {
    return {
        nome,
        area,
        habilidades,
        experienciaMeses: experienciaMeses ?? 0
    };
}

//Encontra a vaga de maior compatibilidade.
export function analisarTodasAsVagas(vagas, habilidadesCandidato, callback) {
    return vagas.map(vaga => {
        const res = vaga.calcularCompatibilidade(habilidadesCandidato);

        if (callback) {
            callback(vaga, res);
        }
        return vaga;
    });
}

/*Em caso de empate no percentual, usa a experiência do candidato como
critério de desempate: vence a vaga cuja experiência exigida está
 mais próxima da experiência que o candidato já tem.*/
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
 na vaga de melhor compatibilidade.
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
  Fábrica de um contador de análises feitas na sessão.
 Usa CLOSURE: a variável `total` fica "presa" na função retornada,
 sem ser acessível/alterável de fora.
  função que incrementa e retorna o novo total
 */
export function criarContadorDeAnalises() {
    let total = 0;
    return function incrementar() {
        total += 1;
        return total;
    };
}