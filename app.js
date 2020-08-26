const express = require('express');
const app = express();
const https = require('https');
const mongoose = require('mongoose');
const ClTrial = require('./Back-end/models/Model');
const ejs = require("ejs");
const bodyParser = require('body-parser');
//const controller = require('./Back-end/controllers/Controller');
const path = require ('path');
const { db } = require('./Back-end/models/Model');
app.use(express.static(path.join(__dirname + '../public')));

app.set('view engine', 'ejs');
app.set('views', './Back-end/views')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Connect to Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/clinicalTrials', { useNewUrlParser: true, useUnifiedTopology: true },() =>
    console.log('connected to DB!!!')
);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const Trial = mongoose.model('trial');

 
app.get("/", function(req, res) {
   
    res.sendFile(__dirname + '/index.html');
  
  });

app.get("/search",function(req,res){
  res.send("You have to type something at the search box and press submit")
});

/*app.get("/search/:condition",function(req,res){
  
  res.render('results',{dis: req.params.condition})
 //res.redirect("/search"+ req.body.condition)
});*/
Trial.createIndexes( {
  criteria: "$text",
  brief_summary: "$text"
} );


app.get("/search/:condition",function(req,res){
  Trial.find({'condition.cond_name':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  }},
  'url criteria brief_summary',function(err, trial) {
  var result = [];
  var result2 = [];
  var result3= [];
  for(var i of trial){
  var dict = {}
  
  //console.log('error here')
  dict['url']  = i.url;
  if(Trial.find({ 
            $and: [
              {'brief_summary':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  },
               'criteria':{ $regex: ".*"+req.params.condition+".*", $options: 'i'     }
   } ]}
    )) result.push(dict);
       
   else if(Trial.find({ 
      $and: [
        {'brief_summary':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  },
         'criteria':{ $regex:{ $ne: ".*"+req.params.condition+".*", $options: 'i'   }   }
} ]}
)) result2.push(dict);
  


  else if(Trial.find({ 
  $and: [
    {'criteria':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  },
     'brief_summary':{ $regex:{ $ne: ".*"+req.params.condition+".*", $options: 'i'   }   }
} ]}
)) result3.push(dict);
 
  else continue;
  
  /*if(Trial.find({'brief_summary':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  }},
  'url criteria brief_summary')!==null & Trial.find({'criteria':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  }},
  'url criteria brief_summary')!==null) {result.push(dict);}
   else if(Trial.find({'brief_summary':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  }},
  'url criteria brief_summary')==null & Trial.find({'criteria':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  }},
  'url criteria brief_summary')!==null) {result2.push(dict);}
   else if(Trial.find({'brief_summary':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  }},
  'url criteria brief_summary')!==null & Trial.find({'criteria':{ $regex: ".*"+req.params.condition+".*", $options: 'i'  }},
  'url criteria brief_summary')==null) {result3.push(dict);}
    else continue;*/
  //dict["criteriaCheckCond"]    = i.criteria.match(new RegExp(req.params.condition, "ig"));
  //dict['summaryCheckCond'] = i.brief_summary.match(new RegExp(req.params.condition, "ig"));
  
  /*if(dict["criteriaCheckCond"]!==null & dict['summaryCheckCond']!==null )
    result.push(dict);
  else if(dict["criteriaCheckCond"]==null & dict['summaryCheckCond']!==null )
    result2.push(dict);
  else if(dict["criteriaCheckCond"]!==null & dict['summaryCheckCond']==null )
    result3.push(dict);
  else 
    continue;*/
  /*if(i.find({criteria:$text , $search: "req.params.condition",brief_summary:$text , $search : "req.params.condition"}))
    result.push(dict);
  else if(i.find({criteria:$text , $search: "req.params.condition",brief_summary:$text , $search : "req.params.condition"}))
    result2.push(dict);
  else if(i.find({criteria:$text , $search: "req.params.condition",brief_summary:$text , $search : "req.params.condition"}))
    result3.push(dict);
  else
    continue;*/
  
  }
  var resultArray = JSON.parse(JSON.stringify(result));
  var resultArray2 = JSON.parse(JSON.stringify(result2));
  var resultArray3 = JSON.parse(JSON.stringify(result3));
  if (err)
      res.send(err);
  else
  for (i = 0; i < trial.length; i++) {

    resultArray[i] =  trial[i].url;
    resultArray2[i] = trial[i].url;
    resultArray3[i] = trial[i].url;
    }
  res.render("results",{dis : resultArray , length :resultArray.length,dis2 : resultArray2,length2: resultArray2.length,
  dis3 :resultArray3, length3:resultArray3.length})
  
  });  
});
  
  //console.log(i)
  

  
//var result_array = JSON.parse(JSON.stringify(result))
  // result_array.forEach(function(v) {
   // });
     
    // result_array =JSON.parse(JSON.stringify(result));
  //console.log(result_array);
      //  });
 // else{
  //res.render("results", {dis: result});

  

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});
//how do we start listening to the server
app.listen(3000);