import fs from 'fs';


export class JsonUtil{

    private async readJsonFile(path:string) {
        let saida:any;
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              saida = undefined;
            }
            console.log(data);
            saida = JSON.parse(data);
        });
    }


}