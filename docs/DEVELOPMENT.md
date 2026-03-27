# Development

[Back](../README.md)

## Contents

- [Development](#development)
  - [Contents](#contents)
  - [Project Structure](#project-structure)
  - [Pages and Routers](#pages-and-routers)
  - [UI](#ui)
    - [Directory structure](#directory-structure)
    - [Naming convetions](#naming-convetions)
  - [Store](#store)
    - [Directory structure](#directory-structure-1)
    - [Naming convetions](#naming-convetions-1)
    - [Logic](#logic)

## Project Structure

```
docs - Contains documentation for various directories
src 
├───frontend 
│   ├───routers 
│   ├───pages 
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

## Pages and Routers

Pages and routers are defined in `/pages` and `/routers`. 
A page is a React function component, which has no parameters.

If a page needs to load some data (it's context), a separate Loader FC is made,
which loads the context and passes it into the page.
This way, pages don't have to check if their context is loaded.

## UI

Structure for the `/ui` directory

### Directory structure 

```
ui
├───assets - contains image files, icons and other resources
├───components - contains React components
├───layouts - contains page layouts - TBD
```

### Naming convetions
 
- /componets -> UpperCamelCase and the filename must match the name of the components
- /assets -> None
- /layouts -> UpperCamelCase

## Store 

Structure for the `/store` directory

### Directory structure 

```
styles 

├───types - contains custom types for slice/reducer interfaces etc.
├───slices - contains slices for the store
├───reducers - contains reducers for the store (similar to slices)
├───store.ts - contains the redux store configuration and exports
```

### Naming convetions

- /reducers -> UpperCamelCase and the filename must match its respective reducer name excluding the "reducer" part, ex. AbcReducer -> Abc.ts
- /slices -> UpperCamelCase and the filename must match its respective slice name excluding the "slice" part, ex. AbcSlice -> Abc.ts
- /types -> UpperCamelCase / camelCase 

### Logic 

Mark the export of the slice as reducer. That is : `export AbcSlice.reducer`
