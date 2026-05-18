const candidatos = [
    {
        nome: "João Silva",
        vaga: "Desenvolvedor Front-end React",
        habilidades: ["HTML", "CSS", "JavaScript", "React"],
        experienciaMeses: 12
    },
    {
        nome: "Maria Souza",
        vaga: "Desenvolvedor Back-end Node",
        habilidades: ["Node.js", "Express", "MongoDB"],
        experienciaMeses: 24
    }
];

// Altera o nome de "João Silva" para "João Santos"
const candidatosAtualizados = candidatos.map(candidato => {
    if (candidato.nome === "João Silva") {
        return { ...candidato, nome: "João Santos" }; // spread mantém o resto
    }
    return candidato;
});
console.log(candidatos)
console.log(candidatosAtualizados[0].nome); // "João Santos"

// ============================================================
//  CLASSE BASE — Pessoa
// ============================================================
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }

    apresentar() {
        return `Olá, meu nome é ${this.nome}.`;
    }
}


// ============================================================
//  HERANÇA 1 — Candidato estende Pessoa
// ============================================================
class Candidato extends Pessoa {
    constructor(nome, vaga, habilidades, experienciaMeses) {
        super(nome); // chama o construtor da classe Pessoa
        this.vaga = vaga;
        this.habilidades = habilidades;
        this.experienciaMeses = experienciaMeses;
    }

    // Retorna quantos meses de experiência em formato legível
    get experiencia() {
        const anos = Math.floor(this.experienciaMeses / 12);
        const meses = this.experienciaMeses % 12;
        if (anos === 0) return `${meses} mês(es)`;
        if (meses === 0) return `${anos} ano(s)`;
        return `${anos} ano(s) e ${meses} mês(es)`;
    }

    // Calcula compatibilidade com uma vaga (%)
    calcularCompatibilidade(vaga) {
        const atendidos = vaga.requisitos.filter(req =>
            this.habilidades.includes(req)
        ).length;
        return Math.round((atendidos / vaga.requisitos.length) * 100);
    }

    // Retorna habilidades que faltam para uma vaga
    habilidadesFaltantes(vaga) {
        return vaga.requisitos.filter(req => !this.habilidades.includes(req));
    }

    // Classificação textual da compatibilidade
    classificar(vaga) {
        const pct = this.calcularCompatibilidade(vaga);
        if (pct === 100) return "Match Perfeito 🚀";
        if (pct >= 80) return "Alta Compatibilidade ✅";
        if (pct >= 50) return "Média Compatibilidade ⚠️";
        return "Baixa Compatibilidade ❌";
    }

    // Exibe resumo do candidato em relação a uma vaga
    analisarVaga(vaga) {
        const pct = this.calcularCompatibilidade(vaga);
        const faltantes = this.habilidadesFaltantes(vaga);

        console.log(`\n👤 Candidato : ${this.nome}`);
        console.log(`🏢 Empresa   : ${vaga.empresa} — ${vaga.cargo}`);
        console.log(`📊 Compat.   : ${pct}% — ${this.classificar(vaga)}`);
        console.log(`🔧 Faltantes : ${faltantes.length ? faltantes.join(", ") : "Nenhuma"}`);
        console.log(`📚 Estudar   : ${vaga.requisitos.join(", ")}`);
    }

    apresentar() {
        // Sobrescreve o método da classe pai com informações extras
        return `${super.apresentar()} Estou me candidatando para ${this.vaga} com ${this.experiencia} de experiência.`;
    }
}


// ============================================================
//  HERANÇA 2 — CandidatoSenior estende Candidato
//  Adiciona pretensão salarial e validação de senioridade
// ============================================================
class CandidatoSenior extends Candidato {
    constructor(nome, vaga, habilidades, experienciaMeses, pretensaoSalarial) {
        super(nome, vaga, habilidades, experienciaMeses); // chama Candidato
        this.pretensaoSalarial = pretensaoSalarial;
    }

    // Verifica se o salário da vaga atende à pretensão
    salarioCompativel(vaga) {
        return vaga.salario >= this.pretensaoSalarial;
    }

    // Sobrescreve analisarVaga para incluir info salarial
    analisarVaga(vaga) {
        super.analisarVaga(vaga); // reutiliza análise do Candidato
        const ok = this.salarioCompativel(vaga);
        console.log(`💰 Salário   : R$ ${vaga.salario} | Pretensão: R$ ${this.pretensaoSalarial} — ${ok ? "Compatível ✅" : "Abaixo da pretensão ❌"}`);
    }

    apresentar() {
        return `${super.apresentar()} Minha pretensão salarial é R$ ${this.pretensaoSalarial}.`;
    }
}

