export const getEffectiveTime = ({
  timeInSeconds,
  distanceInMeters,
  effectiveDistanceInMeters,
}: {
  timeInSeconds: number;
  distanceInMeters: number;
  effectiveDistanceInMeters: number;
}) => (timeInSeconds * (effectiveDistanceInMeters / distanceInMeters)) ^ 1.06;
