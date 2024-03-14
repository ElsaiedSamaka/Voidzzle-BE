// Packages
import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
});

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
