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

class Vaga {
    constructor(empresa, cargo, requisitos, salario, modalidade) {
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = requisitos;
        this.salario = salario;
        this.modalidade = modalidade;
    }
}
/*
//Uso de herança
class VagaFrontEnd extends Vaga {
    constructor(id, empresa, cargo, requisitos, salario, modalidade, tecnologiaPrincipal) {
        // O super chama o construtor da classe Vaga
        super(id, empresa, cargo, requisitos, salario, modalidade);
        this.tecnologiaPrincipal = tecnologiaPrincipal;
    }
}
*/
