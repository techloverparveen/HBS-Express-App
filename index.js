const express = require('express');
const app = express();
const port = 3000;
const  textract = require('textract');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const Doc =  require('./models/doc');
const mongoose = require('mongoose')
const  mongoURI =  "mongodb://localhost:27017/testDB" // MongoDB config


//setting HBS as template engine
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    helpers: require("./public/helper.js").helpers, 
    defaultLayout: 'planB',
    partialsDir: __dirname + '/views/partials/'
}));


app.use(express.static('public'))

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json({ limit: '500mb' }));

// Connect to MongoDB
mongoose.connect(
    mongoURI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }
)
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


/**
 * Function is used to save doc data to DB
 * @param {object} data
 * @returns {Object} Success/failure object
 */
let saveData = (data) => {
    return new Promise((resolve,reject)=>{
        Doc.update({is_deleted:true},{$set:{doc_data:data}},{upsert:true}).then(function(doc){
            resolve(doc)
        }).catch(function(err){
            console.error(err);
            reject(err);
        })
    })
}

/**
 * Home API route responsible for parsing the doc data and render the same to HTML page at client side
 */
app.get('/', (req, res) => {
    let filePath = "/home/parveen/Downloads/example.docx";
    textract.fromFileWithMimeAndPath("application/vnd.openxmlformats-officedocument.wordprocessingml.document", filePath, function( error, text ) {
        res.render('main', {layout: 'index', docData:text});
       
     }) 
});
/**
 * Route is ued to save the data into DB, invoke on click of confirmation by user
 */
app.post('/save',(req,res) => {
    if(req.body){
        saveData(req.body).then(function(doc){
            console.log("Data saved successfully!")
            res.send("Data saved successfully!")
        }).catch(function(err){
            console.error(err);
            console.error("error while saving doc data to DB",err);
        })
    }
    else{
        console.error("No data error");
    }
    
})

app.listen(port, () => console.log(`App listening to port ${port}`));