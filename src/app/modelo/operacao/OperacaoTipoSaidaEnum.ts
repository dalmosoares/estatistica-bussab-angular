export enum OperacaoTipoSaidaEnum {
    TABELA = "tabela",
    GRAFICO = "grafico",
    RAMOSFOLHAS = "ramosfolhas"
}

export namespace OperacaoTipoSaidaEnum{
    export function values():OperacaoTipoSaidaEnum[] {
        return Object.entries(this).filter(entry => typeof entry[1] !== 'function').map(e=>e[1]) as OperacaoTipoSaidaEnum[];
    }
}