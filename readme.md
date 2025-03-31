# NB: Applied patch for daraja js

using patch package following steps

To automate the fix in production without manually editing the `node_modules` folder, you can use one of the following approaches:

### **1. Patch the Package using `patch-package`** (used here)

The best way to handle this issue is to use [`patch-package`](https://www.npmjs.com/package/patch-package), which allows you to apply modifications to `node_modules` automatically after installation.

#### **Steps to Use `patch-package`:**

1. Install `patch-package` and `postinstall-postinstall`:
   ```sh
   npm install patch-package postinstall-postinstall --save-dev
   ```
2. Make the manual edit locally (as you were doing before) in `node_modules/daraja.js/dist/api/b2c.d.ts`.
3. Run:
   ```sh
   npx patch-package daraja.js
   ```
   This will create a patch file inside `patches/`.
4. Add this script to your `package.json`:
   ```json
   "scripts": {
     "postinstall": "patch-package"
   }
   ```
5. Commit the `patches/` folder to your repository.
6. In production, when `npm install` runs, the patch will be automatically applied.

---

### **2. Use a Custom `postinstall` Script**

If you don’t want to use `patch-package`, you can create a simple Node.js script to modify the file after `npm install`.

#### **Steps to Implement:**

1. Create a script `fix-daraja.js` in your project root:

   ```javascript
   const fs = require("fs");
   const path = require("path");

   const filePath = path.join(
     __dirname,
     "node_modules/daraja.js/dist/api/b2c.d.ts"
   );

   if (fs.existsSync(filePath)) {
     let content = fs.readFileSync(filePath, "utf8");
     content = content.replace(
       'import { MpesaResponse } from "wrappers";',
       'import { MpesaResponse } from "daraja.js/dist/wrappers";'
     );

     fs.writeFileSync(filePath, content, "utf8");
     console.log("Fixed daraja.js import issue.");
   } else {
     console.warn("b2c.d.ts not found, skipping fix.");
   }
   ```

2. Add this script to your `package.json`:
   ```json
   "scripts": {
     "postinstall": "node fix-daraja.js"
   }
   ```
3. After installation, this script will automatically modify the required file.

---
