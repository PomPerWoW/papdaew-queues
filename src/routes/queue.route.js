const express = require('express');

const QueueController = require('#queues/controllers/queue.controller.js');

class QueueRoutes {
  #router;
  #queueController;

  constructor() {
    this.#router = express.Router();
    this.#queueController = new QueueController();
  }

  setup() {
    // Queue Management Routes
    this.#router.post('/', this.#queueController.createQueue);
    this.#router.get('/', this.#queueController.getAllQueues);
    this.#router.get('/all', this.#queueController.getAllQueues);
    this.#router.get(
      '/vendor/:vendorId',
      this.#queueController.getQueuesByVendor
    );
    this.#router.get(
      '/branch/:branchId',
      this.#queueController.getQueuesByBranch
    );
    this.#router.get('/:id', this.#queueController.getQueueById);
    this.#router.patch('/:id', this.#queueController.updateQueue);
    this.#router.delete('/:id', this.#queueController.deleteQueue);

    // Queue Operations Routes
    this.#router.post('/:queueId/enqueue', this.#queueController.enqueue);
    this.#router.post('/:queueId/dequeue', this.#queueController.dequeue);
    this.#router.post('/:queueId/exit', this.#queueController.exitQueue);
    this.#router.get('/:queueId/status', this.#queueController.getQueueStatus);
    this.#router.get(
      '/:queueId/position',
      this.#queueController.getUserPosition
    );

    return this.#router;
  }
}

module.exports = QueueRoutes;
