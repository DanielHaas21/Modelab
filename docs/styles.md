# styles 

This doc file explains and lists the naming conventions and folder structure for the `/styles` directory

### Directory structure 

```
styles 

├───modules - contains custom classes, and base class extensions
├───components - contains classes used only for specific components 
├───pages - contains classes used only for specific pages 
├───utils - contains utility functions, templates, mixins, font declarations
├───export.scss - To be included in App.tsx
├───bootstrap.scss - bootstrap setup, global classes imports, module imports 
```

### Naming convetions
- /components -> UpperCamelCase and the filename must match its respective .tsx page or component its used for
- /pages -> UpperCamelCase and the filename must match its respective .tsx page or component its used for
- /utils -> camelCase 
- /modules -> lowercase 
### Logic 
All components and pages be included in `custom.scss`
All modules must be called in `bootstrap.scss`