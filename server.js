"use strict";
const port = 4444;
const host = "0.0.0.0";
const dir = "./files";

console.log(`http://${host}:${port}/`);

const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
	if (req.url === "/favicon.ico") {
		res.end();
	} else {
		console.log(`[${new Date().toLocaleString()}] ${req.url}`);
		const filename = req.url.match(/[/]([^/?]*)/)[1];
		const filepath = `${dir}/${filename}`;
		fs.exists(filepath, exists => {
			if (exists) {
				fs.readFile(filepath, "binary", (err, file) => {
					if (err) {
						const header = {
							"Content-Type": "text/plain"
						};
						res.writeHead(404, header);
						res.write(`Something wrong\n${filename}\nerr: ${err}`);
						res.end();
					} else {
						const header = {};
						res.writeHead(200, header);
						res.write(file, "binary");
						res.end();
					}
				});
			} else {
				const header = {
					"Content-Type": "text/plain"
				};
				res.writeHead(404, header);
				res.write(`File Not Found\n${filename}`);
				res.end();
			}
		});
	}
}).listen(port, host);
