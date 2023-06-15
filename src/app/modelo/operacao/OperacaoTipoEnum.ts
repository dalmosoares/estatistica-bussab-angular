export enum OperacaoTipoEnum {
    LISTA = "lista",
    FREQDISCRETA = "freqdiscreta",
    FREQCONTINUA = "freqcontinua",
    GRAFICO_BARRA = "grafico_barra",
    GRAFICO_PIZZA = "grafico_pizza",
    GRAFICO_DISPERSAO_UNIDIMENSIONAL1 = "grafico_dispersao_unidimensional1",
    GRAFICO_DISPERSAO_UNIDIMENSIONAL2 = "grafico_dispersao_unidimensional2",
    GRAFICO_DISPERSAO_UNIDIMENSIONAL3 = "grafico_dispersao_unidimensional3",
    GRAFICO_LIGADO = "grafico_ligado",
    HISTOGRAMA = "histograma",
    RAMOSFOLHAS = "ramosfolhas"
}

export namespace OperacaoTipoEnum{
    export function values():OperacaoTipoEnum[] {
        return Object.entries(this).filter(entry => typeof entry[1] !== 'function').map(e=>e[1]) as OperacaoTipoEnum[];
    }
}