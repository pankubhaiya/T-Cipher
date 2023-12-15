const mongoose = require("mongoose")

const BMISchema = mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  feet: {
    type: Number,
  },
  inches:{
    type: Number,
    default:0
  },
  result: {
    type: String,
    required: true,
  },
}, {
  versionKey: false
})

const BMI = mongoose.model("BMI", BMISchema)

module.exports =  BMI 