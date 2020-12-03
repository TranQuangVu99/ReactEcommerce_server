const router = require('express').Router()

const Color  = require('../models/color')

// POST request
router.post('/colors',async (req,res)=>{
    try {
        const color = new Color()
        color.indexColor = req.body.indexColor
        color.nameColor = req.body.nameColor
        color.plusCost = req.body.plusCost
        await color.save()
        
        res.json({
            success: true,
            message: "Successfully created a new color"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

//GET request
router.get('/colors', async (req,res)=>{
    try {
        let colors = await Color.find()
        res.json({
            success : true,
            colors: colors
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

//PUT request = Update a single product 
router.put("/colors/:id", async (req, res) => {
    try {
      let colors = await Color.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            indexColor : req.body.indexColor,
            nameColor : req.body.nameColor,
            plusCost : req.body.plusCost
          },
        },
        {
          upsert: true,
        }
      );
      res.json({
        success: true,
        updateColors: colors,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

//DELETE request = delete a single product 
router.delete('/colors/:id',async (req,res) =>{
    try {
      let deletedColor = await Color.findOneAndDelete({_id : req.params.id})
      if(deletedColor){
        res.json({
          status : true,
          message : "Successfully deleted"
        })
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
module.exports = router