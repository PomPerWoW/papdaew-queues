const { PinoLogger } = require('@papdaew/shared');

const MessageBroker = require('#queues/configs/messageBroker.config.js');

class QueueEvents {
  #messageBroker;
  #logger;
  #exchange;

  constructor() {
    this.#messageBroker = new MessageBroker();
    this.#logger = new PinoLogger().child({
      service: 'Queue Events',
    });
    this.#exchange = 'queues';
  }

  async publishQueueCreated(queue) {
    try {
      await this.#messageBroker.publish(this.#exchange, 'queue.created', {
        id: queue._id,
        name: queue.name,
        vendorId: queue.vendorId,
        status: queue.status,
        createdAt: queue.createdAt,
      });
      this.#logger.info(`Published queue.created event for queue ${queue._id}`);
    } catch (error) {
      this.#logger.error(
        `Error publishing queue.created event: ${error.message}`
      );
    }
  }

  async publishQueueUpdated(queue) {
    try {
      await this.#messageBroker.publish(this.#exchange, 'queue.updated', {
        id: queue._id,
        name: queue.name,
        vendorId: queue.vendorId,
        status: queue.status,
        updatedAt: queue.updatedAt,
      });
      this.#logger.info(`Published queue.updated event for queue ${queue._id}`);
    } catch (error) {
      this.#logger.error(
        `Error publishing queue.updated event: ${error.message}`
      );
    }
  }

  async publishUserEnqueued(queueItem) {
    try {
      await this.#messageBroker.publish(this.#exchange, 'queue.user.enqueued', {
        queueId: queueItem.queueId,
        userId: queueItem.userId,
        number: queueItem.number,
        joinedAt: queueItem.joinedAt,
        estimatedWaitTime: queueItem.estimatedWaitTime,
      });
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
      await this.#messageBroker.publish(this.#exchange, 'queue.user.dequeued', {
        queueId: queueItem.queueId,
        userId: queueItem.userId,
        number: queueItem.number,
        servedAt: queueItem.servedAt,
      });
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
      await this.#messageBroker.publish(this.#exchange, 'queue.user.exited', {
        queueId: queueItem.queueId,
        userId: queueItem.userId,
        number: queueItem.number,
        cancelledAt: queueItem.cancelledAt,
      });
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
