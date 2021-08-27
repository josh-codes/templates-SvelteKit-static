import { readdirSync, readFileSync, writeFileSync, Dirent } from 'fs';
import { join as fspathjoin, resolve } from 'path';
const pathloc = fspathjoin(resolve(), "/../app/pages");
const regex = /(.*\.html)/;
const fixfile = async (path:string, reqcount:number) => {
    let dotdotslash = "../";
    for (let i = 0; i < reqcount; i++) {
        dotdotslash+="../"
    }
    let data = await readFileSync(path, "utf8")
    let result = data.split("/_app").join(dotdotslash+"_app");
    result = result.split("from \"").join("from \"./");
    result = result.split("import(\"").join("import(\"./");
    await writeFileSync(path, result);
}
const recursive = async (path:string, reqcount:number) => {
    const folder:Dirent[] = await readdirSync(path, { withFileTypes: true });
    folder.forEach(async (item:Dirent) => {
        if (item.isDirectory()) {
            recursive(fspathjoin(path, `/${item.name}`), reqcount+1)
        } else {
            regex.test(item.name) && await fixfile(fspathjoin(path, `/${item.name}`), reqcount);
        }
    })
}
recursive(pathloc, 0)