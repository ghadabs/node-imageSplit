var express = require('express')
const bodyparser = require('body-parser');
var app = express()
const download = require('image-downloader')
app.use(bodyparser.json())
var publicDir = require('path').join(__dirname, '/images');
var imageToSlices = require('image-to-slices');
var sizeOf = require('image-size');
app.use(express.static(publicDir));
const fs=require('fs')
imageToSlices.configure({
    clipperOptions: {
        canvas: require('canvas')
    }
});
app.post('/', function (req, res) {
    const random= Date.now();//timestamp
    fs.mkdirSync('./images/'+random);
    console.log(random);
    // Download to a directory and save with the original filename
    const options = {
        url: req.body.url,
        dest: 'images/'+random                  // Save to /path/to/dest/image.jpg
    }
    download.image(options)
        .then(({ filename, image }) => {
            console.log('File saved to', filename)


            var dimensions = sizeOf('images/XpgonN0X.jpg');
            console.log(dimensions.width, dimensions.height);
            
            var n = req.body.n

            var width = dimensions.width / n
            var height = dimensions.height / n
            var lineXArray = [];
            var lineYArray = [];
            for (i = 1; i < n; i++) {
                lineYArray.push(width * i)
            }
            for (i = 1; i < n; i++) {
                lineXArray.push(height * i)
            }
            var source = '/images/XpgonN0X.jpg';
            fs.mkdirSync('./split/'+random+'/')

            console.log(lineXArray, lineYArray);
            imageToSlices(filename, lineYArray, lineXArray, {
                saveToDir: './split/'+random+'/'
                // saveToDir: true ,
                //saveToDataUrl: true

            }, function (data) {
                const imgArray=[]
                for(let i=1;i<=n*n;i++)
                imgArray.push('http://localhost:4000/images/'+random+'/section-'+i+'.jpg')
                
                res.send({images:imgArray})
            });

        })
        .catch((err) => {
            console.error(err)
        })
})
app.get('/images/:dir/:image', function (req, res) {
    res.sendFile("/split/"+req.params.dir+"/"+req.params.image, { root: __dirname })

});

app.listen(4000)


