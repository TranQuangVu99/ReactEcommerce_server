const router = require('express').Router()
const Photo = require('../models/photo')

const upload = require('../middlewares/upload-photo')

// POST request  = create new product
router.post('/photos',upload.single('photo'), async(req,res) =>{
  try {
    let photo = new Photo()

    photo.photo = req.file.location

    await photo.save()

        res.json({
            success : true,
            message : "Successfilly create new photo"
        })
  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
  })
  }
    
})
//GET request
router.get('/photos', async (req,res)=>{
    try {
        let photos = await Photo.find()
        res.json({
            success : true,
            photos: photos
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

//PUT request = Update a single product 
router.put("/photos/:id", async (req, res) => {
    try {
      let colors = await Color.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            photo : req.file.location,
            color : req.body.color
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
router.delete('/photos/:id',async (req,res) =>{
    try {
      let deletedPhoto = await Photo.findOneAndDelete({_id : req.params.id})
      if(deletedPhoto){
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