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

        this.resultado = null;
    }
}