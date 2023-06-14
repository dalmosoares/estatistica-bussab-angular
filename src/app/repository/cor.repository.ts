import { Injectable } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class CorRepository{

    private _indicePadrao = 0;

    private _lista  = [
        "#c8c8e9",
        "#71c8e2",
        "#00ff00",
        "#ff0000",
        "#edd1c7",
        "#ccff50",
        "#e3b8da",
        "#e5acc6",
        "#ebb39e",
        "#e1ca9f",
    ];

    corPorIndice(indice:number):string{
        return this.lista[indice];
    }

    get lista():string[]{
        return this._lista;
    }

    get padrao():string{
        return this.lista[this._indicePadrao];
    }

    get preto():string{
        return "#000";
    }
}