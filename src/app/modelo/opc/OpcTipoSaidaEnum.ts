export enum OpcTipoSaidaEnum {
    TABELA = "tabela",
    GRAFICO = "grafico",
    RAMOSFOLHAS = "ramosfolhas"
}

export namespace OpcTipoSaidaEnum{
    export function values():OpcTipoSaidaEnum[] {
        return Object.entries(this).filter(entry => typeof entry[1] !== 'function').map(e=>e[1]) as OpcTipoSaidaEnum[];
    }
}