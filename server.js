
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
  var url = 'https://www.googleapis.com/customsearch/v1?q='+search+"&cx="+cx+"&key="+key;
  
getConnection(url).then(function(data){
  getFormattedArr(data).then(function(res){
    response.send(res);
  }).catch(function(err){
   if(err)console.log(err);
  });
}).catch(function(err){
if(err)console.log(err);
});
 
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


function getConnection(url){
  return new Promise(function(reject,resolve){
    var request = require('request');
        request(url, { json: true }, (err, res, body) => {
                if (err) { reject(err); }
                else{ resolve(body.items);}
        });
});
}

function getFormattedArr(data){
  return new Promise(function(reject,resolve){
    if(!data){
    reject("Data is NULL");
    }
    else{
      
      var formattedArr = [];
      var arrLen = data.length;
     
      for(var i = 0; i<arrLen; i++){
      formattedArr.push({
      url: data[i].pagemap.cse_image[i].src 
      //snippet: resultsArray[i].snippet,
      //context: resultsArray[i].link,
      //thumbnail: resultsArray[i].pagemap.cse_thumbnail[i].src 
      })
      
    }
    
      //console.log(formattedArr);
      resolve(formattedArr);
    }
  });
}


