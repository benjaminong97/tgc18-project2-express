//set up express app
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const MongoUtil = require('./MongoUtil');

const mongoURI = process.env.MONGO_URI;

let app = express();
app.use(express.json());
app.use(cors());

async function main() {
    let db = await MongoUtil.connect(mongoURI, "outfits")

    app.post("/outfits/create", async (req, res) => {

        let title = req.body.title;
        let fashionTypes = req.body["fashion-type"]; //array of existing fashion types object id
        let newFashionType = req.body["new-fashion-type"]; //array of new fashion types in text
        let fashionDescription = req.body["fashion-description"]
        let headWear = req.body["head-wear"]
        let hair = req.body.hair
        let outerwear = req.body.outerwear
        let top = req.body.top
        let bottom = req.body.bottom
        let shoes = req.body.shoes
        let accessories = req.body.accessories
        let contributor = req.body.contributor

        try {
            if (newFashionType) {
                let newFashionTypeArr = [];
                for (fashionType in newFashionType){
                    let resultTags = await db.collection("tags").insertOne({
                        "fashion-type" : newFashionType
                    })
                    //push inserted id
                    newFashionTypeArr.push()
                }
            }
            
            let resultOutfits = await db.collection("outfits").insertOne({
                title : title,
                top : top,
                bottom: bottom,
                hair: hair,
                "fashion-type" : [...fashionType, ...newFashionType]
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

    app.post("/outfits/tags/create" , async (req,res) => {
        let 
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

        let results = await db.collection("outfits").find(criteria).toArray();

        res.status(200);
        res.send(results)
    })

    app.put("/outfits/edit/:id", async (req,res) => {
        //assume that all keys are updated
        let title = req.body.title;
        let fashionType = req.body["fashion-type"];
        let fashionDescription = req.body["fashion-description"]
        let headWear = req.body["head-wear"]
        let hair = req.body.hair
        let outerwear = req.body.outerwear
        let top = req.body.top
        let bottom = req.body.bottom
        let shoes = req.body.shoes
        let accessories = req.body.accessories
        let contributor = req.body.contributor

        let results = await db.collection('outfits').updateOne({
            _id : ObjectId(req.params.id)
        }, {
            '$set' : {
                title : title,
                top: top,
                bottom: bottom

            }
        }
        )
        res.send(results)
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