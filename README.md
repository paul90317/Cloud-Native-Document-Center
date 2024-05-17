# Document Center

## Table of Content
<details>
<summary>Click to show table of content</summary>

- [Document Center](#document-center)
  - [Table of Content](#table-of-content)
  - [Frontend](#frontend)
    - [Feature (working on, might change in the future)](#feature-working-on-might-change-in-the-future)
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

### Feature (working on, might change in the future)
- Preset different user permissions, each of which plays a different role during the review process:
  - user `(default)`
      - document can view:
          - all passed documents
          - self-created documents
          - others' documents only if assigned to review their documents
              - can not only view, but review (select Pass, or Reject and filling reject reason)
  - manager
      - can manage all documents, including status, edit time, and review history
      - can arrange document's reviewer and re-review on passed documents
      - (can manage all users and managers)
- Provide different phase in review process
  - editing
  - reviewing
  - pass
- Can send review notification to those who are assigned to review
- Supports third-party login

### Project Structure (frontend)
<details>
<summary>Click to show project structure</summary>

```
frontend/
├── src/
│   ├── apis/             // api provided by backend
│   ├── assets/           // static assets (img, icon, etc.)
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
- VueQuill: rich text editor

### Package
- eslint + prettier: format code
- cz-conventional-changelog: commit in conventional way

### Setup (development)
- install VSCode with following extensions
  - ESLint
  - Vue - Official

1. `npm install`
2. `npm run dev`

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

## Api GateWay

## Image Service
[README](./image-service/README.md)

## Documents Service
[README](./document-service/README.md)