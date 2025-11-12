import { Cube } from '../entities/Cube.js';
import { Point } from '../entities/Point.js';

const EPSILON = 1e-10;

export enum CoordinatePlane {
  XY = 'XY',
  XZ = 'XZ',
  YZ = 'YZ',
}

export interface VolumeRatio {
  plane: CoordinatePlane;
  lowerVolume: number;
  upperVolume: number;
  ratio: number;
}

export class CubeService {
  public calculateSurfaceArea(cube: Cube): number {
    const { sideLength } = cube;
    return 6 * sideLength * sideLength;
  }

  public calculateVolume(cube: Cube): number {
    const { sideLength } = cube;
    return sideLength * sideLength * sideLength;
  }

  public isValidCube(_baseCenter: Point, sideLength: number): boolean {
    return sideLength > EPSILON;
  }

  public isBaseOnCoordinatePlane(
    cube: Cube,
  ): { isOnPlane: boolean; plane: CoordinatePlane | null } {
    const { baseCenter, sideLength } = cube;
    const halfSide = sideLength / 2;

    const isOnXY = Math.abs(baseCenter.z - halfSide) < EPSILON;
    const isOnXZ = Math.abs(baseCenter.y - halfSide) < EPSILON;
    const isOnYZ = Math.abs(baseCenter.x - halfSide) < EPSILON;

    if (isOnXY) {
      return { isOnPlane: true, plane: CoordinatePlane.XY };
    }
    if (isOnXZ) {
      return { isOnPlane: true, plane: CoordinatePlane.XZ };
    }
    if (isOnYZ) {
      return { isOnPlane: true, plane: CoordinatePlane.YZ };
    }

    return { isOnPlane: false, plane: null };
  }

  public calculateVolumeRatioByPlane(cube: Cube, plane: CoordinatePlane): VolumeRatio | null {
    const { baseCenter, sideLength } = cube;
    const halfSide = sideLength / 2;

    let planeCoordinate: number;
    let centerCoordinate: number;

    switch (plane) {
      case CoordinatePlane.XY:
        planeCoordinate = 0;
        centerCoordinate = baseCenter.z;
        break;
      case CoordinatePlane.XZ:
        planeCoordinate = 0;
        centerCoordinate = baseCenter.y;
        break;
      case CoordinatePlane.YZ:
        planeCoordinate = 0;
        centerCoordinate = baseCenter.x;
        break;
      default:
        return null;
    }

    const minCoord = centerCoordinate - halfSide;
    const maxCoord = centerCoordinate + halfSide;

    if (planeCoordinate <= minCoord || planeCoordinate >= maxCoord) {
      return null;
    }

    const lowerHeight = planeCoordinate - minCoord;
    const upperHeight = maxCoord - planeCoordinate;

    const lowerVolume = lowerHeight * sideLength * sideLength;
    const upperVolume = upperHeight * sideLength * sideLength;

    const ratio = Math.abs(upperVolume) < EPSILON ? 0 : lowerVolume / upperVolume;

    return {
      plane,
      lowerVolume,
      upperVolume,
      ratio,
    };
  }

  public getAllVolumeRatios(cube: Cube): VolumeRatio[] {
    const ratios: VolumeRatio[] = [];

    const planes = [CoordinatePlane.XY, CoordinatePlane.XZ, CoordinatePlane.YZ];

    planes.forEach((plane) => {
      const ratio = this.calculateVolumeRatioByPlane(cube, plane);
      if (ratio !== null) {
        ratios.push(ratio);
      }
    });

    return ratios;
  }

  public doesPlaneIntersectCube(cube: Cube, plane: CoordinatePlane): boolean {
    const { baseCenter, sideLength } = cube;
    const halfSide = sideLength / 2;

    let minCoord: number;
    let maxCoord: number;

    switch (plane) {
      case CoordinatePlane.XY:
        minCoord = baseCenter.z - halfSide;
        maxCoord = baseCenter.z + halfSide;
        break;
      case CoordinatePlane.XZ:
        minCoord = baseCenter.y - halfSide;
        maxCoord = baseCenter.y + halfSide;
        break;
      case CoordinatePlane.YZ:
        minCoord = baseCenter.x - halfSide;
        maxCoord = baseCenter.x + halfSide;
        break;
      default:
        return false;
    }

    return minCoord < EPSILON && maxCoord > EPSILON;
  }
}
