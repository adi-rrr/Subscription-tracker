import { Client } from '@upstash/qstash';
import { QSTASH_TOKEN } from './Env.js';

const WorkflowClient = new Client({
    token: QSTASH_TOKEN,
});

export { WorkflowClient };