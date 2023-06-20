import { ElementRef } from "@angular/core";
import { OperacaoParametros } from "src/app/modelo/operacao/Operacao";
import { OperacaoTipoEnum } from "src/app/modelo/operacao/OperacaoTipoEnum";
import { CorRepository } from "src/app/repository/cor.repository";
import { NumeroUtil } from "src/app/utils/numero-util";
import { Coluna } from "src/app/modelo/entidade/coluna/Coluna";

export abstract class GraficoService{

    protected operacaoTipo:OperacaoTipoEnum;
    borda:number = 20;
    protected corRepository = new CorRepository();
    canvasEl: ElementRef<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;
    coluna:Coluna;
    width = 550;
    height = 450;
    fonte = '12px arial';
    linhaTamanho = 2;
    casasDecimais=2;
    formatador = NumeroUtil.formatador(this.casasDecimais);
    dependeDe?:Coluna;
    
    constructor(
        canvasEl: ElementRef<HTMLCanvasElement>,
        operacaoTipo:OperacaoTipoEnum,
        coluna:Coluna,
        dependeDe?:Coluna
    ){
        this.canvasEl = canvasEl;
        this.operacaoTipo = operacaoTipo;
        this.coluna = coluna;
        this.dependeDe = dependeDe;
    }

    get parametros():OperacaoParametros{ 
        if(this.operacaoTipo===undefined){
            throw Error(`Operacão não definida: coluna ${this.coluna.nome}`);
        }
        return this.coluna.operacoes.find(op=>op.descricao.tipo===this.operacaoTipo).parametros;
    }

    get widthUtil():number{ return this.width - 2*this.borda; }
    get heightUtil():number{ return this.height - 2*this.borda; }

    protected converterCoordenadas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(1,-1);
        this.ctx.translate(this.borda,-1*this.height + this.borda);
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