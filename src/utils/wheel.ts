export const createPieSegmentsAngles = (slicesCount: number) => {
  const angles: number[][] = [];

  for (let i = 0; i < slicesCount; i++) {
    const fromAngle = (i * 360) / slicesCount;
    const toAngle = ((i + 1) * 360) / slicesCount;

    angles.push([fromAngle, toAngle]);
  }

  return angles;
};

export const createDSvgAttribute = (
  cx: number,
  cy: number,
  r: number,
  fromCoordX: number,
  fromCoordY: number,
  toCoordX: number,
  toCoordY: number
) => {
  return (
    "M" +
    cx +
    "," +
    cy +
    " L" +
    fromCoordX +
    "," +
    fromCoordY +
    " A" +
    r +
    "," +
    r +
    " 0 0,1 " +
    toCoordX +
    "," +
    toCoordY +
    "z"
  );
};

export const createSvgPie = (
  cx: number,
  cy: number,
  r: number,
  slicesCount: number
) => {
  let fromCoordX = 0;
  let fromCoordY = 0;
  let toCoordX = 0;
  let toCoordY = 0;
  let path: SVGPathElement;

  const fragment = document.createDocumentFragment();
  const angles = createPieSegmentsAngles(slicesCount);

  angles.forEach(([fromAngle, toAngle], idx) => {
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.id = "slice-" + idx;

    fromCoordX = cx + r * Math.cos((fromAngle * Math.PI) / 180);
    fromCoordY = cy + r * Math.sin((fromAngle * Math.PI) / 180);
    toCoordX = cx + r * Math.cos((toAngle * Math.PI) / 180);
    toCoordY = cy + r * Math.sin((toAngle * Math.PI) / 180);

    const d = createDSvgAttribute(
      cx,
      cy,
      r,
      fromCoordX,
      fromCoordY,
      toCoordX,
      toCoordY
    );
    path.setAttributeNS(null, "d", d);

    fragment.append(path);
  });

  return { pieFragment: fragment, angles };
};
