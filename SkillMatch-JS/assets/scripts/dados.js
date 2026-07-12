//Cria uma constante chamada CAMINHO_VAGAS.
const CAMINHO_VAGAS = "./assets/dados/vagas.json";
const CHAVE_PERFIL = "skillmatch:perfil";//Essa constante guarda o nome que será usado dentro do localStorage, que serve como uma gaveta do navegador.
//O texto "skillmatch:perfil" funciona como a etiqueta dessa gaveta.

/**
 * Esta função retorna uma Promise contendo um Array.
 * @returns {Promise<Array>}
 */
export async function buscarVagas() { //export=pode ser usado  em outros arquivos
    //async: busca dados do servidor e consulta Api
    //cria-se uma função chamada buscarVagas
    const resposta = await fetch(CAMINHO_VAGAS);// Aqui faz se uso do fetch para buscar o arquivo JSON com as vagas. 
    //O await faz com que a execução espere a resposta do servidor antes de continuar.
    if (!resposta.ok) {
        throw new Error(`Falha ao buscar vagas (status ${resposta.status})`);
    }//Aqui o programa lança um erro(404).

    const vagas = await resposta.json();//converte o JSON em um array
    return vagas;//Devolve o resultado para quem chamou a função.
}

/**
 * Salva o perfil do candidato no localStorage.
 * @param {object} perfil
 */
export function salvarPerfil(perfil) {
    try {          //setItem: recebe 2 parametros, a chave e o valor
        localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));//O método JSON.stringify() faz exatamente essa conversão de objeto para texto.
        //O localStorage funciona como um pequeno banco de dados do navegador.
        //Ele guarda informações mesmo após fechar a página.        
    } catch (erro) {
        //Se acontecer algum problema durante o try, o programa não trava. Em vez disso, ele entra no catch, onde o erro é tratado.
        console.error("Não foi possível salvar o perfil no localStorage:", erro);
    }
}

export function carregarPerfil() {//Essa função faz o caminho inverso: ela lê o perfil salvo.
    try {
        const bruto = localStorage.getItem(CHAVE_PERFIL);
        //getItem() procura o valor associado à chave "skillmatch:perfil".
        if (bruto === null) {
            return null; //Se não houver nenhum perfil salvo, getItem() retorna null.
        }

        return JSON.parse(bruto);// O JSON.parse() faz a conversão de texto para objeto.
    } catch (erro) {
        console.error("Perfil salvo estava corrompido, ignorando:", erro);
        return null;
    }
}