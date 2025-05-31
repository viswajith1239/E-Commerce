import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image is required'],
  },
  stock: {
    type: String,
    required: [true, 'Stock status is required'],
    enum: ['in_stock', 'out_of_stock'], // Restrict to valid values
    default: 'in_stock',
  },
  status: {
    type: String,
    enum: ['in_stock', 'out_of_stock'],
    default: 'in_stock',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Update status based on stock
productSchema.pre('save', function(next) {
  this.status = this.stock === 'in_stock' ? 'in_stock' : 'out_of_stock';
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;