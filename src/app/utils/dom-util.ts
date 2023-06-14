export class DomUtil{

  public static adicionarClasse(el:Element,classe:string){
    const arrClasses = el.className.split(/\s+/);
    arrClasses.push(classe);
    el.className = arrClasses.join(" ");
  }

  public static removerClasse(el:Element,classe:string){
    const arrClasses = el.className.split(/\s+/);
    const idx = arrClasses.findIndex(i=>i==classe);
    el.className = arrClasses.slice(0,idx).concat(arrClasses.slice(idx+1)).join(" ");
  }

  public static temClasse(el:Element,classe:string){
    return el.className.split(/\s+/).find(x=>x==classe)!=undefined;
  }

  public static criarTabela(dataSource:object[],container:Element):void{
    const tabelaEl = document.createElement('table');
    const thEl = document.createElement('thead');
    const tbodyEl = document.createElement('tbody');
    let tr = document.createElement('tr');

    const camposNomes = Object.keys(dataSource[0]);
  
    camposNomes.forEach(campoNome=>{
      const th = document.createElement('th');
      th.innerText=campoNome;
      tr.appendChild(th);
    });

    thEl.appendChild(tr);
    
    dataSource.forEach(registro=>{
      tr = document.createElement('tr');
      camposNomes.forEach(campoNome=>{
        const td = document.createElement('td');
        td.innerText = registro[campoNome]==undefined ? "" : registro[campoNome];
        tr.appendChild(td);
      });
      tbodyEl.appendChild(tr);
    });

    tabelaEl.appendChild(thEl);
    tabelaEl.appendChild(tbodyEl);
    container.append(tabelaEl);
  }

  public static criarDiv(container:Element,id:string):Element{
    const elDiv = document.createElement('div');
    elDiv.id=id;
    container.appendChild(elDiv);
    return elDiv;
  }

  public static existe(id:string):boolean{
    return document.querySelector("#"+id)!=null;
  }

  public static todos(css:string):NodeListOf<Element>{
    return document.querySelectorAll(css);
  }

  public static exibir(el){
    el.setAttribute("style","");
  }

  public static ocultar(el){
    el.setAttribute("style","display:none");
  }
}