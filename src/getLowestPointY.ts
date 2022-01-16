import { Keypoint } from '@tensorflow-models/pose-detection'

const getLowestPointY = (keypoints: Keypoint[]): number => {
  return Math.max(...keypoints.map(({ y }) => y))
}

export default getLowestPointY
