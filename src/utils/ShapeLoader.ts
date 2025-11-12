import { Shape } from '../entities/Shape.js';
import { ShapeFactory } from '../factories/ShapeFactory.js';
import { FileReader } from './FileReader.js';
import { logger } from './logger.js';

export class ShapeLoader {
  private fileReader: FileReader;

  constructor() {
    this.fileReader = new FileReader();
  }

  public async loadShapes(
    filePath: string,
    factory: ShapeFactory,
    shapeType: string,
  ): Promise<Shape[]> {
    logger.info(`Loading ${shapeType} shapes from ${filePath}`);

    const dataArray = await this.fileReader.readShapeData(filePath);
    const shapes: Shape[] = [];
    let shapeId = 1;

    dataArray.forEach((params, index) => {
      try {
        if (factory.validateParams(params)) {
          const shape = factory.createShape(
            `${shapeType}-${shapeId}`,
            `${shapeType} ${shapeId}`,
            params,
          );
          shapes.push(shape);
          logger.info(`Created ${shapeType} ${shapeId} from line ${index + 1}`);
          shapeId += 1;
        } else {
          logger.warn(`Invalid parameters for ${shapeType} at line ${index + 1}: ${params}`);
        }
      } catch (error) {
        logger.error(`Failed to create ${shapeType} from line ${index + 1}: ${error}`);
      }
    });

    logger.info(`Successfully loaded ${shapes.length} ${shapeType} shapes`);
    return shapes;
  }
}
