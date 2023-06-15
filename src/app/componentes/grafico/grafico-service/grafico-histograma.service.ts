import { GraficoService } from "./grafico.service";
import { ElementRef } from "@angular/core";
import { FreqCont } from "src/app/modelo/freq/FreqCont";
import { OperacaoTipoEnum } from "src/app/modelo/operacao/OperacaoTipoEnum";
import { Grafico } from "../grafico-modelo/Grafico";
import { FreqDiscr } from "src/app/modelo/freq/FreqDiscr";
import { ArrayUtil } from "src/app/utils/array-util";
import { Coluna } from "src/app/modelo/entidade/coluna/Coluna";

type xCoordDesenhar = {
    x:number,
    rotular:boolean,
    valor?:number
};
type yCoordDesenhar = {
    y:number,
    rotular:boolean
};
type GraficoHistogramaItem = {
    valor:number,
    cor:string,
    x:number,
    largura:number,
    altura:number
};
export class GraficoHistogramaService extends GraficoService{

    override operacaoTipo=OperacaoTipoEnum.HISTOGRAMA;
    freqCont:FreqCont;
    xCoord:xCoordDesenhar[];
    yCoord:yCoordDesenhar[];
    override borda = 55;
    marcaTamanho = 8;

    xVirtualMin:number;
    xVirtualMax:number;
    xEscala:number;

    yEscala:number;
    yCoordDiv = 0.5;
    yCoordMarca = 1;

    graficoItems:GraficoHistogramaItem[];
    rotuloDesloc = 10;
    excluir:any;

    intervalos:number[];
    retanguloDistancia=4;
    AMPLITUDE=40;
    tolerancia=1e-5;

    constructor(
        coluna:Coluna,
        canvasEl: ElementRef<HTMLCanvasElement>
    ){
        super(canvasEl,coluna);
    }

    override iniciarLocal(): void {
        this.excluir = this.parametros?.excluir;
        if(this.parametros?.yCoordDiv!=undefined){
            this.yCoordDiv = this.parametros?.yCoordDiv;
        }
        if(this.parametros?.yCoordMarca!=undefined){
            this.yCoordMarca = this.parametros?.yCoordMarca;
        }

        if(this.parametros?.discreta){
            this.freqCont = new FreqDiscr(this.coluna.registros,this.parametros?.excluir,this.parametros?.marcarAusentes)
            .toCont();
        }else{
            this.freqCont = new FreqCont(this.coluna.registros as number[],this.parametros.intervalos,this.parametros.excluir);
        }
        
    }

    override eixoX(): void {
        this.eixoXDesenhar();
    }

    private eixoXDesenhar(){
        this.linha(0, 0,this.widthUtil, 0);
    }

    override xMarcarRotular(){
        this.xCoord.forEach(c=>{
            if(c.x!=0 || this.parametros?.discreta){
                const num = c.x/this.xEscala;
                this.xMarcar(num);
                if(c.rotular){
                    this.xRotular(num,this.parametros?.discreta?c.valor:undefined);
                }
            }
        });
    }

    private xMarcar(num:number){
        this.linha(num,-this.marcaTamanho/2,num,this.marcaTamanho/2);
    }

    private xRotular(num:number,valor?:number){
        this.ctx.save();
        this.ctx.translate(num,0);
        this.ctx.scale(-1,1);
        this.ctx.fillStyle = "black";
        this.ctx.font = this.fonte;
        this.ctx.rotate(-1*Math.PI);
        if(this.parametros?.discreta && valor!=undefined){
            this.ctx.fillText(valor.toString(),0,15);
        }else{ 
            this.ctx.fillText(this.formatador.format(num*this.xEscala),0,15);
        }
        this.ctx.restore();
    }

    override eixoY(): void {
        this.eixoYDesenhar();
        this.yMarcarRotular();
    }

    private eixoYDesenhar(){
        this.linha(0,0,0,this.heightUtil);
    }

    override yMarcarRotular(){
        this.yCoord.forEach(c=>{
            if(c.y!=0){
                const num = c.y/this.yEscala;
                this.yMarcar(num);
                if(c.rotular){
                    this.yRotular(num);
                }
            }
        });
    }

