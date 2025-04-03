const { PinoLogger } = require('@papdaew/shared');

const MessageBroker = require('#queues/configs/messageBroker.config.js');

class QueueEvents {
  #logger;
  #messageBroker;

  constructor() {
    this.#messageBroker = new MessageBroker();
    this.#logger = new PinoLogger().child({
      service: 'Queue Events',
    });
  }

  async publishQueueCreated(queue) {
    try {
      await this.#messageBroker.publishDirect(
        'queue.created',
        'QUEUE_CREATED',
        {
          id: queue.id,
          name: queue.name,
          vendorId: queue.vendorId,
          status: queue.status,
          createdAt: queue.createdAt,
        },
        'Queue created event published successfully'
      );
      this.#logger.info(`Published queue.created event for queue ${queue._id}`);
    } catch (error) {
      this.#logger.error(
        `Error publishing queue.created event: ${error.message}`
      );
    }
  }

  async publishQueueUpdated(queue) {
    try {
      await this.#messageBroker.publishDirect(
        'queue.updated',
        'QUEUE_UPDATED',
        {
          id: queue.id,
          name: queue.name,
          vendorId: queue.vendorId,
          status: queue.status,
          updatedAt: queue.updatedAt,
        },
        'Queue updated event published successfully'
      );
      this.#logger.info(`Published queue.updated event for queue ${queue._id}`);
    } catch (error) {
      this.#logger.error(
        `Error publishing queue.updated event: ${error.message}`
      );
    }
  }

  async publishUserEnqueued(queueItem, vendorId) {
    try {
      await this.#messageBroker.publishDirect(
        'queue.user.enqueued',
        'USER_ENQUEUED',
        {
          queueId: queueItem.queueId,
          userId: queueItem.userId,
          vendorId,
          number: queueItem.number,
          joinedAt: queueItem.joinedAt,
          estimatedWaitTime: queueItem.estimatedWaitTime,
        },
        'User enqueued event published successfully'
      );
      this.#logger.info(
        `Published queue.user.enqueued event for user ${queueItem.userId}`
      );
    } catch (error) {
      this.#logger.error(
        `Error publishing queue.user.enqueued event: ${error.message}`
      );
    }
  }

  async publishUserDequeued(queueItem) {
    try {
      await this.#messageBroker.publishDirect(
        'queue.user.dequeued',
        'USER_DEQUEUED',
        {
          queueId: queueItem.queueId,
          userId: queueItem.userId,
          number: queueItem.number,
          servedAt: queueItem.servedAt,
        },
        'User dequeued event published successfully'
      );
      this.#logger.info(
        `Published queue.user.dequeued event for user ${queueItem.userId}`
      );
    } catch (error) {
      this.#logger.error(
        `Error publishing queue.user.dequeued event: ${error.message}`
      );
    }
  }

  async publishUserExitedQueue(queueItem) {
    try {
      await this.#messageBroker.publishDirect(
        'queue.user.exited',
        'USER_EXITED',
        {
          queueId: queueItem.queueId,
          userId: queueItem.userId,
          number: queueItem.number,
          cancelledAt: queueItem.cancelledAt,
        },
        'User exited queue event published successfully'
      );
      this.#logger.info(
        `Published queue.user.exited event for user ${queueItem.userId}`
      );
    } catch (error) {
      this.#logger.error(
        `Error publishing queue.user.exited event: ${error.message}`
      );
    }
  }
}

module.exports = QueueEvents;
