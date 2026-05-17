//Perfis do candidato
const candidatos = [
    { nome: "João Silva", vaga: "Desenvolvedor Front-end React", habilidades: ["HTML", "CSS", "JavaScript", "React", "GitHub", "Trello"], experienciaMeses: 12 },
    { nome: "Ana Julia", vaga: "Desenvolvedor Front-end Junior", habilidades: ["HTML", "CSS", "JavaScript", "GitHub"], experienciaMeses: 6 },
    { nome: "Paulo César", vaga: "Desenvolvedor Front-end React", habilidades: ["HTML", "CSS", "JavaScript", "React", "GitHub", "TypeScript", "Trello"], experienciaMeses: 18 },
    { nome: "Maria Clara", vaga: "Desenvolvedor Front-end Junior", habilidades: ["HTML", "CSS", "GitHub", "Trello"], experienciaMeses: 10 }
];

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
//Uso de Arrays