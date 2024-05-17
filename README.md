# Document Center

## Table of Content
<details>
<summary>Click to show table of content</summary>

- [Document Center](#document-center)
  - [Table of Content](#table-of-content)
  - [Frontend](#frontend)
    - [Project Structure (frontend)](#project-structure-frontend)
    - [Framework](#framework)
    - [Package](#package)
    - [Setup (development)](#setup-development)
    - [Conventional commit](#conventional-commit)
  - [Before Building](#before-building)
  - [Build up project](#build-up-project)
  - [Api GateWay](#api-gateway)
  - [Image Service](#image-service)
  - [Documents Service](#documents-service)

</details>

## Frontend
- 使用前請先確定 `cd ./frontend`

<details>
<summary>點擊展開前端文件</summary>

### Project Structure (frontend)
<details>
<summary>Click to show project structure</summary>

```
frontend/
├── src/
│   ├── apis/             // api provided by backend
│   ├── assets/           // static assets (img, icon, etc.)
│   ├── enums/            // const enum
│   ├── mocks/            // generate fake api data for development
│   ├── components/       // global components
│   ├── router/           // mapping routes and page
│   ├── utils/            // global functions, helpers
│   ├── views/            // feature page
│   ├── App.vue
│   └── main.js
├── public/
│   ├── favicon.ico
│   └── index.html
├── .vscode/              // vscode setting file
├── index.html
├── README.md
└── ...(others)
```

</details>

### Framework
- Js: [Vue 3](https://vuejs.org/guide/introduction.html)
- Build: [Vite](https://v4.vitejs.dev/)
- UI: [Bootstrap 5](https://getbootstrap.com/docs/5.3)
- Rich text editor: VueQuill
- Mock: MSW + Faker.js

### Package
- eslint + prettier: format code
- cz-conventional-changelog: commit in conventional way

### Setup (development)
- install VSCode with following extensions
  - ESLint
  - Vue - Official
- [再次確認路徑位於./frontend，而非根目錄]

1. `npm install`
2. `npm run dev`

- 若想啟用 mock server
  - 首次執行 `npm run mock`，增加 `./frontend/public/mockServiceWorker.js`
- `npm run dev` 後 console 若出現 `[MSW] Mocking enabled.` 代表啟用 mock server 成功
- 若想使用 dev server 但不使用 mock
  - 手動註解 `./frontend/src/main.js` 的 worker 相關程式碼

### Conventional commit
- You can run `npm run commit` after `git add .`
  - `cz-conventional-changelog` is provided to interact with CLI and commit in conventional way

</details>

## Before Building
* [auth service](api-gateway/auth/)
* install `Docker Desktop` in local

## Build up project
1. `docker compose up --build -d`
  - `--build`: re-build project
  - `-d`: run in background, rather than terminal
- frontend: `http://localhost:3000`
- api-gatway: `http://localhost:80`
- api-docs:
  - `http://localhost:8082/api-docs/`
  - `http://localhost:8081/api-docs/`

## Api GateWay

## Image Service
[README](./image-service/README.md)

## Documents Service
[README](./document-service/README.md)