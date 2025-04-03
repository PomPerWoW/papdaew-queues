const {
  PinoLogger,
  NotFoundError,
  BadRequestError,
} = require('@papdaew/shared');

const QueueItem = require('#queues/models/queueItem.model.js');
const Queue = require('#queues/models/queue.model.js');
const QueueEvents = require('#queues/events/publishers/queue.publisher.js');

class QueueService {
  #logger;
  #queueEvents;

  constructor() {
    this.#logger = new PinoLogger().child({
      service: 'Queue Service',
    });
    this.#queueEvents = new QueueEvents();
  }

  // Queue Management
  async createQueue(queueData) {
    try {
      const queue = await Queue.create(queueData);
      this.#logger.info(`Queue created: ${queue._id}`);

      // Publish event
      await this.#queueEvents.publishQueueCreated(queue);

      return queue;
    } catch (error) {
      this.#logger.error(`Error creating queue: ${error.message}`);
      throw error;
    }
  }

  async getQueueById(queueId) {
    const queue = await Queue.findById(queueId);
    if (!queue) {
      throw new NotFoundError(`Queue with ID ${queueId} not found`);
    }
    return queue;
  }

  async getQueuesByVendor(vendorId) {
    return Queue.getQueuesByVendor(vendorId);
  }

  async updateQueue(queueId, updateData) {
    const queue = await Queue.findByIdAndUpdate(queueId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!queue) {
      throw new NotFoundError(`Queue with ID ${queueId} not found`);
    }

    this.#logger.info(`Queue updated: ${queueId}`);

    // Publish event
    await this.#queueEvents.publishQueueUpdated(queue);

    return queue;
  }

  async deleteQueue(queueId) {
    // Soft delete by marking as inactive
    const queue = await Queue.findByIdAndUpdate(
      queueId,
      { isActive: false },
      { new: true }
    );

    if (!queue) {
      throw new NotFoundError(`Queue with ID ${queueId} not found`);
    }

    this.#logger.info(`Queue deleted: ${queueId}`);

    // Publish event
    await this.#queueEvents.publishQueueUpdated(queue);

    return queue;
  }

  // Queue Item Management
  async enqueue(queueId, userId, notes = '') {
    // Check if queue exists and is active
    const queue = await this.getQueueById(queueId);

    if (queue.status !== 'active') {
      throw new BadRequestError(`Queue is not active`);
    }

    // Check if user is already in queue
    const existingItem = await QueueItem.getItemByUserAndQueue(userId, queueId);

    if (existingItem) {
      throw new BadRequestError(`User already in queue`);
    }

    // Get next number
    const number = await queue.enqueue();

    // Create queue item
    const queueItem = await QueueItem.create({
      queueId,
      userId,
      number,
      notes,
    });

    // Calculate estimated wait time
    queueItem.estimatedWaitTime =
      queue.averageWaitTime * (await queueItem.getPosition());
    await queueItem.save();

    this.#logger.info(
      `User ${userId} enqueued to queue ${queueId} with number ${number}`
    );

    // Publish event
    await this.#queueEvents.publishUserEnqueued(queueItem, queue.vendorId);

    return queueItem;
  }

  async dequeue(queueId) {
    // Find the first waiting item in the queue
    const queueItem = await QueueItem.findOne({
      queueId,
      status: 'waiting',
    }).sort({ number: 1 });

    if (!queueItem) {
      throw new NotFoundError(`No items waiting in queue ${queueId}`);
    }

    // Mark as served
    await queueItem.markAsServed();

    this.#logger.info(
      `User ${queueItem.userId} dequeued from queue ${queueId}`
    );

    // Publish event
    await this.#queueEvents.publishUserDequeued(queueItem);

    return queueItem;
  }

  async exitQueue(queueId, userId) {
    // Find the user's item in the queue
    const queueItem = await QueueItem.getItemByUserAndQueue(userId, queueId);

    if (!queueItem) {
      throw new NotFoundError(`User not found in queue`);
    }

    // Mark as cancelled
    await queueItem.markAsCancelled();

    this.#logger.info(`User ${userId} exited queue ${queueId}`);

    // Publish event
    await this.#queueEvents.publishUserExitedQueue(queueItem);

    return queueItem;
  }

  async getQueueStatus(queueId) {
    // Get the queue
    const queue = await this.getQueueById(queueId);

    // Get active items
    const items = await QueueItem.getActiveItemsInQueue(queueId);

    return {
      queue,
      currentNumber: queue.currentNumber,
      waitingCount: items.length,
      items,
    };
  }

  async getUserPosition(queueId, userId) {
    const queueItem = await QueueItem.getItemByUserAndQueue(userId, queueId);

    if (!queueItem) {
      throw new NotFoundError(`User not found in queue`);
    }

    const position = await queueItem.getPosition();
    const queue = await this.getQueueById(queueId);

    return {
      queue,
      queueItem,
      position,
      estimatedWaitTime: queueItem.estimatedWaitTime,
    };
  }
}

module.exports = QueueService;
