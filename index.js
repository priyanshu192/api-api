// /*
// Copyright Hisoka Developments ©
// All Images Of This API Belong To Hisoka Developments 
// */
// require('./controllers/app')(__dirname);

const express = require('express');
const url = require('url');
const fs = require('fs');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const fetch = require('node-fetch');
const pats = require('../images/JSON/pats.json');
const cdnURL = 'http://localhost:5000/images/';

function getInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + 1);
}
let app = express();

function start(dir) {
	app.use(bodyparser.json());
	app.use(bodyparser.urlencoded({ extended: true }));
	app.use(cookieparser());
	app.use(
		'/controllers',
		express.static(require('path').join(dir, 'controllers'))
	);
	app.use('/css', express.static(require('path').join(dir, 'css')));
	app
		.get('/', (req, res) => {
			let file = fs.createReadStream('views/main.html');
			file.pipe(res);
		})
		.get('/endpoints', (req, res) => {
			fs.createReadStream('endpoints.json').pipe(res);
		})
		.get('/partners', (req, res) => {
			fs.createReadStream('views/partners.html').pipe(res);
		})
		.get('/wrappers', (req, res) => {
			fs.createReadStream('views/wrappers.html').pipe(res);
		})
		.get('/discord', (req, res) => {
			res.redirect('https://discord.gg/WhnmkwgtGb');
		})
		.get('/invite', (req, res) => {
			res.redirect('https://beta.chrollo.xyz');
		})
		.get('/github', (req, res) => {
			res.redirect('https://github.com/ItsHisoka17');
		})
		.post('/issue', (req, res) => {
			if (req.cookies.sent) {
				res.status(401).send({ error: 'Too many requests' });
				return;
			}
			if (!req.body.issue) {
				res.status(400).send({ error: '400 Bad Request' });
				return;
			}
			let body = {
				embeds: [
					{
						description: req.body.issue,
						title: 'New Issue',
						color: '15547709',
						footer: {
							text: `Submitted By: ${req.body.name ? req.body.name : 'Unknown'}`
						}
					}
				],
				avatar: '${cdnURL}rias.png'
			};
			let webhook = process.env['webhookURL'];
			fetch(webhook, {
				method: 'post',
				body: JSON.stringify(body),
				headers: { 'Content-Type': 'application/json' }
			});
			res.cookie('sent', 'true');
			res.send({ success: 'Issue Sent' });
		})
		.post('/resolveissue', (req, res) => {
			if (req.cookies.sent) {
				res.status(401).send({ error: 'Too many requests' });
				return;
			}
			if (req.body.hasOwnProperty('issue') && req.body.hasOwnProperty('name')) {
				fetch('https://Anime-API.hisoka17.repl.co/issue', {
					method: 'post',
					body: JSON.stringify({ ...req.body }),
					headers: { 'Content-Type': 'application/json' }
				});
				res.cookie('sent', 'true');
				res.redirect('/');
			} else {
				res.send({ error: '400 Bad Request' });
			}
		});
	/*
    app.use('/img', async function(req, res, next) {
      let endpoint = req.url.includes('nsfw') ? req.url.slice(6) : req.url.slice(1);
      console.log(endpoint)
      let cdnEndpointsList = ['kiss', 'hentai'];
      if (cdnEndpointsList.find((e) => { e !== endpoint })) { next() };
      let fileName = (await require('node-superfetch').get(`https://cdn-anime-images-api.hisoka17.repl.co/${endpoint}`)).body.url;
      console.log(fileName);
      res.json(
        {
          url: `${cdnURL}${fileName}`
        }
      )
    });
    */

	app
	//get('/img/kiss', (req, res) => {
	// 	let data = {
	// 		url: `${cdnURL}kiss${getInt(1, 100)}.gif`
	// 	};
	// 	res.json(data);
	// });
	// app
	// 	.get('/img/punch', (req, res) => {
	// 		let data = {
	// 			url: punches[Math.floor(Math.random() * punches.length)]
	// 		};
	// 		res.json(data);
	// 	})
	// 	.get('/img/hug', (req, res) => {
	// 		let image = `hug${Math.floor(Math.random() * (100 - 1 + 1) + 1)}.gif`;
	// 		let data = {
	// 			url: `${cdnURL}${image}`
	// 		};
	// 		res.json(data);
	// 	})
	// 	.get('/img/hentai', async (req, res) => {
	// 		let { body } = await require('node-superfetch').get(
	// 			'https://cdn-anime-images-api.hisoka17.repl.co/hentai'
	// 		);
	// 		let file = body.url;
	// 		let url = `${cdnURL}${file}`;
	// 		res.json({ url: url });
	// 	})
	// 	.get('/img/nsfw/hentai', async (req, res) => {
	// 		let { body } = await require('node-superfetch').get(
	// 			'https://cdn-anime-images-api.hisoka17.repl.co/hentai'
	// 		);
	// 		let file = body.url;
	// 		let url = `${cdnURL}${file}`;
	// 		res.json({ url: url });
	// 	});
	// app
	// 	.get('/img/nsfw/boobs', async function(req, res) {
	// 		let num = (await require('node-superfetch').get(
	// 			'https://cdn-anime-images-api.hisoka17.repl.co/boobs'
	// 		)).body.url;
	// 		let image = `${cdnURL}${num}`;
	// 		res.json({ url: image });
	// 	})
	// 	.get('/img/nsfw/lesbian', function(req, res) {
	// 		let url = `${cdnURL}lesb${getInt(1, 90)}.gif`;
	// 		res.json({ url: url });
	// 	})
	// 	.get('/img/slap', function(req, res) {
	// 		let info = {
	// 			url: slaps[Math.floor(Math.random() * slaps.length)]
	// 		};
	// 		res.send(info);
	// 	})
		.get('/img/pat', function(req, res) {
			let info = {
				url: pats[Math.floor(Math.random() * pats.length)]
			};
			res.send(info);
		});
		// .get('/img/kill', function(req, res) {
		// 	let data = {};
		// 	data.url = kills[Math.floor(Math.random() * kills.length)];
		// 	res.json(data);
		// })
		// .get('/img/wink', function(req, res) {
		// 	res.send({ url: winks[Math.floor(Math.random() * winks.length)] });
		// })
		// .get('/img/cuddle', function(req, res) {
		// 	let file = `cuddle${getInt(1, 50)}.gif`;
		// 	res.json({ url: `${cdnURL}${file}` });
		// })
		// .get('/img/waifu', function(req, res) {
		// 	res.send({
		// 		url: `${cdnURL}waifu${getInt(1, 10)}.jpg`
		// 	});
		// });

	app.use(function(req, res, next) {
		res.status(404);
		fs.createReadStream('views/404.html').pipe(res);
	});
	app.endpoints = [
		 'pet'
		// 'kiss',
		// 'slap',
		// 'punch',
		// 'wink',
		// 'pat',
		// 'kill',
		// 'cuddle',
		// 'waifu',
		// 'hentai',
		// 'boobs',
		// 'lesbian'
	];

  const port = process.env.PORT || 5000
// const port = 5000
  
	app.listen(5000, err => {
		if (err) throw err;
		console.log(
			`<----------------->\nAPI is up and running\n<----------------->\nTotal Listeners: ${
				app.endpoints.length
			}`
		);
	});
}
module.exports = start;
