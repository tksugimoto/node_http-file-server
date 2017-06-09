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
					"Content-Type": "text/html; charset=UTF-8"
				};
				res.writeHead(200, header);
				const fileLists = files.filter(file => {
					return file[0] !== ".";
				}).map(file => {
					return `<li><a href="${encodeURIComponent(file)}">${file}</a></li>`
				}).join("\n");
				const html = `<html>
<head>
	<title>File一覧</title>
	<style>
		body {
			padding: 20px;
		}
	</style>
</head>
<body>
<ol>
	${fileLists}
</ol>
</body>
</html>`;
				res.write(html);
				res.end();
			});
		} else {
			const decodedFilename = decodeURIComponent(filename).replace(/[/]/g, "");
			const filepath = `${dir}/${decodedFilename}`;

			res.writeHead(200);
			const fileStream = fs.createReadStream(filepath);
			fileStream.on("error", err => {
				fileStream.unpipe(res);
				const header = {
					"Content-Type": "text/plain; charset=UTF-8"
				};
				res.writeHead(404, header);
				res.write(`File Not Found: ${decodedFilename}`);
				console.warn(err);
				res.end();
			});
			fileStream.pipe(res);
			fileStream.on("end", () => {
				// ファイルが存在する場合のみ
				console.log(`\treturn file: ${filepath}`);
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
