import * as http from "http"

export function register(name, port) {
    http.request({
        port: 3001,
        path: "/" + name + "/" + port,
        method: "POST"
    }).end();
    
    process.on("exit", () => {
        http.request({
            port: 3001,
            path: "/" + name,
            method: "DELETE"
        }).end();
    });
}