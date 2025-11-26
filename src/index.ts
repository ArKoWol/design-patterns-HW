import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TriangleFactory } from './factories/TriangleFactory.js';
import { CubeFactory } from './factories/CubeFactory.js';
import { ShapeLoader } from './utils/ShapeLoader.js';
import { ShapeRepository } from './repository/ShapeRepository.js';
import { ShapeQueryService } from './repository/ShapeQueryService.js';
import { Warehouse } from './warehouse/Warehouse.js';
import { logger } from './utils/logger.js';
import {
  TypeSpecification,
  FirstQuadrantSpecification,
  AreaRangeSpecification,
  VolumeRangeSpecification,
  DistanceFromOriginRangeSpecification,
} from './specifications/ShapeSpecifications.js';
import { ShapeComparators } from './comparators/ShapeComparators.js';
import { Triangle } from './entities/Triangle.js';
import { Cube } from './entities/Cube.js';
import { Point } from './entities/Point.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const projectRoot = join(currentDir, '..');

async function main() {
  try {
    logger.info('=== Starting Shapes Application with Repository and Warehouse ===\n');

    const trianglesFilePath = join(projectRoot, 'data', 'triangles.txt');
    const cubesFilePath = join(projectRoot, 'data', 'cubes.txt');

    const triangleFactory = new TriangleFactory();
    const cubeFactory = new CubeFactory();
    const shapeLoader = new ShapeLoader();

    // Initialize Repository and Warehouse
    const repository = new ShapeRepository();
    const queryService = new ShapeQueryService(repository);
    const warehouse = Warehouse.getInstance();

    logger.info('1. LOADING SHAPES FROM FILES');
    const triangles = await shapeLoader.loadShapes(
      trianglesFilePath,
      triangleFactory,
      'Triangle',
    );
    const cubes = await shapeLoader.loadShapes(
      cubesFilePath,
      cubeFactory,
      'Cube',
    );

    // Add shapes to repository and register with warehouse
    logger.info(`\n2. ADDING ${triangles.length + cubes.length} SHAPES TO REPOSITORY`);
    [...triangles, ...cubes].forEach((shape) => {
      repository.add(shape);
      shape.addObserver(warehouse);
      warehouse.update(shape);
    });
    logger.info(`Repository now contains ${repository.count()} shapes`);
    logger.info(`Warehouse stores metrics for ${warehouse.getMetricsCount()} shapes\n`);

    // Demonstrate Specification pattern
    logger.info('3. QUERYING SHAPES USING SPECIFICATIONS');

    const allTriangles = queryService.query(new TypeSpecification('Triangle'));
    logger.info(`Found ${allTriangles.length} triangles`);

    const firstQuadrantShapes = queryService.query(new FirstQuadrantSpecification());
    logger.info(`Found ${firstQuadrantShapes.length} shapes in first quadrant`);

    const midAreaTriangles = queryService.query(new AreaRangeSpecification(1, 10));
    logger.info(`Found ${midAreaTriangles.length} triangles with area between 1 and 10`);

    const largeCubes = queryService.query(new VolumeRangeSpecification(100, 2000));
    logger.info(`Found ${largeCubes.length} cubes with volume between 100 and 2000`);

    const nearOrigin = queryService.query(new DistanceFromOriginRangeSpecification(0, 5));
    logger.info(`Found ${nearOrigin.length} shapes within distance 5 from origin\n`);

    // Demonstrate Comparator pattern
    logger.info('4. SORTING SHAPES USING COMPARATORS');

    const sortedById = queryService.sort(ShapeComparators.byId());
    logger.info('Sorted by ID:');
    sortedById.slice(0, 5).forEach((shape) => {
      logger.info(`  - ${shape.id}: ${shape.name}`);
    });

    const sortedByName = queryService.sort(ShapeComparators.byName());
    logger.info('Sorted by Name:');
    sortedByName.slice(0, 5).forEach((shape) => {
      logger.info(`  - ${shape.name} (${shape.getType()})`);
    });

    const sortedByDistance = queryService.sort(ShapeComparators.byDistanceFromOrigin());
    logger.info('Sorted by distance from origin:');
    sortedByDistance.slice(0, 5).forEach((shape) => {
      logger.info(`  - ${shape.name}`);
    });

    // Demonstrate Observer pattern
    logger.info('\n5. DEMONSTRATING OBSERVER PATTERN');
    const testTriangle = repository.findById('Triangle-1');
    if (testTriangle instanceof Triangle) {
      const oldMetrics = warehouse.getMetrics('Triangle-1');
      logger.info(`Before change: Area = ${oldMetrics?.area?.toFixed(2)}, Perimeter = ${oldMetrics?.perimeter?.toFixed(2)}`);

      logger.info('Modifying triangle point C...');
      testTriangle.setPointC(new Point(
        testTriangle.pointC.x,
        testTriangle.pointC.y + 2,
        testTriangle.pointC.z,
      ));

      const newMetrics = warehouse.getMetrics('Triangle-1');
      logger.info(`After change:  Area = ${newMetrics?.area?.toFixed(2)}, Perimeter = ${newMetrics?.perimeter?.toFixed(2)}`);
    }

    const testCube = repository.findById('Cube-1');
    if (testCube instanceof Cube) {
      const oldMetrics = warehouse.getMetrics('Cube-1');
      logger.info(`\nBefore change: Volume = ${oldMetrics?.volume?.toFixed(2)}, Surface Area = ${oldMetrics?.surfaceArea?.toFixed(2)}`);

      logger.info('Modifying cube side length...');
      testCube.setSideLength(testCube.sideLength * 1.5);

      const newMetrics = warehouse.getMetrics('Cube-1');
      logger.info(`After change:  Volume = ${newMetrics?.volume?.toFixed(2)}, Surface Area = ${newMetrics?.surfaceArea?.toFixed(2)}`);
    }

    // Demonstrate composite specifications
    logger.info('\n6. COMPOSITE SPECIFICATIONS (AND/OR/NOT)');
    const triangleSpec = new TypeSpecification('Triangle');
    const firstQuadSpec = new FirstQuadrantSpecification();
    const trianglesInFirstQuad = queryService.query(triangleSpec.and(firstQuadSpec));
    logger.info(`Triangles in first quadrant: ${trianglesInFirstQuad.length}`);

    const notInFirstQuad = queryService.query(firstQuadSpec.not());
    logger.info(`Shapes NOT in first quadrant: ${notInFirstQuad.length}`);

    // Show warehouse contents
    logger.info('\n7. WAREHOUSE METRICS SUMMARY');
    const allMetrics = warehouse.getAllMetrics();
    logger.info(`Total shapes tracked: ${allMetrics.size}`);
    let triangleCount = 0;
    let cubeCount = 0;
    allMetrics.forEach((metrics) => {
      if (metrics.area !== undefined) {
        triangleCount += 1;
      }
      if (metrics.volume !== undefined) {
        cubeCount += 1;
      }
    });
    logger.info(`Triangles: ${triangleCount}, Cubes: ${cubeCount}`);

    logger.info('\n=== Application completed successfully ===');
  } catch (error) {
    logger.error(`Application error: ${error}`);
    process.exit(1);
  }
}

main();
