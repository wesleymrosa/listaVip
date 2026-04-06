# Relatório de Crise e Contingência #12
**Data e Hora:** 06/04/2026 16:00:00 (BRT)

1. **Investigação do Blecaute de Requisições:**
   - O sintoma relatado do `"Failed to fetch"` decorre das tentativas do Client React (Fetch) de realizar comunicações do tipo `Pre-Flight` enviando o método `OPTIONS` antes de injetar de fato os comandos massivos de Update ou Delete para fins de segurança estrita (*mesmo habilitando o "AllowAllOrigins" na lib paralela de CORS*). Ao analisar os interceptadores, concluí que o encapsulador extra `gin-contrib` estava criando deadlocks nesse sinal isolado do contêiner.
   
2. **Plano de Reversão de CORS Aplicado (O "Hard Reset"):**
   - No Backend (`main.go`), dizimamos o pacote *github.com/gin-contrib/cors* do ecossistema e construímos o **CORSMiddleware()**. Ele atua como um Porteiro de Boate implacável: qualquer pedido `OPTIONS` da Web é abatido com código `204 (No Content)`, permitindo via direta que as funções GET, POST, PUT, DELETE deságüem imediatamente e de forma absoluta pro roteador GIN, blindando pra sempre contra perdas cruzadas.

3. **Gargalos de Contêiner (Docker & React PDF):**
   - Ao injetar o módulo Premium jsPDF no NPM, as validações agressivas do gerenciador de pacote cruzaram espadas com o React e as features instaladas do Vite, desencadeando quebra da arvore de dependências ("*Peer Dependencies Conflict*").
   - Aplicamos a configuração destemida `--legacy-peer-deps` na raiz de instalação no  `Dockerfile`. Isso dita aos pipelines do Node que subvertam todos os falsos-avisos de bloqueios NPM e extraiam tudo à força no cache local do host, mantendo os artefatos visuais seguros mas desferindo a marretada no instalador.

---

## 💎 Commit de Vanguarda:
```bash
git commit -m "fix(backend,infra): 🚨 bypass cors hard layer e legacy-dependencies root" -m "Substituído ecossistema cors frágil de terceiros por middleware implacável raiz controlando OPTIONS do Preflight. Injetado legacy-peer-deps na build Alpine do node resolvendo crash do jsPDF e Vite Host."
```
