const { PinoLogger } = require('@papdaew/shared');

const QueueEventHandler = require('#queues/events/handlers/queue.event.handler.js');
const MessageBroker = require('#queues/configs/messageBroker.config.js');

class EventSubscriber {
  #logger;
  #messageBroker;
  #queueEventHandler;

  constructor() {
    this.#messageBroker = new MessageBroker();
    this.#queueEventHandler = new QueueEventHandler();
    this.#logger = new PinoLogger().child({
      service: 'Event Subscriber',
    });
  }

  setupSubscriptions = async () => {
    try {
      // Subscribe to branch created events
      await this.#messageBroker.subscribeDirect(
        'branch.created',
        this.#queueEventHandler.handleBranchCreated
      );

      this.#logger.info('Event subscriptions set up successfully');
    } catch (error) {
      this.#logger.error(error, 'Failed to set up event subscriptions');
      throw error;
    }
  };
}

module.exports = EventSubscriber;
