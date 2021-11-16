---
order: 1
---

Use base directory to generate Global CSS styles. Attach each css produced from this directory to a global library called base in the libraries.yml file.

```
base:
  css:
    base: 
      /path/to/base/style.css
```

Attach the base library globally i nthe themename.info.yml file

```
libraries:
  - core/normalize
  - drupalastic/base
```