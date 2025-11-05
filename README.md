# MeuProjeto — App Desktop

Este repositório contém uma aplicação Express (EJS) convertida para um aplicativo desktop usando Electron.

Principais pontos

- O servidor Express roda embutido e a interface é exibida dentro de uma janela Electron.
- O app usa MySQL via Sequelize — o servidor MySQL deve estar acessível separadamente.

Variáveis de ambiente
Renomeie `.env.example` para `.env` e edite as credenciais, ou defina variáveis no ambiente do sistema:

- DB_NAME — nome do banco (padrão: ControlaSenhas)
- DB_USER — usuário do DB (padrão: root)
- DB_PASS — senha do DB (padrão: MenpalTet1@)
- DB_HOST — host do DB (padrão: localhost)
- PORT — porta que o servidor interno usará (padrão: 3000)

Modo de desenvolvimento

1. Instale dependências:

```powershell
npm install
```

2. Rode a versão desktop em modo dev (abre janela Electron):

```powershell
npm run electron:dev
```

Gerar instalador / executável

- Gerar instalador (NSIS) e executável portable (um único .exe) para Windows:

```powershell
npm run dist:win
```

Os artefatos serão gerados em `dist/`.

Observações importantes

- O build empacota os recursos usando ASAR. Se você precisar que arquivos estáticos sejam editáveis após a instalação, ajuste `build.asarUnpack` no `package.json`.
- Atualmente o app sincroniza o banco na inicialização (sem `force: true`). Em produção, remova qualquer comportamento de reset de esquema.
- O binário não inclui o servidor MySQL — o MySQL deve ser instalado/fornecido à parte.

Próximos passos úteis

- Configurar variáveis de ambiente no instalador ou no serviço do Windows.
- Ajustar ícone e metadados do `build` no `package.json`.
- Configurar atualização automática (auto-updates) usando um servidor de atualizações.
# Controla-Senhas
