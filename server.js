
// init project
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;


var uri = "mongodb://user:pass@ds035766.mlab.com:35766/freecodedb";


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.get("/api/imagesearch/:search",(request, response)=>{
  var offset = 10;
  if(request.query.offset){
    offset = request.query.offset;
  }
  var term = request.params.search;
  var search = term.replace(/\s/g,"+");
  var cx = '003066421765772510641:fqbs-hzafsq';
  var key = "AIzaSyC1-YQaSgU9Evazx36rCrtB_py6azRTvow";
  var url = 'https://www.googleapis.com/customsearch/v1?q='+search+"&cx="+cx+"&num="+offset+"&key="+key;
  
getConnection(url).then(function(data){
    return getFormattedArr(data);
}).catch(function(err){
response.send(400,err);
}).then(function(formatted){
  response.send(JSON.stringify(formatted));
}).catch(function(err){
response.send(400,err);
});
  
connectToDb().then(function(collection){
            var date = new Date();
        collection.insert({
          term:term,
          when:date
                      });
  console.log("Added to database");
}).catch(function(err){
response.send(400,err);
});
 
});

app.get("/api/latest/imagesearch",function(request,response){
connectToDb().then(function(collection){
  
  var projection = {
  _id:0,
  term:1,
  when:1  
  }
  
    var results = collection.find({}).limit(10);
    results.project(projection);
  
    results.toArray(function(err,resultA){
        response.send(resultA);
    });
}).catch(function(err){
response.send(400,err);
})
  
});




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


let getConnection = function(url){
  return new Promise(function(resolve,reject){
    var request = require('request');
        request(url, { json: true }, (err, res, body) => {
                if(err){ reject(err); }
                else{ console.log(url); resolve(body.items);}
        });
});
}

let getFormattedArr = function (data){
  return new Promise(function(resolve,reject){
    if(!data){
    reject("Data is NULL! This is usually caused by setting the offset parameter greater than 10. Please try a lesser value.");
    }
    else{
      
      var formattedArr = [];
      var arrLen = data.length;
     
      for(var i = 0; i<arrLen; i++){
        
      formattedArr.push({
      url: data[i].pagemap.cse_image[0].src,
      snippet: data[i].snippet,
      context: data[i].link,
      thumbnail: data[i].pagemap.cse_thumbnail[0].src 
      })
    }
      resolve(formattedArr);
    }
  });
}

let connectToDb = function(){
  return new Promise(function(resolve,reject){
    mongo.connect(uri,{ useNewUrlParser: true },(err,database)=>{
      if(err){reject(err);}
		var db = database.db("freecodedb");
		var collection = db.collection("imagesearch",function(err,collection){
         if(err){reject(err);}
          else{
          resolve(collection);
          }
    });
        });
  });
}


