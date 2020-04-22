const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const docSchema = new Schema({
   doc_data:{
    type:Object
   },
   is_deleted:{
       type:Boolean,
       default: false
   },
  

},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports = Doc = mongoose.model("doc", docSchema);
