const router = require("express").Router();
const Product = require("../models/product");

const upload = require("../middlewares/upload-photo");

// POST request  = create new product
router.post("/products", upload.single("photo"), async (req, res) => {
  try {
    let product = new Product(req.body);

    await product.save();

    res.json({
      success: true,
      message: "Successfilly create new product",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/products/getmanybyid", async (req, res) => {
  try {
    // ids = [ '1','2',.....]
    const { ids } = req.body;

    let arr = [];
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      const data = await Product.findById(id)
        .populate("colors.color colors.image capacities")
        .exec();
      // data = {id ='1', name='abc' ,.....}
      arr.push(data);
    }
    return res.json({
      success: true,
      data: arr,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/products/totalpage", async (req, res) => {
  const countProducts = await Product.countDocuments({});
  console.log(countProducts);
  res.status(200).json({
    totalPage: Math.ceil(countProducts / 10),
  });
});

//GET request = get all product
router.get("/products", async (req, res) => {
  try {
    let products = await Product.find()
      .select("-capacities -colors.color -colors._id")
      .populate("colors.image");

    res.json({
      success: true,
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//GET request = get all product
router.get("/products/filter", paginatedResults(Product), async (req, res) => {
  try {
    res.json({
      success: true,

      products: res.paginatedResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const priceFrom = req.query.priceFrom;
    const priceTo = req.query.priceTo;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    if (req.query.priceForm) results.priceForm = req.query.priceForm;
    if (req.query.priceTo) results.priceTo = req.query.priceTo;

    try {
      //.populate("colors.color colors.image capacities")
      res.paginatedResults = await model
        .find()
        .select("-capacities -colors.color -colors._id")
        .where("priceOnSales")
        .gt(priceFrom)
        .lt(priceTo)
        .populate("colors.image")
        .limit(limit)
        .skip(startIndex)
        .exec();
      next();
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  };
}

//GET-id request = get a single product
router.get("/products/:id", async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id })
      .populate("colors.color colors.image capacities")
      .exec();
    res.json({
      success: true,
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//PUT request = Update a single product
router.put("/products/:id", upload.single("photo"), async (req, res) => {
  try {
    let product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          photo: req.file.location,
          price: req.body.price,
          category: req.body.categoryID,
          stockQuantity: req.body.stockQuantity,
        },
      },
      {
        upsert: true,
      }
    );
    res.json({
      success: true,
      updateProduct: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//DELETE request = delete a single product
router.delete("/products/:id", async (req, res) => {
  try {
    let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });
    if (deletedProduct) {
      res.json({
        status: true,
        message: "Successfully deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get("/test", (req, res) => {
  const query = {};
  if (req.query.priceForm) query.priceForm = req.query.priceForm;
  if (req.query.priceTo) query.priceTo = req.query.priceTo;

  // TODO : lt là  < value | lte là <= value 
  // * Với  $lt ta sẽ filter được những giá trị < priceOnSales => URL phải là : .....?priceTo=value
  // TODO : gt là  > value | gte là >= value 
  // * Với  $gt ta sẽ filter được những giá trị > priceOnSales => URL phải là : .....?priceTo=value

  // ? Tại sao không thể kết hợp cả hai gt và lt 

  Product.find({'priceOnSales' : {$lt : query.priceTo }},(err,productWithPrice) =>{
    if(err) return res.json({status : 500 , error : err})
    if(!productWithPrice) return res.json({status: 400, error : "Products not found"})

    return res.json(productWithPrice)
  }).exec()

  // var query = Product.find().populate({ 
  //   path: 'reservations', ??????????
  //   match: { priceOnSales: { $gte: query.priceFrom, $lte: query.priceTo}}, // Important part of query.
  //   options: { sort: { priceOnSales: +1 }}
  // });
});



// * Đây là code mẫu cho filter với gt và lt
// ! Lưu ý 

router.get("/test1", async (req,res) =>{
  try {
    const queryObj = { ...req.query };
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq|ne)\b/g, match => `$${match}`);
    // queryStr  : {"ratings":{"$gt":"3"}}
    const posts = await Post.find(JSON.parse(queryStr));
    res.json({
        status: 'success',
        data: {
            posts
        }
    })
    // Order.find({ "articles.quantity": { "$gte": 5 } })
    // .select({ "articles.$": 1 })
    // .populate({
    //     "path": "articles.article",
    //     "match": { "price": { "$lte": 500 } }
    // }).exec(function(err,orders) {
    //    // populated and filtered twice
    // }
    // )
  } catch (err) {
    res.status(401).json({
        status: 'error',
        message: 'Error in post finding',
        error: err
    })
}})



module.exports = router;
