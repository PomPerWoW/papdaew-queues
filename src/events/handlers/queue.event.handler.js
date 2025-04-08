const { PinoLogger } = require('@papdaew/shared');

const QueueService = require('#queues/services/queue.service.js');

class QueueEventHandler {
  #logger;
  #queueService;

  constructor() {
    this.#queueService = new QueueService();
    this.#logger = new PinoLogger().child({
      service: 'Queue Event Handler',
    });
  }

  handleBranchCreated = async event => {
    try {
      const { data } = event;

      this.#logger.info(
        { branchId: data.branchId, vendorId: data.vendorId },
        'Received branch.created event, creating main queue'
      );

      // Create a default queue for the branch
      const queueData = {
        name: `${data.branchName} Main Queue`,
        description: `Default queue for ${data.branchName}`,
        branchId: data.branchId,
        vendorId: data.vendorId,
        status: 'active',
        maxSize: 100,
      };

      const queue = await this.#queueService.createQueue(queueData);

      this.#logger.info(
        { queueId: queue.id, branchId: data.branchId },
        'Created main queue for branch'
      );

      return queue;
    } catch (error) {
      this.#logger.error(error, 'Error handling branch.created event');
    }
  };
}

module.exports = QueueEventHandler;
