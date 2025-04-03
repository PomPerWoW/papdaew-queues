const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Queue name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Vendor ID is required'],
    },
    currentNumber: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'closed'],
      default: 'active',
    },
    maxSize: {
      type: Number,
      default: 100,
    },
    averageWaitTime: {
      type: Number,
      default: 0, // in minutes
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Virtual for retrieving the current queue items
queueSchema.virtual('items', {
  ref: 'QueueItem',
  localField: '_id',
  foreignField: 'queueId',
});

// Methods
queueSchema.methods.enqueue = async function () {
  // Increment current number and return it
  this.currentNumber += 1;
  await this.save();
  return this.currentNumber;
};

// Static methods
queueSchema.statics.getQueuesByVendor = async function (vendorId) {
  return this.find({ vendorId, isActive: true });
};

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
