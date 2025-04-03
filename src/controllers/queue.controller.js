const { StatusCodes } = require('http-status-codes');
const {
  asyncHandler,
  PinoLogger,
  BadRequestError,
} = require('@papdaew/shared');

const QueueService = require('#queues/services/queue.service.js');

class QueueController {
  #queueService;
  #logger;

  constructor() {
    this.#queueService = new QueueService();
    this.#logger = new PinoLogger().child({
      service: 'Queue Controller',
    });
  }

  createQueue = asyncHandler(async (req, res) => {
    this.#logger.info('POST: create queue');

    const queueData = {
      ...req.body,
      vendorId: req.body.vendorId,
    };

    const queue = await this.#queueService.createQueue(queueData);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: { queue },
    });
  });

  getQueueById = asyncHandler(async (req, res) => {
    this.#logger.info(`GET: queue by id ${req.params.id}`);

    const { id } = req.params;
    const queue = await this.#queueService.getQueueById(id);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { queue },
    });
  });

  getQueuesByVendor = asyncHandler(async (req, res) => {
    this.#logger.info(`GET: queues by vendor ${req.params.vendorId}`);

    const { vendorId } = req.params;
    const queues = await this.#queueService.getQueuesByVendor(vendorId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      results: queues.length,
      data: { queues },
    });
  });

  updateQueue = asyncHandler(async (req, res) => {
    this.#logger.info(`PATCH: update queue ${req.params.id}`);

    const { id } = req.params;
    const updateData = req.body;

    const queue = await this.#queueService.updateQueue(id, updateData);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { queue },
    });
  });

  deleteQueue = asyncHandler(async (req, res) => {
    this.#logger.info(`DELETE: delete queue ${req.params.id}`);

    const { id } = req.params;
    await this.#queueService.deleteQueue(id);

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Queue deleted successfully',
    });
  });

  // Queue Operations
  enqueue = asyncHandler(async (req, res) => {
    this.#logger.info(`POST: enqueue to ${req.params.queueId}`);

    const { queueId } = req.params;
    const { userId, notes } = req.body;

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const queueItem = await this.#queueService.enqueue(queueId, userId, notes);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: { queueItem },
    });
  });

  dequeue = asyncHandler(async (req, res) => {
    this.#logger.info(`POST: dequeue from ${req.params.queueId}`);

    const { queueId } = req.params;

    const queueItem = await this.#queueService.dequeue(queueId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { queueItem },
    });
  });

  exitQueue = asyncHandler(async (req, res) => {
    this.#logger.info(`POST: exit queue ${req.params.queueId}`);

    const { queueId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const queueItem = await this.#queueService.exitQueue(queueId, userId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: { queueItem },
    });
  });

  getQueueStatus = asyncHandler(async (req, res) => {
    this.#logger.info(`GET: queue status for ${req.params.queueId}`);

    const { queueId } = req.params;

    const status = await this.#queueService.getQueueStatus(queueId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: status,
    });
  });

  getUserPosition = asyncHandler(async (req, res) => {
    this.#logger.info(`GET: user position in queue ${req.params.queueId}`);

    const { queueId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const position = await this.#queueService.getUserPosition(queueId, userId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: position,
    });
  });
}

module.exports = QueueController;
