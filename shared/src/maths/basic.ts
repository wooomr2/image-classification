import { IBoundary, Point } from '../types'

const equals = (p1: Point, p2: Point): boolean => {
  if (p1.length !== p2.length) {
    return false
  }

  for (let i = 0; i < p1.length; i++) {
    if (p1[i] !== p2[i]) {
      return false
    }
  }

  return true
}

const add = (p1: Point, p2: Point): Point => {
  const point: Point = []
  for (let i = 0; i < p1.length; i++) {
    point[i] = p1[i] + p2[i]
  }

  return point
}

const subtract = (p1: Point, p2: Point): Point => {
  const point: Point = []
  for (let i = 0; i < p1.length; i++) {
    point[i] = p1[i] - p2[i]
  }

  return point
}

const scale = (p: Point, scaler: number): Point => {
  const point: Point = []
  for (let i = 0; i < p.length; i++) {
    point[i] = p[i] * scaler
  }

  return point
}

const magnitude = (p: Point): number => {
  let num = 0
  for (let i = 0; i < p.length; i++) {
    num += p[i] ** 2
  }

  return Math.sqrt(num)
}

const unit = (p: Point): Point => {
  return scale(p, 1 / magnitude(p))
}

const dot = (p1: Point, p2: Point): number => {
  let dot = 0
  for (let i = 0; i < p1.length; i++) {
    dot += p1[i] * p2[i]
  }

  return dot
}

// v = a + (b - a) * t
const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t
}

//  t = (v - a) / (b - a)
const invLerp = (a: number, b: number, v: number): number => {
  return (v - a) / (b - a)
}

/** 0: old, 1: new */
const remap = (a0: number, b0: number, a1: number, b1: number, v: number): number => {
  return lerp(a1, b1, invLerp(a0, b0, v))
}

const remapPoint = (oldBounds: IBoundary, newBounds: IBoundary, point: Point): Point => {
  return [
    remap(oldBounds.left, oldBounds.right, newBounds.left, newBounds.right, point[0]),
    remap(oldBounds.top, oldBounds.bottom, newBounds.top, newBounds.bottom, point[1]),
  ]
}

const sqDist = (p1: Point, p2: Point): number => {
  let sqDist = 0
  for (let i = 0; i < p1.length; i++) {
    sqDist += (p1[i] - p2[i]) ** 2
  }

  return sqDist
}

const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(sqDist(p1, p2))
}

/**
 * Heron's Formula
 * Area = Math.sqrt(p(p-a)(p-b)(p-c)) where p = (a+b+c)/2
 *  */
const triangleArea = (A: Point, B: Point, C: Point) => {
  const a = distance(B, C)
  const b = distance(A, C)
  const c = distance(A, B)
  const p = (a + b + c) / 2

  return Math.sqrt(p * (p - a) * (p - b) * (p - c))
}

const getNearestIndex = (loc: Point, points: Point[]): number => {
  let minDist = Number.MAX_SAFE_INTEGER
  let nearestIndex = 0

  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const dist = distance(loc, point)
    if (dist < minDist) {
      minDist = dist
      nearestIndex = i
    }
  }

  return nearestIndex
}

const getNearestIndices = (loc: Point, points: Point[], k = 1): number[] => {
  const indices = points
    .map((point, idx) => ({ idx, dist: distance(loc, point) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k)
    .map(item => item.idx)

  return indices
}

const normalizePoints = (points: Point[], minMax?: { min: number[]; max: number[] }) => {
  let min: number[]
  let max: number[]
  const dimension = points[0].length

  if (minMax) {
    min = minMax.min
    max = minMax.max
  } else {
    min = [...points[0]]
    max = [...points[0]]
    for (let i = 1; i < points.length; i++) {
      for (let j = 0; j < dimension; j++) {
        min[j] = Math.min(min[j], points[i][j])
        max[j] = Math.max(max[j], points[i][j])
      }
    }
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < dimension; j++) {
      points[i][j] = invLerp(min[j], max[j], points[i][j])
    }
  }

  return { min, max }
}

export {
  add,
  distance,
  dot,
  equals,
  getNearestIndex,
  getNearestIndices,
  invLerp,
  lerp,
  magnitude,
  normalizePoints,
  remap,
  remapPoint,
  scale,
  sqDist,
  subtract,
  triangleArea,
  unit,
}
