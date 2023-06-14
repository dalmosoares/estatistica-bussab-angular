import { ElementRef } from "@angular/core";
import { FreqDiscr } from "src/app/modelo/freq/FreqDiscr";
import { FreqDiscrItem } from "src/app/modelo/freq/FreqDiscrItem";
import { GraficoService } from "./grafico.service";
import { OpcTipoEnum } from "src/app/modelo/opc/OpcTipoEnum";
import { FreqCont } from "src/app/modelo/freq/FreqCont";
import { Grafico } from "../grafico-modelo/Grafico";

type GraficoBarraItem = {
    rotulo:string,
    cor:string,
    x:number,
    y:number,
    largura:number,
    altura:number
};
export class GraficoBarraService extends GraficoService{

    override borda = 30;
    marcaTamanho = 8;

    dados:FreqDiscrItem[];
    retanguloDistancia = 20;
    graficoItems:GraficoBarraItem[];

    rotuloDistancia=5;
    rotuloDesloc = 15;
    YMaxVirtual:number;
    YMaxVirtualTolerancia = 1;
    yEscala:number;
    yCoordDiv = 0.5;
    yCoordMarca = 1;

    get continua():boolean{ return this.parametros?.continua!=undefined && this.parametros?.continua; }

    constructor(
        grafico:Grafico,
        canvasEl: ElementRef<HTMLCanvasElement>
    ){
        super(OpcTipoEnum.GRAFICO_BARRA,canvasEl,grafico);
        this.dados = new FreqDiscr(this.grafico.coluna.registros,this.parametros?.excluir).freqs;  
        if(this.parametros?.yCoordDiv!=undefined){
            this.yCoordDiv = this.parametros?.yCoordDiv;
        }
        if(this.parametros?.yCoordMarca!=undefined){
            this.yCoordMarca = this.parametros?.yCoordMarca;
        }
    }

    iniciarLocal(): void {
        
    }

    gerarItems(): void {
        if(this.continua){
            if(this.parametros?.intervalos==undefined){
                throw new Error("Erro GraficoBarra com váriavel contínua mas sem intervalos!");
            }
            this.dados = new FreqCont(
                    this.grafico.coluna.registros as number[],
                    this.parametros.intervalos,this.parametros.excluir                
                ).freqs.map(fci=>({
                    valor:fci.pontoMedio,
                    freq:fci.freq,
                    prop:fci.prop,
                    porcent:fci.prop*100
                }));
        }else{
            this.dados = new FreqDiscr(
                this.grafico.coluna.registros,this.parametros?.excluir,this.parametros?.marcarAusentes
            ).freqs;
        }
        const freqMax = Math.max(...this.dados.map(d=>d.freq));
        this.YMaxVirtual = freqMax + this.YMaxVirtualTolerancia;
        this.yEscala = this.YMaxVirtual/this.heightUtil;
        const numRet = this.dados.length;
        const largura = (this.widthUtil - this.retanguloDistancia*(numRet+1))/numRet;
        const cor = this.corRepository.padrao;
        const y = this.linhaTamanho/2;
        this.graficoItems = this.dados.map((f,i)=>{
            const rotulo = f.valor;
            const x = this.retanguloDistancia * (i+1) + largura*i;
            const altura = f.freq/this.yEscala;
            return {rotulo,cor,x,y,largura,altura};
        });
    }

    override eixoX(): void {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.widthUtil, 0);
        this.ctx.stroke();
    }

    override eixoY(): void {
        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(0,this.heightUtil);
        this.ctx.stroke();
    }

    override xMarcarRotular(): void {
    }

    override yMarcarRotular(): void {
        this.ctx.beginPath();
        const numMarcacoes = (this.heightUtil/this.yCoordMarca)*this.yEscala;
        const distancia = this.yCoordMarca/this.yEscala;
        for(let i=1;i<=numMarcacoes;i++){
            const destino = distancia*i;
          this.ctx.moveTo(-1*this.marcaTamanho/2,destino);
          this.ctx.lineTo(this.marcaTamanho/2,destino);
          this.ctx.stroke();
          this.ctx.save();
          this.ctx.translate(0,destino);
          this.ctx.scale(-1,1);
          this.ctx.rotate(-1*Math.PI);
          const txt = (this.yCoordMarca*i).toString();
          const tamanho = this.ctx.measureText(txt).width;
          this.ctx.fillText(txt,-1*tamanho-this.rotuloDistancia,5);
          this.ctx.restore();
        }
    }

    override desenharItems(){
        this.ctx.fillStyle=this.corRepository.padrao;
        this.graficoItems.forEach(item=>{
            this.desenharItem(item);
            this.desenharItemRotulo(item);
        });
    }
      
    private desenharItem(item:GraficoBarraItem){
        this.ctx.fillRect(item.x,item.y,item.largura,item.altura);
    }

    private desenharItemRotulo(item:GraficoBarraItem){
        this.ctx.save();
        const tamanho = this.ctx.measureText(item.rotulo).width;
        const x1 = item.x + (item.largura-tamanho)/2;
        const y1 = -this.rotuloDesloc;
        this.ctx.translate(x1,y1);
        this.ctx.scale(-1,1);
        this.ctx.fillStyle = "black";
        this.ctx.font = this.fonte;
        this.ctx.rotate(-1*Math.PI);
        this.ctx.fillText(item.rotulo,0,0);
        this.ctx.restore();
    }

}