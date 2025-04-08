const QUEUE_CREATED = {
  type: 'object',
  required: ['id', 'name', 'vendorId', 'status', 'createdAt'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    vendorId: { type: 'object' },
    status: { type: 'string', enum: ['active', 'paused', 'closed'] },
    createdAt: { type: 'object' },
  },
};

const QUEUE_UPDATED = {
  type: 'object',
  required: ['id', 'name', 'vendorId', 'status', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    vendorId: { type: 'object' },
    status: { type: 'string', enum: ['active', 'paused', 'closed'] },
    updatedAt: { type: 'object' },
  },
};

const BRANCH_CREATED = {
  type: 'object',
  required: ['vendorId', 'branchId', 'branchName'],
  properties: {
    vendorId: { type: 'string' },
    branchId: { type: 'string' },
    branchName: { type: 'string' },
    branchCode: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'object' },
  },
};

const USER_ENQUEUED = {
  type: 'object',
  required: ['queueId', 'userId', 'number', 'joinedAt', 'estimatedWaitTime'],
  properties: {
    queueId: { type: 'object' },
    userId: { type: 'object' },
    number: { type: 'number' },
    joinedAt: { type: 'object' },
    estimatedWaitTime: { type: 'number' },
  },
};

const USER_DEQUEUED = {
  type: 'object',
  required: ['queueId', 'userId', 'number', 'servedAt'],
  properties: {
    queueId: { type: 'object' },
    userId: { type: 'object' },
    number: { type: 'number' },
    servedAt: { type: 'object' },
  },
};

const USER_EXITED = {
  type: 'object',
  required: ['queueId', 'userId', 'number', 'cancelledAt'],
  properties: {
    queueId: { type: 'object' },
    userId: { type: 'object' },
    number: { type: 'number' },
    cancelledAt: { type: 'object' },
  },
};

module.exports = {
  QUEUE_CREATED,
  QUEUE_UPDATED,
  BRANCH_CREATED,
  USER_ENQUEUED,
  USER_DEQUEUED,
  USER_EXITED,
};
