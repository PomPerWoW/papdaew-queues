const mongoose = require('mongoose');

const queueItemSchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
      required: [true, 'Queue ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
    },
    number: {
      type: Number,
      required: [true, 'Queue number is required'],
    },
    status: {
      type: String,
      enum: ['waiting', 'served', 'cancelled', 'no-show'],
      default: 'waiting',
    },
    estimatedWaitTime: {
      type: Number,
      default: 0, // in minutes
    },
    notes: {
      type: String,
      trim: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    servedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
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

// Virtual for retrieving the queue
queueItemSchema.virtual('queue', {
  ref: 'Queue',
  localField: 'queueId',
  foreignField: '_id',
  justOne: true,
});

// Indexes
queueItemSchema.index({ queueId: 1, status: 1 });
queueItemSchema.index({ userId: 1, status: 1 });

// Calculate position in queue
queueItemSchema.methods.getPosition = async function () {
  const QueueItem = this.constructor;

  // Count items ahead in the queue (with lower numbers that are still waiting)
  const position = await QueueItem.countDocuments({
    queueId: this.queueId,
    status: 'waiting',
    number: { $lt: this.number },
  });

  return position + 1; // +1 because position is 0-indexed
};

// Update status methods
queueItemSchema.methods.markAsServed = async function () {
  this.status = 'served';
  this.servedAt = new Date();
  return this.save();
};

queueItemSchema.methods.markAsCancelled = async function () {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  return this.save();
};

queueItemSchema.methods.markAsNoShow = async function () {
  this.status = 'no-show';
  this.cancelledAt = new Date();
  return this.save();
};

// Statics
queueItemSchema.statics.getActiveItemsInQueue = async function (queueId) {
  return this.find({ queueId, status: 'waiting' }).sort({ number: 1 });
};

queueItemSchema.statics.getItemByUserAndQueue = async function (
  userId,
  queueId
) {
  return this.findOne({ userId, queueId, status: 'waiting' });
};

const QueueItem = mongoose.model('QueueItem', queueItemSchema);

module.exports = QueueItem;
