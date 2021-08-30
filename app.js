const got = require('got')
const htmlUrls = require('html-urls')
var http = require("http");
http.post = require("http-post");
var year = 2021
var pelis = []
;(async () => {
  const url = `https://visuales.uclv.cu/Peliculas/Extranjeras/${year}/`
  if (!url) throw new TypeError('Need to provide an url as first argument.')
  const { body: html } = await got(url)
  const links = await htmlUrls({ html, url })

//   links.forEach(({ url }) => console.log(url))

//   // => [
//   //   'https://microlink.io/component---src-layouts-index-js-86b5f94dfa48cb04ae41.js',
//   //   'https://microlink.io/component---src-pages-index-js-a302027ab59365471b7d.js',
//   //   'https://microlink.io/path---index-709b6cf5b986a710cc3a.js',
//   //   'https://microlink.io/app-8b4269e1fadd08e6ea1e.js',
//   //   'https://microlink.io/commons-8b286eac293678e1c98c.js',
//   //   'https://microlink.io',
//   //   ...
//   // ]

for (var i = 5; i <= links.length - 4; i++) {
  let nombre = links[i].value
    .replace(`${year}_`, "")
    .replace(/\./g, " ")
    .replace(`/`, "");
  // console.log(`Name: ${nombre}`);
  // console.log(links[i]);
  let a = await getPeli(nombre,year,links[i].url)
  a&&pelis.push(a);
  console.log(`Name: ${nombre}`);
  console.log(pelis);
  
}
// console.log(pelis.length)
pelis&&
pelis.forEach(element => {
  
      http.post("http://localhost:3000/insertPelis", element, (opciones, res, body) => {
        if (!opciones.headers.error) {
          // console.log(`statusCode: ${res.statusCode}`);
          console.log("error " + JSON.stringify(opciones.headers));

          
          return;
        } else {
          console.log(opciones.headers);
         
          return;
        }
      });
});

})()

async function getPeli (nombre,year,url)  {
  let peli = ''
  let subtitle = ''
  let poster = ''
  if (!url)
    throw new TypeError("Need to provide an url as first argument.");
  const { body: html } = await got(url);
  const linksPeli = htmlUrls({ html, url });
  
  // for (var j = 5; j < linksPeli.length-6; j++) {
  //   // console.log(`Links de peliculas ${JSON.stringify(linksPeli[j])}`);
  // }
  var filter = require('simple-text-search')
  var get = filter(linksPeli,'url')
  var peliurl = get('.mkv') ? get('.mkv') : get('.mp4')
  var subtitleurl = get('.srt')
  var posterurl = get('.jpg') ? get('.jpg') : get('.png')

  peli = peliurl[0]&&peliurl[0].url;
  subtitle = subtitleurl[0]&&subtitleurl[0].url;
  poster = posterurl[0]&&posterurl[0].url;

  const insertPeli = peli&&{nombre,year,peli,subtitle,poster}
  return insertPeli
};