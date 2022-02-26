module.exports = {
    mutipleMongoosetoObject: function(mongooseArrays) {
        return mongooseArrays.map(mongoose => mongoose.toObject());
    },
    mongoosetoObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
};