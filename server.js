"use strict";
const port = 4444;
const host = "0.0.0.0";
const dir = "./files";

const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {
	if (req.url === "/favicon.ico") {
		res.end();
	} else {
		console.log(`[${new Date().toLocaleString()}] ${req.url}`);
		const filename = req.url.match(/[/]([^/?]*)/)[1];
		if (filename === "") {
			fs.readdir(dir, (err, files) => {
				const header = {
					"Content-Type": "text/html"
				};
				res.writeHead(200, header);
				const body = files.map(file => {
					return `<a href="${file}">${file}</a>`
				}).join("<br>\n");
				const html = `<html>
<head>
	<title>File一覧</title>
</head>
<body>
${body}
</body>
</html>`;
				res.write(html);
				res.end();
			});
		} else {
			const filepath = `${dir}/${decodeURI(filename)}`;
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
		}
	}
}).listen(port, host);


const os = require("os");
const networkInterfaces = os.networkInterfaces();
Object.keys(networkInterfaces).forEach(key => {
	networkInterfaces[key].filter(networkInterface => {
		return networkInterface.family === "IPv4";
	}).forEach(networkInterface => {
		const host = networkInterface.address;
		console.log(`${key}: http://${host}:${port}/`);
	});
});
