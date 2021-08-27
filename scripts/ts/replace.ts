import { renameSync, readdirSync, readFileSync, writeFileSync, Dirent } from 'fs';
import { join as fspathjoin, resolve } from 'path';
const pathloc = fspathjoin(resolve(), "/../app/pages");
const oldpath = fspathjoin(resolve(), "/../app/_app");
const newpath = fspathjoin(resolve(), "/../app/appdata");
const regex = /(.*\.html)/;
const fixfile = async (path:string, reqcount:number) => {
    let dotdotslash = "../";
    for (let i = 0; i < reqcount; i++) {
        dotdotslash+="../"
    }
    let data = await readFileSync(path, "utf8")
    let result = data.split("/_app").join(dotdotslash+"appdata");
    result = result.split("from \"").join("from \"./");
    result = result.split("import(\"").join("import(\"./");
    const js = result.split("<script type=\"module\">")[1].split("</script>")[0]
    result = result.split("<script type=\"module\">")[0]+`<link rel=\"stylesheet\" href=\"/fonts/font.css\"/><link rel=\"icon\" href=\"/icons/full.png\" /><script defer type=\"module\" src=\"init.mjs\"></script>`+result.split("</script>")[1]
    await writeFileSync(path, result);
    let initjspath:string[]|string = path.split("/");
    initjspath.pop();
    initjspath = fspathjoin(initjspath.join("/"), "/init.mjs");
    await writeFileSync(initjspath, js);
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
renameSync(oldpath, newpath)
recursive(pathloc, 0)