    private yMarcar(num:number){
        this.linha(-this.marcaTamanho/2,num,this.marcaTamanho/2,num);
    }

    private yRotular(num:number){
        this.ctx.save();
        this.ctx.translate(0,num);
        this.ctx.scale(-1,1);
        this.ctx.fillStyle = "black";
        this.ctx.font = this.fonte;
        this.ctx.rotate(-1*Math.PI);
        this.ctx.fillText(this.formatador.format(num*this.yEscala),-28,0);
        this.ctx.restore();
    }

    override gerarItems(): void {
        this.gerarEscalaX();
        this.gerarEscalaY();
        this.graficoItems = this.freqCont.freqs.map(f => {
            return {
                valor:f.prop,           
                x:f.intervaloInicio/this.xEscala,
                largura:f.amplitude/this.xEscala,
                altura:this.parametros?.areaNaoUnitaria?f.freq/this.yEscala:(f.prop/this.yEscala)/(100*f.amplitude),
                cor:this.corRepository.padrao
            }
        });
    }

    private gerarEscalaX(){
        let rotular = this.parametros?.xCoordDiv==undefined;

        if(this.parametros?.discreta != undefined){
            this.xCoord = this.freqCont.freqs.map(fci=>{
                const x = (fci.intervaloInicio+fci.intervaloFim)/2;
                const valor = fci.pontoMedio;
                rotular ||= x%this.parametros?.xCoordDiv==0;
                return {x,valor,rotular};
            });
        }else{
            this.xCoord = ArrayUtil.distintos(
                this.freqCont.freqs.flatMap(fci=>[fci.intervaloInicio,fci.intervaloFim])
            ).map(x=>{
                rotular ||= x%this.parametros?.xCoordDiv==0;
                return {x,valor:undefined,rotular};
            });
        }
        
        this.xVirtualMin = Math.min(...this.xCoord.map(c=>c.x));
        if(this.xVirtualMin>0){
            this.xCoord.push({x:0,rotular});
            this.xVirtualMin=0;
        }
        this.xVirtualMax = Math.max(...this.xCoord.map(c=>c.x));
        this.xEscala = (this.xVirtualMax-this.xVirtualMin)/this.widthUtil;
    }

    private gerarEscalaY(){
        const yMax = Math.max(...this.freqCont.freqs.map(f=>
            this.parametros?.areaNaoUnitaria?f.freq:f.prop/(100*f.amplitude)
        ));
        this.yCoord = ArrayUtil.range(0,yMax,this.yCoordDiv).map(i=>{
            const num = Number(this.formatador.format(i));
            return {
                y:num,
                rotular:((10000*num)%(10000*this.yCoordMarca)==0 || num%this.yCoordMarca<this.tolerancia)
            }
            // 10000 necessario para evitar: 0.2 % 0.6 = 0.019999999999999997
        });
        this.yEscala = yMax/this.heightUtil;
    }

    override desenharItems(){
        this.ctx.fillStyle=this.corRepository.padrao;
        this.graficoItems.forEach(item=>{
            this.desenharItem(item);
            if(item.valor!=0){
                this.desenharItemRotulo(item);
            }
        });
    }
      
    private desenharItem(item:GraficoHistogramaItem){
        this.ctx.fillRect(item.x,this.linhaTamanho/2,item.largura-this.retanguloDistancia/2,item.altura);
    }

    private desenharItemRotulo(item:GraficoHistogramaItem){
        const rotulo = `${Math.round(item.valor)}%`;
        this.ctx.save();
        const tamanho = this.ctx.measureText(rotulo).width;
        const x1 = item.x + (item.largura-tamanho)/2;
        const y1 = item.altura + this.rotuloDesloc;
        this.ctx.translate(x1,y1);
        this.ctx.scale(-1,1);
        this.ctx.fillStyle = "black";
        this.ctx.font = this.fonte;
        this.ctx.rotate(-1*Math.PI);
        this.ctx.fillText(rotulo,0,0);
        this.ctx.restore();
    }

}