import pino from 'pino';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const projectRoot = join(currentDir, '..', '..');
const logFilePath = join(projectRoot, 'logs', 'app.log');

const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
    {
      level: 'info',
      target: 'pino/file',
      options: {
        destination: logFilePath,
        mkdir: true,
      },
    },
  ],
});

export const logger = pino({
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
}, transport);
