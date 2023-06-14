import { ElementRef } from "@angular/core";
import { Parametros } from "src/app/modelo/opc/Parametros";
import { OpcTipoEnum } from "src/app/modelo/opc/OpcTipoEnum";
import { CorRepository } from "src/app/repository/cor.repository";
import { Grafico } from "../grafico-modelo/Grafico";
import { NumeroUtil } from "src/app/utils/numero-util";

export abstract class GraficoService{

    tipo:OpcTipoEnum;
    canvasEl: ElementRef<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;
    grafico:Grafico;
    width = 550;
    height = 400;
    fonte = '12px arial';
    linhaTamanho = 2;
    borda = 20;
    parametros?:Parametros;
    protected corRepository = new CorRepository();
    casasDecimais=2;
    formatador = NumeroUtil.formatador(this.casasDecimais);


    constructor(
        tipo:OpcTipoEnum,
        canvasEl: ElementRef<HTMLCanvasElement>,
        grafico:Grafico
    ){
        this.tipo = tipo;
        this.canvasEl = canvasEl;
        this.grafico = grafico;
        this.parametros = this.grafico.coluna.operacoes.find(op=>op.tipo===this.tipo).parametros;
        this.desenhar();
    }

    get widthUtil():number{ return this.width - 2*this.borda; }
    get heightUtil():number{ return this.height - 2*this.borda; }

    protected converterCoordenadas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(1,-1);
        this.ctx.translate(this.borda,-1*this.height + this.borda);
    }

    afterViewInit(){
        this.desenhar();
    }

    desenhar(){
        this.iniciar();
        this.iniciarLocal();
        this.gerarItems();
        this.eixoX();
        this.eixoY();
        this.xMarcarRotular();
        this.yMarcarRotular();
        this.desenharItems();
    }

    private iniciar(){
        this.canvasEl.nativeElement.setAttribute("width",this.width.toString());
        this.canvasEl.nativeElement.setAttribute("height",this.height.toString());
        this.ctx = this.canvasEl.nativeElement.getContext('2d');
        this.ctx.lineWidth = this.linhaTamanho;
        this.ctx.font = this.fonte;
        this.converterCoordenadas();
    }

    abstract iniciarLocal():void;
    abstract gerarItems():void;
    abstract eixoX():void;
    abstract eixoY():void;
    abstract xMarcarRotular():void;
    abstract yMarcarRotular():void;
    abstract desenharItems():void;

    linha(x1:number,y1:number,x2:number,y2:number){
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

}