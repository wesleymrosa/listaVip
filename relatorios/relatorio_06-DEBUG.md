# Relatório de Correções #06-DEBUG
**Data e Hora:** 06/04/2026 14:23:00 (BRT)

1. **Backend & Telemetria no Go:**
   - Adicionamos logs em formato `log.Printf` no método de captura da rota `POST /api/eventos/:id/convidados`.
   - Agora, qualquer envio emitirá no terminal do Docker informações em duas vias `[DEBUG]` (se converteu o tipo de dado RG e Nome com sucesso) e `[ERROR]` caso a camada de criação do GORM ou conversão falhe.
   - Refatoramos a verificação final: O loop passará pelo check do erro no `DB.Create(&novoConvidado).Error`. Se algo explodir a nível relacional no banco, será imediatamente capturado e devolvido no JSON com a flag `"details"`.

2. **CORS Explicitado:**
   - O Middleware `cors.Default()` foi substituído pelo customizado explícito, que confia expressamente em `GET`, `POST`, `OPTIONS` a partir de qualquer origem `*`. Isso previne o bloqueio de requisições Cross-Origin de navegadores no endpoint modificado.

3. **Logs no Frontend (React):**
   - O `Detalhes.jsx` recebeu debugadores no submissor `handleAddConvidado()`. 
   - Ao executar o salvamento, o estado em trânsito imprime no console do navegador (`F12`). Da mesma forma, se o `res.ok` apontar um `status 500` falho, agora ele engole e expõe a mensagem técnica crua vindo do Gin log (`[DEBUG-CRITICAL]`). 

O sistema está blindado com telemetria para localizarmos 100% de ondem está originando as falhas de inserção em sub-tabelas.
