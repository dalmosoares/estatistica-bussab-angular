1 - Erro: ng não é reconhecido como comando
executar npm install ng

2 - Caso de uso

Descrição

git status gerava lista de arquivos alterados do tipo "changed <arquivo>"
objetivo: remover estas linhas

Procedimento

git status > saida.ps1
alterar saida.ps1: renomear linhas "changed <arquivo>" para "git update-index --skip-worktree <arquivo>"
powershell.exe -ExecutionPolicy bypass saida.ps1
