# store 

This doc file explains and lists the naming conventions and folder structure for the `/store` directory

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
