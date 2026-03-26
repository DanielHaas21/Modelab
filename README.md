# Modelab

This is a model browser & viewer used for browsing a school-provided model databank with various models namely in .mb, .c4d, .fbx, .obj formats.
This project is based on [React](https://react.dev/) and [PHP](https://www.php.net/)

## Contents

- [Modelab](#modelab)
  - [Contents](#contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Build](#build)
  - [Project Structure](#project-structure)
    - [App](#app)
    - [Utilities](#utilities)
  - [Docs](#docs)


## Prerequisites

- Node.js `>=18.17`

## Installation

Clone the repository and install dependencies:

```bash
npm install
```
## Development

To develop the app and packages, run the following command:

```bash
npm dev
```

## Build

To build the app and packages, run the following command:

```bash
npm build
```

## Project Structure

Modelab project comprises of two main components, that are their own repositories. The **Modelab** repo includes the React web application and documentation. The other repo is **Modelab-api**, which contains the PHP api connected to the React app.

### App

App folder structure
```
docs - Contains documentation for various directories
src 
├───frontend 
│   ├───hooks  
│   ├───pages 
│   ├───styles 
│   └───types 
├───global - contains d.ts declarations
├───libs 
│   ├───auth - contains auth helpers
│   ├───ui 
│   │   ├───assets  
│   │   ├───components 
│   │   └───layouts - contains various page layouts 
│   └───utils - helpers etc.
├───middleware
└───store - redux store for global state management
│   ├───reducers   
│   └───slices   
```

### Utilities

This project has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Redux Toolkit](https://redux-toolkit.js.org/) for complex state management
- [Prettier](https://prettier.io/) for better code formatting 

## Docs

- [Middleware](./docs/MIDDLEWARE.md)
