import { readFile } from 'fs/promises';
import { FileReadException } from '../exceptions/index.js';
import { logger } from './logger.js';

const NUMBER_PATTERN = /^-?\d+\.?\d*$/;

export class FileReader {
  public async readLines(filePath: string): Promise<string[]> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter((line) => line.trim().length > 0);
      logger.info(`Successfully read ${lines.length} lines from ${filePath}`);
      return lines;
    } catch (error) {
      logger.error(`Failed to read file ${filePath}: ${error}`);
      throw new FileReadException(`Cannot read file: ${filePath}`);
    }
  }

  public parseLine(line: string): number[] | null {
    try {
      const parts = line.trim().split(/\s+/);

      if (parts.every((part) => NUMBER_PATTERN.test(part))) {
        return parts.map((part) => parseFloat(part));
      }

      logger.warn(`Invalid line format: ${line}`);
      return null;
    } catch (error) {
      logger.warn(`Error parsing line: ${line}, error: ${error}`);
      return null;
    }
  }

  public async readShapeData(filePath: string): Promise<number[][]> {
    const lines = await this.readLines(filePath);
    const validData: number[][] = [];

    lines.forEach((line, index) => {
      const parsed = this.parseLine(line);
      if (parsed !== null) {
        validData.push(parsed);
        logger.debug(`Line ${index + 1} parsed successfully: ${parsed}`);
      } else {
        logger.warn(`Skipping invalid line ${index + 1}: ${line}`);
      }
    });

    logger.info(`Parsed ${validData.length} valid entries from ${lines.length} lines`);
    return validData;
  }
}
