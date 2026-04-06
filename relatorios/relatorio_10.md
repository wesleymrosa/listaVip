# Relatório de Estabilidade #10
**Data e Hora:** 06/04/2026 15:38:00 (BRT)

1. **Blindagem do Coração (Backend Go):**
   - O Middleware CORS foi totalmente reequipado. As portas e métodos estavam restritos no ambiente original, bloqueando o navegador. Inserimos `PUT` e `DELETE` na diretiva `AllowMethods`, dissipando a anomalia do `Failed to fetch`.
   - Adicionada telemetria granular (`log.Printf("[API-DEBUG]")`) capturando o Método, URL Requisitada e o ID anexado para facilitar o acompanhamento da console Docker.
   - Refatoramos as persistências do GORM:
     - `DELETE`: Utilizado o encadeamento rigoroso `DB.Unscoped().Delete(&var, id)`
     - `PUT`: Modificado para `DB.Model(&var).Updates(dadosNovos)` garantindo que o struct interno atualize somente os dados passados pelo frontend sem desestruturar chaves vitais.

2. **Normalização da Ponte (Frontend React):**
   - Parametrizamos as saídas com a formatação formal `const API_URL = "http://localhost:8080/api"`, blindando o client contra inconsistências de barras duplas (`//`).
   - Refatoração dos fluxos Promise de `fetch`: Ao invés de tentarmos adivinhar qual era o JSON de falha, aplicamos o tratamento rigoroso em todas as requests: 
     ```javascript
     if (!res.ok) { throw new Error(await res.text()) }
     ```
   - O Client React agora joga as entranhas dos Logs diretos nos seus belos Toasts vermelho e os printa sem piedade pro usuário final.

---

## 💎 Commit de Vanguarda:
```bash
git commit -m "fix(backend,ui): 🛡️ resiliência e correção de fluxo crud" -m "Liberados métodos PUT e DELETE no CORS, GORM refatorado para Unscoped e Updates, e Fetch Handlers blindados capturando Response.text() cru em Toasts para telemetria."
```
