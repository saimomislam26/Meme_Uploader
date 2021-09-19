const fs = require('fs')
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Meme } = require('../model/memes');


// const bucketName = process.env.AWS_BUCKET_NAME
// const region = process.env.AWS_REGION
// const accessKey = process.env.AWS_ACCESS_KEY
// const password = process.env.AWS_PASS
// creating an instance for S3


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

const MemePosts = async (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: "No File choosen" })


    var img = fs.readFileSync(req.file.path)
    var encoded_image = img.toString('base64')
    console.log(req.body.author)
    if (!req.body.author)
        return res.status(400).json({ message: "Fill The Author Field" })
    else {
        var finalImage = {
            author: req.body.author,
            image: {
                data: Buffer.from(encoded_image, 'base64'),
                contentType: req.file.mimetype
            }
        }

        Meme.create(finalImage, (err, item) => {
            if (err) {
                return res.status(400).json({ message: err })
            }
            else {
                return res.status(200).json({ message: "Meme Added successfully" })
            }
        });
    }

}


const MemeGet = async (req, res) => {
    const all = await Meme.find()
    res.send(all)

}


const statGet = async (req, res) => {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    const stat = await Meme.aggregate([
        {
            '$match': {
                'Date': {
                    '$gte': d
                }
            }
        },
        {
            '$group':
            {
                '_id': "$Date",
                'sum': { '$sum': 1 }
            }
        }
    ])

    res.send(stat)
}

router.route('/api/meme')
    .post(upload.single('file'), MemePosts)
    .get(MemeGet)

router.route('/api/stat')
    .get(statGet)

module.exports = router;