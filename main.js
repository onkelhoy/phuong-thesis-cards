const cards = [
  {
    title: "nflasf lf fljs dfljs dfkjsdf",
    body: "Some body text",
    type: "Some type"
  }
]

window.onload = () => {
  const template = document.querySelector('template');

  buildOutline(template);

  for (const card of cards)
  {
    const clone = template.content.cloneNode(true);
    clone.querySelector('textPath#title').textContent = card.title;
    document.body.appendChild(clone);
  }
}

// remember that text will "hang" so textdistance should atleast be r + text height
function buildOutline(template, r = 8, textdistance=15) 
{
  const points = [
    {x:   0, y: 15},
    {x:  20, y: 100},
    {x:  80, y: 100},
    {x: 100, y: 15},
    {x:  50, y: 0}, // top 
  ];
  const cache = {};
  const outline = getCurvedPath(points, r, cache);

  const center = points.reduce((p, c) => {
    p.x += c.x;
    p.y += c.y;

    return p;
  }, {x:0,y:0});

  center.x /= points.length;
  center.y /= points.length;

  const innerpoints = [];
  for (let i=0; i<points.length; i++)
  {
    const angletocenter = Math.atan2(center.y - points[i].y, center.x - points[i].x)
    innerpoints.push({
      x: points[i].x + Math.cos(angletocenter) * textdistance,
      y: points[i].y + Math.sin(angletocenter) * textdistance + textdistance*0.2,
    });
  }

  const text = getCurvedPath(innerpoints, r);

  template.content.querySelector('path[id=outline]').setAttribute('d', outline);
  template.content.querySelector('path[id=text]').setAttribute('d', text);
}

function getCurvedPath(points, r, cache = {})
{
  let curve = "";
  for (let i=0; i<points.length; i++)
  {
    const current = points[i];
    const prev = points[(i - 1 + points.length) % points.length]
    const next = points[(i + 1) % points.length];

    // const CP = getPointInfo(current, prev);
    // const CN = getPointInfo(current, next);

    const info = arc(current, prev, next, r);
    cache[i] = info;
    
    if (i === 0)
    {
      curve += `M${info.b.x},${info.b.y} `
    }
    else if (i !== points.length - 1)
    {
      curve += `L${info.a.x},${info.a.y} `
      curve += `A${r},${r},0,0,0,${info.b.x},${info.b.y} `
    }
    else {
      curve += `Q${current.x},${current.y},${cache[0].a.x},${cache[0].a.y}`
      curve += `A${r},${r},0,0,0,${cache[0].b.x},${cache[0].b.y} `
    }
  }

  return curve;
}

function getPointInfo(a, b)
{
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  const angle = Math.atan2(dy, dx);
  const mag = Math.sqrt(dx*dx + dy*dy);

  return {
    dx, dy,
    angle,
    mag
  }
}

function arcpoint(a, b, r)
{
  const info = getPointInfo(a, b);
  const pos = {
    x: a.x + Math.cos(info.angle) * r,
    y: a.y + Math.sin(info.angle) * r,
  }

  return {
    ...info,
    ...pos,
  }
}

function arc(P, prev, next, r = 8) {

  // this part to calculate angle between 3 points vABC
  // delta points
  const BA = {x: prev.x - P.x, y: prev.y - P.y};
  const BC = {x: next.x - P.x, y: next.y - P.y};

  // dot product + magnitudes 
  const dotproduct = BA.x * BC.x + BA.y * BC.y;
  const mBA = Math.sqrt(BA.x*BA.x + BA.y*BA.y);
  const mBC = Math.sqrt(BC.x*BC.x + BC.y*BC.y);

  // finally we get angle, which we have to split into 2, 
  // as we have 2 triangles in the circle point
  const angle = Math.acos(dotproduct / (mBA * mBC)) / 2;  

  // this 
  const length = r / Math.tan(angle);

  const arcpointa = arcpoint(P, prev, length);
  const arcpointb = arcpoint(P, next, length);
  // const distance = 

  return {
    a: arcpointa,
    b: arcpointb,
    angle,
    length,
  }
}