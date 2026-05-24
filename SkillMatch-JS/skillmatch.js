class Candidato {// Aqui criamos uma classe para cada candidato
    constructor(nome, cargo, habilidades, meses) {//O constructor ele roda automaticamente quando criamos um novo candidato
        this.nome = nome;
        this.cargo = cargo;
        this.habilidades = habilidades;
        this.meses = meses; // corrigido: era "tempoDeExperiencia" mas o parâmetro é "meses"
    }

    exibirResumo() {//no método exibirResumo vai descrever o candidato e seu cargo
        return `${this.nome} atua na área de ${this.cargo}`;
    }

    calcularCompatibilidade(vaga) {//usamos esse método para comparar a habilidade do candidato com os rerequisitos das vagas
        const habilidadesEmComum = this.habilidades.filter(h =>
            vaga.requisitos.includes(h)            //vamos filtrar as habilidades do candidato e verificar se ele atende as requisitos
        );
        const percentual = (habilidadesEmComum.length / vaga.requisitos.length) * 100;//Aqui vamos dividir o total das habilidades em comum pelo total dos requisitos e dividir por 100, para verificar o porcentual
        return Math.round(percentual);//O math serve para arredondar os numeros de porcentagem
    }
}
class Vaga {//Criamos uma classe de vagas para cada objeto
    constructor(empresa, cargo, requisitos, salario, modalidade) { // corrigido: ordem dos parâmetros
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = Array.isArray(requisitos) ? requisitos : [requisitos];//Array is Array serve para criar uma lista
        this.salario = salario;
        this.modalidade = modalidade;
    }

    exibirResumo() {
        return `${this.cargo} na empresa ${this.empresa} | Salário: R$ ${this.salario} | Modalidade: ${this.modalidade} | Requisitos: ${this.requisitos}`;
    }
}

const candidatos = [//Aqui cria-se uma lista de objetos(candidatos)
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

candidatos.push(//Adicionamos um novo candidato
    new Candidato(
        "Carlos Alberto",
        "Programador Front-end / UX/UI",
        ["HTML", "CSS", "JavaScript", "GitHub", "Figma", "Adobe XD"],
        24
    )
);
//Aqui adicionamos as vagas disponiveis
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

//Aqui criamos uma função com Arrow Function
const calcularCompatibilidade = (habilidades, requisitos) => {
    const atendidos = requisitos.filter(req => habilidades.includes(req)).length;
    return Math.round((atendidos / requisitos.length) * 100);
};//filter retornamos só os requisitos que estão nas habilidades

candidatos.forEach(candidato => {
    console.log(`\nCandidato: ${candidato.nome}`);
    //Aqui atribuimos o uso do forEach que percorre cada candidato e percorre todas as vagas, criando uma combinação
    vagas.forEach(vaga => {//Aqui é para descobrir quais habilidades o candidato não possui
        const faltantes = vaga.requisitos.filter(
            req => !candidato.habilidades.includes(req)
        );//Aqui calculamos a compatibilidade
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
console.log('=====================================================================');
//Aqui usamos o método closure para analiza candidatos
const analisarCandidato = (candidato) => (vaga) => {
    const compatibilidade = calcularCompatibilidade(candidato.habilidades, vaga.requisitos);
    const status = compatibilidade >= 50 ? "✅ Aprovado" : "❌ Reprovado";
    console.log(`${status} | ${candidato.nome} → ${vaga.empresa} (${compatibilidade}%)`);
};


candidatos.forEach(candidato => {
    const analisar = analisarCandidato(candidato); // closure criada aqui
    vagas.forEach(analisar);                        // reutilizada para cada vaga
});

// Simulando e usando funções assíncronas para uma busca de vagas em uma API
const buscarVagas = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(vagas), 5000);//Aqui usamos o setTimeout para simular um delay(tempo)
    });
};

const buscarCandidatos = async () => {
    return new Promise((resolve) => {//uso de promisse para simular um delay
        setTimeout(() => resolve(candidatos), 5000);//
    });
};

//Aqui usamos meu filter, meu candidato e processarCandidatos
const meuFilter = (arr, fn) => arr.filter(fn);//percorre o array e retorna true
const meuMap = (arr, fn) => arr.map(fn);//percorre o array e transforma cada item em função
console.log('=====================================================================');
//Aqui usamos a função processarCandidatos, que junta tudo, busca candidatos, filtra os experiente, calcula a compatibilidade e exibi apenas os aprovados
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


