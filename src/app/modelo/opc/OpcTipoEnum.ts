export enum OpcTipoEnum {
    LISTA = "lista",
    FREQDISCRETA = "freqdiscreta",
    FREQCONTINUA = "freqcontinua",
    GRAFICO_BARRA = "grafico_barra",
    GRAFICO_PIZZA = "grafico_pizza",
    GRAFICO_DISPERSAO_UNIDIMENSIONAL1 = "grafico_dispersao_unidimensional1",
    GRAFICO_DISPERSAO_UNIDIMENSIONAL2 = "grafico_dispersao_unidimensional2",
    GRAFICO_DISPERSAO_UNIDIMENSIONAL3 = "grafico_dispersao_unidimensional3",
    HISTOGRAMA = "histograma",
    RAMOSFOLHAS = "ramosfolhas"
}

export namespace OpcTipoEnum{
    export function values():OpcTipoEnum[] {
        return Object.entries(this).filter(entry => typeof entry[1] !== 'function').map(e=>e[1]) as OpcTipoEnum[];
    }
}