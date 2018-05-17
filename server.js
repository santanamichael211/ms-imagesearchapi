
// init project
var express = require('express');
var app = express();



// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


app.get("/api/imagesearch/:search",(request, response)=>{
  var search = request.params.search;
  
  response.write(
  "<script> (function() {var cx = '003066421765772510641:fqbs-hzafsq'; var gcse = document.createElement('script'); gcse.type = 'text/javascript'; gcse.async = true; gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;" +
    "var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gcse, s); })(); </script> <gcse:search></gcse:search>");
  
  
  
  
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
