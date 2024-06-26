import mongoose from 'mongoose';
import slugify from 'slugify';

// Plugins
import toJSON from './plugins/index';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true
    },
    slug: String,
    mainImage: {
      type: String,
      required: [false, '']
    },
    mainImageId: String,
    images: {
      type: [String],
      required: [false, '']
    },
    imagesId: Array,
    description: {
      type: String,
      required: [true, 'A product must have a description']
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    // TODO: make priceAfterDiscount related to price and not required
    priceAfterDiscount: {
      type: Number,
      default: function (value) {
        // this only points to current doc on NEW documnet creation
        return (
          Number(this.price) -
          (Number(this.price) / 100) * Number(this.priceDiscount || 0)
        );
      }
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current doc on NEW documnet creation
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    colors: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Color'
      }
    ],
    sizes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Size'
      }
    ],
    quantity: {
      type: Number,
      default: 0
    },
    // TODO: make sure that sold related to quantity
    sold: {
      type: Number,
      default: 0
    },
    // TODO: make sure that outOfStock related to quantity
    isOutOfStock: {
      type: Boolean,
      default: false
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);

productSchema.index(
  { name: 1, category: 1, price: 1, ratingsAverage: -1 },
  { unique: true }
);
productSchema.index({ slug: 1 });

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
productSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const populatedProduct = await this.populate({
        path: 'seller',
        select: 'email'
      }).execPopulate();

      this.seller = populatedProduct.seller; // Replace the seller ObjectId with the populated seller object
    } catch (error) {
      // Handle any errors
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  this.slug = slugify(this.name, { lower: true });
  next();
});
const Product = mongoose.model('Product', productSchema);

export default Product;
