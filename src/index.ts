import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TriangleFactory } from './factories/TriangleFactory.js';
import { CubeFactory } from './factories/CubeFactory.js';
import { ShapeLoader } from './utils/ShapeLoader.js';
import { TriangleService } from './services/TriangleService.js';
import { CubeService } from './services/CubeService.js';
import { Triangle } from './entities/Triangle.js';
import { Cube } from './entities/Cube.js';
import { logger } from './utils/logger.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const projectRoot = join(currentDir, '..');

async function main() {
  try {
    logger.info('Starting Shapes Application');

    const trianglesFilePath = join(projectRoot, 'data', 'triangles.txt');
    const cubesFilePath = join(projectRoot, 'data', 'cubes.txt');

    const triangleFactory = new TriangleFactory();
    const cubeFactory = new CubeFactory();
    const shapeLoader = new ShapeLoader();

    const triangleService = new TriangleService();
    const cubeService = new CubeService();

    logger.info('Loading triangles from file...');
    const triangles = await shapeLoader.loadShapes(
      trianglesFilePath,
      triangleFactory,
      'Triangle',
    );

    logger.info(`Loaded ${triangles.length} triangles`);

    triangles.forEach((shape) => {
      const triangle = shape as Triangle;
      logger.info(`\n=== Processing ${triangle.name} ===`);
      
      const area = triangleService.calculateArea(triangle);
      const perimeter = triangleService.calculatePerimeter(triangle);
      const types = triangleService.getTriangleTypes(triangle);

      logger.info(`Area: ${area.toFixed(4)}`);
      logger.info(`Perimeter: ${perimeter.toFixed(4)}`);
      logger.info(`Types: ${types.join(', ')}`);
      logger.info(`Is valid triangle: ${triangleService.isValidTriangle(
        triangle.pointA,
        triangle.pointB,
        triangle.pointC,
      )}`);
    });

    logger.info('\n\nLoading cubes from file...');
    const cubes = await shapeLoader.loadShapes(
      cubesFilePath,
      cubeFactory,
      'Cube',
    );

    logger.info(`Loaded ${cubes.length} cubes`);

    cubes.forEach((shape) => {
      const cube = shape as Cube;
      logger.info(`\n=== Processing ${cube.name} ===`);

      const surfaceArea = cubeService.calculateSurfaceArea(cube);
      const volume = cubeService.calculateVolume(cube);
      const baseOnPlane = cubeService.isBaseOnCoordinatePlane(cube);
      const volumeRatios = cubeService.getAllVolumeRatios(cube);

      logger.info(`Surface Area: ${surfaceArea.toFixed(4)}`);
      logger.info(`Volume: ${volume.toFixed(4)}`);
      logger.info(`Is valid cube: ${cubeService.isValidCube(cube.baseCenter, cube.sideLength)}`);
      logger.info(`Base on coordinate plane: ${baseOnPlane.isOnPlane ? baseOnPlane.plane : 'No'}`);
      
      if (volumeRatios.length > 0) {
        logger.info('Volume ratios by coordinate planes:');
        volumeRatios.forEach((ratio) => {
          logger.info(`  ${ratio.plane} plane - Lower: ${ratio.lowerVolume.toFixed(2)}, Upper: ${ratio.upperVolume.toFixed(2)}, Ratio: ${ratio.ratio.toFixed(4)}`);
        });
      } else {
        logger.info('No coordinate plane intersections');
      }
    });

    logger.info('\n\nApplication completed successfully');
  } catch (error) {
    logger.error(`Application error: ${error}`);
    process.exit(1);
  }
}

main();

