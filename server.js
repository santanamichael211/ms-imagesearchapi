
// init project
var express = require('express');
var prettyjson = require('prettyjson');
var app = express();





// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.get("/api/imagesearch/:search",(request, response)=>{
  var search = request.params.search;
  search = search.replace(/\s/g,"+");
  var cx = '003066421765772510641:fqbs-hzafsq';
  var key = "AIzaSyC1-YQaSgU9Evazx36rCrtB_py6azRTvow";
  var request = require('request');
  
request('https://www.googleapis.com/customsearch/v1?q='+search+"&cx="+cx+"&key="+key, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  var resultsArray = body.items;
  
  //response.send(resultsArray[0].pagemap.cse_thumbnail[0].src);
  
  

  setObjArr(resultsArray).then()

    //response.send(finalResults);
  
  
});

  
 
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function setObjArr(resultsArray){
  return new Promise((resolve, reject) => {
    
    var formattedArr = [];
    var arrLen = resultsArray.length;
    
    for(var i = 0; i<arrLen; i++){
      formattedArr.push({
      url: resultsArray[i].pagemap.cse_image[i].src ,
      snippet: resultsArray[i].snippet,
      context: resultsArray[i].link,
      thumbnail: resultsArray[i].pagemap.cse_thumbnail[i].src 
      })
    }
  
    
    resolve(formattedArr);
  });
}