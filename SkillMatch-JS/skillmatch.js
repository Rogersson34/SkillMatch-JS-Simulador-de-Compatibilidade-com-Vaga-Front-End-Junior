//Perfis do candidato
const candidatos = [
    { nome: "João Silva", vaga: "Desenvolvedor Front-end React", habilidades: ["HTML", "CSS", "JavaScript", "React", "GitHub", "Trello"], experienciaMeses: 12 },
    { nome: "Ana Julia", vaga: "Desenvolvedor Front-end Junior", habilidades: ["HTML", "CSS", "JavaScript", "GitHub"], experienciaMeses: 6 },
    { nome: "Paulo César", vaga: "Desenvolvedor Front-end React", habilidades: ["HTML", "CSS", "JavaScript", "React", "GitHub", "TypeScript", "Trello"], experienciaMeses: 18 },
    { nome: "Maria Clara", vaga: "Desenvolvedor Front-end Junior", habilidades: ["HTML", "CSS", "GitHub", "Trello"], experienciaMeses: 10 }
];
//Uso do Push para adicionar um novo candidato
candidatos.push({
    nome: "Carlos Alberto",
    vaga: "UX/UI",
    habilidades: ["Figma", "Trello"],
    experienciaMeses: 6
});


//Listar as vagas
const vagas = [
    { id: 1, empresa: "StarsRH", cargo: "Programador Front-End Júnior", requisitos: ["JavaScript", "GitHub", "React", "Node"], salario: 3000, modalidade: "Híbrido" },
    { id: 2, empresa: "AgTech", cargo: "Desenvolvedor JavaScript, React", requisitos: ["JavaScript", "React", "Node", "TypeScript", "GitHub", "Trello"], salario: 3200, modalidade: "Remoto" },
    { id: 3, empresa: "NovosTalentos", cargo: "Programador Front-End Júnior", requisitos: ["JavaScript", "GitHub", "Trello"], salario: 1800, modalidade: "Presencial" },

];

// Calcular compatibilidade com cada vaga
const calcularCompatibilidade = (habilidades, requisitos) => {
    const atendidos = requisitos.filter(req => habilidades.includes(req)).length;
    return Math.round((atendidos / requisitos.length) * 100);
};

candidatos.forEach(candidato => {
    console.log(`\nCandidato: ${candidato.nome}`);

    // Retorna habilidades que faltam para uma vaga
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

        if (compatibilidade === 100) {
            classificacao = "Match Perfeito, candidato atende todos os requisitos! 🚀";
        } else if (compatibilidade >= 80) {
            classificacao = "Alta Compatibilidade (Forte candidato) ✅";
        } else if (compatibilidade >= 50) {
            classificacao = "Média Compatibilidade (Candidato atende alguns requisitos) ⚠️";
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

// Metodo de Array: uso do filter
const candidatosFiltrados = candidatos.filter(candidato => {
    return candidato.nome !== "João Silva" && candidato.nome !== "Ana Julia" && candidato.nome !== "Maria Clara";
});

console.log(candidatosFiltrados);

//Map - Filter e Reduce
function meuMap(array, callback) {
    const novoArray = [];

    for (let i = 0; i < array.length; i++) {
        novoArray.push(callback(array[i], i, array));
    }

    return novoArray;
}

function meuFilter(array, callback) {
    const novoArray = [];

    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            novoArray.push(array[i]);
        }
    }

    return novoArray;
}
//uso do reduce
function meuReduce(array, callback, valorInicial) {
    let acumulador = valorInicial;
    let inicio = 0;

    if (acumulador === undefined) {
        acumulador = array[0];
        inicio = 1;
    }

    for (let i = inicio; i < array.length; i++) {
        acumulador = callback(acumulador, array[i], i, array);
    }

    return acumulador;
}

//Uso de uma classe e Uso do This
class Vaga {
    constructor(empresa, cargo, requisitos, salario, modalidade) {
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = requisitos;
        this.salario = salario;
        this.modalidade = modalidade;
    }

    exibirResumo() {
        return `${this.cargo} na empresa ${this.empresa}`;
    }
    createExampleObject() {
        return {
            exampleKey: 'exampleValue'
        };
    }
}

//uso do callback
