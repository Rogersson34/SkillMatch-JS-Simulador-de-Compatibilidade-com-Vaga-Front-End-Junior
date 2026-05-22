class Candidato {
    constructor(nome, cargo, habilidades, meses) {
        this.nome = nome;
        this.cargo = cargo;
        this.habilidades = habilidades;
        this.meses = meses; // corrigido: era "tempoDeExperiencia" mas o parâmetro é "meses"
    }

    exibirResumo() {
        return `${this.nome} atua na área de ${this.cargo}`;
    }

    calcularCompatibilidade(vaga) {
        const habilidadesEmComum = this.habilidades.filter(h =>
            vaga.requisitos.includes(h)
        );
        const percentual = (habilidadesEmComum.length / vaga.requisitos.length) * 100;
        return Math.round(percentual);
    }
}
class Vaga {
    constructor(empresa, cargo, requisitos, salario, modalidade) { // corrigido: ordem dos parâmetros
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = Array.isArray(requisitos) ? requisitos : [requisitos];
        this.salario = salario;
        this.modalidade = modalidade;
    }

    exibirResumo() {
        return `${this.cargo} na empresa ${this.empresa} | Salário: R$ ${this.salario} | Modalidade: ${this.modalidade} | Requisitos: ${this.requisitos}`;
    }
}

const candidatos = [
    new Candidato(
        "Matheus Silva",
        "Desenvolvimento de Software",
        ["HTML", "CSS", "JavaScript", "GitHub", "Trello", "Python", "Java"],
        24
    ),
    new Candidato(
        "Felipe Santos",
        "Programador Front-end",
        ["HTML", "CSS", "JavaScript"],
        12
    ),
    new Candidato(
        "Ana Julia",
        "Programador Front-end Junior",
        ["HTML", "CSS", "JavaScript", "GitHub"],
        6
    ),
    new Candidato(
        "Paulo César",
        "Desenvolvedor Front-end React",
        ["HTML", "CSS", "JavaScript", "React", "TypeScript", "GitHub", "Trello"],
        18
    ),
    new Candidato(
        "Maria Clara",
        "Desenvolvedor Front-end Junior",
        ["HTML", "CSS", "GitHub", "Trello"],
        10
    ),
];

candidatos.push(
    new Candidato(
        "Carlos Alberto",
        "Programador Front-end / UX/UI",
        ["HTML", "CSS", "JavaScript", "GitHub", "Figma", "Adobe XD"],
        24
    )
);

const vagas = [
    new Vaga(
        "StarsRH",
        "Programador Front-End Júnior",
        ["JavaScript", "GitHub", "React", "TypeScript", "Node"],
        3000,
        "Híbrido"
    ),
    new Vaga(
        "AgTech",
        "Desenvolvedor JavaScript / React",
        ["JavaScript", "React", "Node", "TypeScript", "GitHub", "Trello"],
        3200,
        "Remoto"
    ),
    new Vaga(
        "NovosTalentos",
        "Programador Front-End Júnior",
        ["JavaScript", "GitHub", "Trello"],
        1800,
        "Presencial"
    ),
    new Vaga(
        "DesignHub",
        "Designer UX/UI",
        ["Java Script", "Figma", "Trello", "Adobe XD"],
        2500,
        "Remoto"
    )
];

const calcularCompatibilidade = (habilidades, requisitos) => {
    const atendidos = requisitos.filter(req => habilidades.includes(req)).length;
    return Math.round((atendidos / requisitos.length) * 100);
};

candidatos.forEach(candidato => {
    console.log(`\nCandidato: ${candidato.nome}`);

    vagas.forEach(vaga => {
        const faltantes = vaga.requisitos.filter(
            req => !candidato.habilidades.includes(req)
        );
        //criando variavel
        const compatibilidade = calcularCompatibilidade(
            candidato.habilidades,
            vaga.requisitos
        );

        // Classificar a compatibilidade usando if e else
        let classificacao = "";

        if (compatibilidade >= 80) {
            classificacao = "Alta Compatibilidade(Candidato atende todos os requisitos da vaga!) ✅";
        } else if (compatibilidade >= 50) {
            classificacao = "Média Compatibilidade (Forte candidato) ⚠️";

        } else {
            classificacao = "Baixa Compatibilidade (Não atende aos requisitos da vaga) ❌";
        }
        // ------------------------------------------

        console.log(`Vaga: ${vaga.empresa} - ${vaga.cargo}`);
        console.log(`Compatibilidade: ${compatibilidade}% - [${classificacao}]`);//Encontrar a vaga com maior compatibilidade
        console.log(`Habilidades Faltantes: ${faltantes.join(", ") || "Nenhum"}`);//Listar Habilidades faltantes
        console.log(`Recomendação de Estudo: ${vaga.requisitos.join(", ") || "Nenhum"}`);//Gerar uma recomendação de estudo
    });
});

const analisarCandidato = (candidato) => (vaga) => {
    const compatibilidade = calcularCompatibilidade(candidato.habilidades, vaga.requisitos);
    const status = compatibilidade >= 50 ? "✅ Aprovado" : "❌ Reprovado";
    console.log(`${status} | ${candidato.nome} → ${vaga.empresa} (${compatibilidade}%)`);
};

// Uso
candidatos.forEach(candidato => {
    const analisar = analisarCandidato(candidato); // closure criada aqui
    vagas.forEach(analisar);                        // reutilizada para cada vaga
});

// Simulando uma busca de vagas em uma API
const buscarVagas = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(vagas), 1000);
    });
};

const buscarCandidatos = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(candidatos), 1000);
    });
};

// ✅ Definir ANTES de processarCandidatos
const meuFilter = (arr, fn) => arr.filter(fn);
const meuMap = (arr, fn) => arr.map(fn);
const processarCandidatos = async () => {
    try {
        console.log("🔍 Buscando candidatos aprovados...");
        const resultado = await buscarCandidatos();

        meuFilter(resultado, c => c.meses >= 10).forEach(candidato => {
            meuMap(vagas, vaga => ({
                empresa: vaga.empresa,
                compatibilidade: calcularCompatibilidade(candidato.habilidades, vaga.requisitos)
            })).forEach(({ empresa, compatibilidade }) => {

                // ✅ Só exibe se compatibilidade for >= 50% (aprovado)
                if (compatibilidade >= 50) {
                    console.log(`✅ APROVADO | ${candidato.nome} → ${empresa} | ${compatibilidade}%`);
                }
            });
        });

    } catch (error) {          // ← fecha o try
        console.log(`❌ Erro: ${error.message}`);
    }
};                             // ← fecha a função

processarCandidatos();


