//set up express app
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const MongoUtil = require('./MongoUtil');

const mongoURI = process.env.MONGO_URI;
const validation = require('./Middlewares/validationMiddleware')
const apparelSchema = require('./Validations/costValidation');
const { date } = require('yup');

let app = express();
app.use(express.json());
app.use(cors());


async function main() {
    let db = await MongoUtil.connect(mongoURI, "outfits")

    app.post("/outfits/create",validation(apparelSchema), async (req, res) => {
        let dateAdded = new Date()
        let month = dateAdded.toLocaleString('default', { month: 'long' })
        let year = dateAdded.getFullYear()
        let day = dateAdded.getDate()
        let fullDate = day + " " + month + " " + year

        let title = req.body.title;
        // let fashionType = req.body["fashion-type"]; //array of existing fashion types object id
        // let newFashionType = req.body["new-fashion-type"]; //array of new fashion types in text
        let fashionDescription = req.body["fashionDescription"]
        
        let head = req.body.head
        let top = req.body.top
        let bottom = req.body.bottom
        let shoes = req.body.shoes
        let accessories = req.body.accessories
        let contributor = req.body.contributor
        let outfitImage = req.body["outfitImage"]
        let tags = req.body.tags
        

        try {
            // if (newFashionType) {
            //     let newFashionTypeArr = [];
            //     for (fashionType in newFashionType){
            //         let resultTags = await db.collection("tags").insertOne({
            //             "fashion-type" : newFashionType
            //         })
            //         //push inserted id
            //         newFashionTypeArr.push()
            //     }
            // }
            
            let resultOutfits = await db.collection("outfits").insertOne({
                title : title,
                top : top,
                bottom: bottom,
                head: head,
                // "fashion-type" : [...fashionType], //...newFashionType],
                "fashionDescription" : fashionDescription,
                head: head,
                shoes: shoes,
                accessories: accessories,
                contributor: contributor,
                outfitImage : outfitImage,
                dateAdded : fullDate,
                tags : tags

            });
            
            
            res.status(200);
            res.send(resultOutfits)
            
        } catch (e) {
            res.status(500);
            res.send({
                error: "internal server error"
            });
            console.log(e)
        }

    })

    app.put("/outfit/comment" , async (req,res) => {
        let dateAdded = new Date()
        let month = dateAdded.toLocaleString('default', { month: 'long' })
        let year = dateAdded.getFullYear()
        let day = dateAdded.getDate()
        let hours = dateAdded.getHours()
        let minutes = dateAdded.getMinutes()
        let newComment = req.body.newComment
        let id = req.body.id
        let fullDate = day + " " + month + " " + year + ", " + hours
        + ":" + minutes
        console.log(id)
        let resultOutfit = await db.collection("outfits").updateOne({
            _id : ObjectId(id)
        },
        {$push : {
            comments : { comment : newComment,
            time : fullDate}
        }}
        )
        res.status(200)
        res.send(resultOutfit)
    } 

    )

    app.delete("/outfits/delete/:id", async (req, res) => {
        let results = await db.collection("outfits").remove({
            _id: ObjectId(req.params.id)
        })
        res.status(200);
        res.send({
            message: "Delete Done"
        })
    })

    app.get("/outfits", async (req,res) => {
        let criteria = {};

        if (req.query.tags) {
            criteria['tags'] = {$regex: req.query.tags}
        }

        if (req.query["id"]) {
            criteria["_id"] = ObjectId(req.query["id"])
        }

        let results = await db.collection("outfits").find(criteria).toArray();

        res.status(200);
        res.send(results)
    })

    app.get("/outfit", async (req,res) => {
        let criteria = {}
        if (req.query["id"]) {
            criteria["_id"] = ObjectId(req.query["id"])
        }

        let results = await db.collection("outfits").findOne(criteria)
        res.status(200);
        res.send(results)
    })

    app.get("/myoutfit/search", async (req,res) => {
        let results = await db.collection("outfits").find({contributor : {$in : [req.query.query]}}).toArray();
        res.status(200)
        res.send(results)
    })

    app.get("/outfit/search", async (req,res) => {
        let criteria = {}
        

        if (req.query.category === "title" || req.query.category ==="contributor") {
            criteria[req.query.category] = {$regex: req.query["query"], $options : "i"}
            let results = await db.collection("outfits").find(criteria).toArray();
            res.status(200);
            res.send(results)
        }
        else if (req.query.category === "top") {
            let cat = req.query.category
            let catName = req.query.querycatname
            let question = req.query.query
            // criteria[cat] = [catName]
            // criteria.cat[catName] = {$regex: question, $options: "i"}
            
            // criteria[cat] = {[catName] : {$regex: question, $options: "i"}}
            // console.log(criteria)
            

            
            let results = await db.collection("outfits").find({
                "top.topName":{$regex: req.query["query"], $options : "i"}
                
            }).toArray()
            console.log(results)
            res.status(200)
            res.send(results)
        }
        else if (req.query.category === "bottom") {
            let results = await db.collection("outfits").find({
                "bottom.bottomName":{$regex: req.query["query"], $options : "i"}
                
            }).toArray()
            res.status(200)
            res.send(results)
        }
        else if (req.query.category === "shoes") {
            let results = await db.collection("outfits").find({
                "bottom.bottomName":{$regex: req.query["query"], $options : "i"}
                
            }).toArray()
            res.status(200)
            res.send(results)
        }

       
    })

   

    app.get("/tags", async (req,res) => {
        let criteria = {}
        let results = await db.collection("tags").find(criteria).toArray();

        res.status(200);
        res.send(results)
    })

    app.put("/outfits/edit/:id", async (req,res) => {
        let dateAdded = new Date()
        let month = dateAdded.toLocaleString('default', { month: 'long' })
        let year = dateAdded.getFullYear()
        let day = dateAdded.getDate()
        let fullDate = day + " " + month + " " + year

        let title = req.body.title;
        // let fashionType = req.body["fashion-type"]; //array of existing fashion types object id
        // let newFashionType = req.body["new-fashion-type"]; //array of new fashion types in text
        let fashionDescription = req.body["fashionDescription"]
        
        let head = req.body.head
        let top = req.body.top
        let bottom = req.body.bottom
        let shoes = req.body.shoes
        let accessories = req.body.accessories
        let contributor = req.body.contributor
        let outfitImage = req.body["outfitImage"]
        let tags = req.body.tags
        

        try {
            // if (newFashionType) {
            //     let newFashionTypeArr = [];
            //     for (fashionType in newFashionType){
            //         let resultTags = await db.collection("tags").insertOne({
            //             "fashion-type" : newFashionType
            //         })
            //         //push inserted id
            //         newFashionTypeArr.push()
            //     }
            // }
            
            let resultOutfits = await db.collection("outfits").updateOne({
                _id: ObjectId(req.params.id)
            },
                
                {$set: {
                title : title,
                top : top,
                bottom: bottom,
                head: head,
                // "fashion-type" : [...fashionType], //...newFashionType],
                "fashionDescription" : fashionDescription,
                head: head,
                shoes: shoes,
                accessories: accessories,
                contributor: contributor,
                outfitImage : outfitImage,
                dateAdded : fullDate,
                tags : tags

            }});
            
            
            res.status(200);
            res.send(resultOutfits)
            
        } catch (e) {
            res.status(500);
            res.send({
                error: "internal server error"
            });
            console.log(e)
        }
    })


}
main()

// app.get("/all_outfits", async (req,res) => {
//     let criteria = {};
//     if (req.query.description) {
//         criteria['description'] = {$regex : req.query.description, $options: "i"}
//     }
//     if (req.query.food)
// })



app.listen(3000, () => {
    console.log("server has started")
})