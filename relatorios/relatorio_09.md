# Relatório de Correções #09
**Data e Hora:** 06/04/2026 15:30:00 (BRT)

1. **Backend & Reparo na Exclusão / Criação de UPDATE Handlers:**
   - Adicionamos a flag radical de segurança `DB.Unscoped().Delete(&obj)`. A engine PostgreSQL agora força o expurgo absoluto dos itens caso o modo `SoftDelete` do GORM viesse a blindar exclusões por engano no futuro, evitando lixo no BD.
   - Adicionados os monitores via log `[DELETE-DEBUG]`.
   - Adicionadas rotas `PUT /api/eventos/:id` e `PUT /api/convidados/:id`, mapeadas com `ShouldBindJSON` dinâmico e salvas pelo `DB.Save(&obj)`.

2. **Frontend & UX Fluida Avançada (Modo Cristal):**
   - Na listagem de Convidados (Tabela) e de Eventos (Cards), implementamos edição Inline! 
   - Ao longo dos mapeamentos `Array.map`, o React escuta qual index está ativo no State de Edição. Quando detectado, o card derrete organicamente dando espaço a Inputs translúcidos que guardam as alterações instantaneamente sem perder a sessão.
   - Adicionada manipulação de evento (`e.stopPropagation()`) para separar a ação do Botão Editar/Excluir, o que previne que o usuário seja redimensionado acidentalmente via roteamento `<Link>` subjacente.

3. **Arquitetura Blob (Exportar CSV Remoto):**
   - Instalamos o Botão roxo "Exportar CSV" ao lado do Título na área de Detalhes.
   - Usando a formatação Vanilla de ES6, as matrizes JSON dos convidados recebem join com vírgulas `[\n]`. Um arquivo Blob `text/csv` é gerado na RAM e ejetado no dispositivo do usuário como `evento_ID_lista_vip.csv` usando âncoras invisíveis (bypass de libs externas), deixando a arquitetura Frontend super leve.

---

## 💎 Commit de Vanguarda:
```bash
git commit -m "feat(backend,ui): 📝 modo de edição inline e exportação csv" -m "Correção de Soft Delete via Unscoped, Handlers PUT nativos. React mapeando states de edição modular e gerador de CSV Blob autossuficiente blindando dependências."
```
