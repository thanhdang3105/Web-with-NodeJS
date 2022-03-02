module.exports = {
    mutipleMongoosetoObject: function(mongooseArrays) {
        return mongooseArrays.map(mongoose => mongoose.toObject());
    },
    mongoosetoObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
    setImageProducts: function(files) {
        if(files.imageProducts.length){
            const imageProducts = [...files.imageProducts].map(img =>{
                return img.originalFilename
            })
            return imageProducts
        }
        else{
            return files.imageProducts.originalFilename
        }
    }
};