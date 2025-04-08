const { PinoLogger } = require('@papdaew/shared');

const QueueServer = require('#queues/server.js');
const EventSubscriber = require('#queues/events/subscribers/event.subscriber.js');
const MessageBroker = require('#queues/configs/messageBroker.config.js');
const Database = require('#queues/configs/database.config.js');
const Config = require('#queues/configs/config.js');

class Application {
  constructor() {
    this.config = new Config();
    this.appLogger = new PinoLogger({
      name: 'Queue Application',
      level: this.config.LOG_LEVEL,
      serviceVersion: this.config.SERVICE_VERSION,
      environment: this.config.NODE_ENV,
    });
    this.server = new QueueServer();
    this.database = new Database();
    this.messageBroker = new MessageBroker();
    this.eventSubscriber = new EventSubscriber();
  }

  initialize = async () => {
    this.appLogger.info('Initializing Queue Application');
    this.setupUncaughtException();
    await this.database.connect();
    await this.messageBroker.connect();
    await this.eventSubscriber.setupSubscriptions();
    this.server.start();
    this.setupUnhandledRejection();
    this.setupShutdown();
  };

  setupUncaughtException = () => {
    process.once('uncaughtException', error => {
      this.appLogger.error(error, `Uncaught Exception: ${error.name}`);
      process.exit(1);
    });
  };

  setupUnhandledRejection = () => {
    process.once('unhandledRejection', error => {
      this.appLogger.error(error, `Unhandled Rejection: ${error.name}`);
      this.server.close();
      process.exit(1);
    });
  };

  setupShutdown = () => {
    const shutdown = async () => {
      try {
        await this.database.disconnect();
        await this.messageBroker.disconnect();
        await this.server.close();
        process.exit(0);
      } catch (error) {
        this.appLogger.error(error, `Error during shutdown: ${error.name}`);
        process.exit(1);
      }
    };

    process.once('SIGTERM', shutdown);
    process.once('SIGINT', shutdown);
  };
}

const application = new Application();

application.initialize().catch(() => {
  application.appLogger.error('Error during application initialization');
  process.exit(1);
});
