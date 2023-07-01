import path from "node:path";
import fs from "node:fs";
import { existsSync } from "node:fs";

const PKG_JSON = "package.json";
const TS_JSON = "tsconfig.json";

const cwd = process.cwd();
const tmplPath = path.join(cwd, "templates");
const pkgJsonTmpl = path.join(tmplPath, PKG_JSON);
const tsJsonTmpl = path.join(tmplPath, TS_JSON);

const dir = path.normalize(process.argv[2]);
const dest = path.join(cwd, dir);
const pkgJsonOut = path.join(dest, PKG_JSON);
const tsJsonOut = path.join(dest, TS_JSON);

const copy = (src: fs.PathLike, dest: fs.PathLike) => {
  if (!existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log("Copied:", "\n\t", src, dest);
  } else {
    console.log("Exists:", "\n\t", src);
  }
};

console.log({ cwd, tmplPath, dir, dest, pkgJsonTmpl, pkgJsonOut, tsJsonTmpl, tsJsonOut });

copy(pkgJsonTmpl, pkgJsonOut);
copy(tsJsonTmpl, tsJsonOut);
