import fs from "node:fs";
import { EOL } from "os";

const config = {
    folderPath: "../logs"
}

const Log = (errorType: string, log: string) => {
    const date = Date();
    const actualDate = date.toLocaleString().slice(4, 15).split(" ").join("_");
    const filePath = `${config.folderPath}/${actualDate.slice(4,14)}_log.txt`;
    const message = `${actualDate} | ${errorType} | ${log}` + EOL;
    fs.appendFileSync(filePath, message);
}

export const errors = {
    InternalServerError : "InternalServerError",
    DBInfo : "DatabaseInfo",
    DBError : "DatabaseError",
    ServerStartInfo : "ServerStartInfo",
    ServerCrashError : "ServerCrash"
}

export default Log;

// console.log(Date());
// OUTPUT : Sat March 30 2024 22:25:30 GMT+0530 (GMT+05:30)
// MM/DD/YYYY : slice(4, 15)
