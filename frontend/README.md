# Document-center-frontend
- A document-management system viewed as the final project of 2024 `Cloud Native` course in NYCU
- Backend repo: [Click me]()

## Content
<details>
<summary>Click to expand content</summary>

- [Document-center-frontend](#document-center-frontend)
  - [Content](#content)
  - [Feature (working on, might change in the future)](#feature-working-on-might-change-in-the-future)
  - [Project Structure](#project-structure)
  - [Framework](#framework)
  - [Package](#package)
  - [Setup (development)](#setup-development)
  - [Conventional commit](#conventional-commit)

</details>

## Feature (working on, might change in the future)
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

## Project Structure
<details>
<summary>Click to expand</summary>

```
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

## Framework
- Js: [Vue 3](https://vuejs.org/guide/introduction.html)
- Build: [Vite](https://v4.vitejs.dev/)
- UI: [Bootstrap 5](https://getbootstrap.com/docs/5.3)
- (VueQuill: rich text editor)

## Package
- eslint + prettier: format code
- cz-conventional-changelog: commit in conventional way

## Setup (development)
1. `git clone https://github.com/gift-li/document-center-frontend.git`
2. `cd document-center-frontend/`
3. `npm install`
4. `npm run dev`

## Conventional commit
- You can run `npm run commit` after `git add .`
  - `cz-conventional-changelog` is provided to interact with CLI and commit in conventional way