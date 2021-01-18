module.exports.addProduct = async(req, res) => {
    console.log(req.file);
    try {
        const { name, price, description } = req.body;
        const productNew = new Product({
            name,
            price,
            description,
            productImage: req.file.path,
        });

        const product = await productNew.save();
        res.status(200).json({ msg: "Product Added ", CreatedProduct: product });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server Error");
    }
};

module.exports.getAllProducts = async(req, res) => {
    try {
        const product = await Product.find().select(
            "name price  description productImage"
        );
        //console.log(product);
        res
            .status(200)
            .json({ Total_product: product.length, All_Product_List: product });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server Error");
    }
};

module.exports.getProductsId = async(req, res) => {
    try {
        const id = req.params.productId;
        //console.log(id);
        const productData = await Product.findById(id).select(
            "name price description productImage"
        );
        if (!productData) {
            return res.status(400).json({ msg: "product Id not found", id });
        } else {
            res.status(200).json(productData);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports.updateProductById = async(req, res) => {
    try {
        const id = req.params.productId;
        // console.log(id);
        const product = await Product.findByIdAndUpdate(
            id, {...req.body, productImage: req.file.path }, {
                new: true,
            }
        );
        //console.log(product);
        //console.log("adac", req.file.path);

        if (!product) {
            return res.status(400).json({
                msg: "no product with this Id",
            });
        } else {
            return res
                .status(200)
                .json({ msg: "Update record succesfully ", product });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports.deleteProductById = async(req, res) => {
    try {
        const id = req.params.productId;
        console.log(id);
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(400).json({ msg: "Product Id Not Found!" });
        return res
            .status(200)
            .json({ msg: "Product Delete Successfully", productdelete: product });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};