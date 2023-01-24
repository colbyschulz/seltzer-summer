export const getEffectiveTime = ({
  timeInSeconds,
  distanceInMeters,
  effectiveDistanceInMeters,
}: {
  timeInSeconds: number;
  distanceInMeters: number;
  effectiveDistanceInMeters: number;
}) => Math.round(timeInSeconds * (effectiveDistanceInMeters / distanceInMeters) ** 1.06);
