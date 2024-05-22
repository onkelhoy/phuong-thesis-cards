const cards = [
  // intention
  {
    title: "Who",
    question: "is the design user?",
    target: "user",
    category: "intention"
  },
  {
    title: "Why",
    question: "does design need to be made?",
    target: "need(s)",
    category: "intention"
  },
  {
    title: "What",
    question: "is the story of use for the design?",
    target: "intimacy",
    category: "intention"
  },
  {
    title: "What",
    question: "is needed knowledge for self-understanding of the project?",
    target: "self-understanding",
    category: "intention"
  },
  {
    title: "What",
    question: "is needed knowledge for self-understanding of the design solution?",
    target: "self-understanding",
    category: "intention"
  },
  {
    title: "How",
    question: "to develop and select ideas?",
    target: "idea",
    category: "intention"
  },
  // implementation
  {
    title: "What",
    question: "aspect can increase the longevity of the design?",
    target: "longevity",
    category: "implementation"
  },
  {
    title: "How",
    question: "to reduce materials waste during design making?",
    target: "waste",
    category: "implementation"
  },
  {
    title: "Which",
    question: "information the users should know about the design?",
    target: "transparency",
    category: "implementation"
  },
  {
    title: "Which",
    question: "is the leading sustainable focus of the design?",
    target: "sustainability",
    category: "implementation"
  },
  {
    title: "What",
    question: "is the design purpose?",
    target: "purpose",
    category: "implementation"
  },
  {
    title: "What",
    question: "needs to be done before ideation?",
    target: "ideation",
    category: "implementation"
  },
  {
    title: "How",
    question: "can emotional attachment be brought to the design?",
    target: "emotional attachment",
    category: "implementation"
  },
  {
    title: "Which",
    question: "social context that the design is used for? ",
    target: "society",
    category: "implementation"
  },
  {
    title: "Which",
    question: "cultural context is the design based on?",
    target: "culture",
    category: "implementation"
  },
  {
    title: "Is",
    question: "the design considered eco-design? And why?",
    target: "eco-design",
    category: "implementation"
  },
  {
    title: "Is",
    question: "the design considered circular design? And why?",
    target: "circular design",
    category: "implementation"
  },
  {
    title: "Efficiency",
    question: "on which aspect? economy, society or environment?",
    target: "efficiency",
    category: "implementation"
  },
  // attainment
  {
    title: "Reduce-reuse-recycle",
    question: "Has the design considered this aspect?",
    target: "3R",
    category: "attainment"
  },
  {
    title: "May<br/>other living species",
    question: "be effected by the design in production?",
    target: "ecosystem",
    category: "attainment"
  },
  {
    title: "How",
    question: "to bring up the inclusiveness in the design?",
    target: "inclusive",
    category: "attainment"
  },
  {
    title: "How",
    question: "to repair the design after usage?",
    target: "take care",
    category: "attainment"
  },
  {
    title: "Where",
    question: "are the limitations of the design project?",
    target: "limitation",
    category: "attainment"
  },
  {
    title: "What",
    question: "can do differently?",
    target: "reflection and improvement",
    category: "attainment"
  },
]

window.onload = () => {
  const backtemplate = document.querySelector('template.backside');
  const fronttemplate = document.querySelector('template.frontside');
  const frontcards = document.querySelector('div.cards.front');
  const backcards = document.querySelector('div.cards.back');

  document.querySelector('select').addEventListener('change', (e) => {
    console.log('change')
    if (e.target.value === "front")
    {
      backcards.style.display = "none";
      frontcards.style.display = "grid";
    }
    else 
    {
      frontcards.style.display = "none";
      backcards.style.display = "grid";
    }
  })

  buildOutline(backtemplate);
  fronttemplate.content.querySelector('path[id=outline]').setAttribute('d', backtemplate.content.querySelector('path[id=outline]').getAttribute("d"));

  let frow = null, brow = null;
  for (let i=0; i<cards.length; i++)
  {
    if (i % 5 === 0)
    {
      if (frow && brow)
      {
        backcards.appendChild(brow);
        frontcards.appendChild(frow);
      }

      frow = document.createElement('div');
      frow.className = "row";

      brow = document.createElement('div');
      brow.className = "row";
    }
    const card = cards[i];
    const backclone = backtemplate.content.cloneNode(true);
    const frontclone = fronttemplate.content.cloneNode(true);
    // backclone.querySelector('textPath#title').textContent = card.title;

    frontclone.querySelector('p.title').innerHTML = card.title;
    frontclone.querySelector('p.question').innerHTML = card.question;
    frontclone.querySelector('p.target').innerHTML = card.target;

    backclone.querySelector('p.category').innerHTML = card.category;

    brow.appendChild(backclone);
    frow.appendChild(frontclone);
  }

  backcards.appendChild(brow);
  frontcards.appendChild(frow);
}

// remember that text will "hang" so textdistance should atleast be r + text height
function buildOutline(template, r = 8, textdistance=7, scale=1) 
{
  const points = [
    {x:   0,  y: 27.5},
    {x:  24,  y: 87.5},
    {x:  76,  y: 87.5},
    {x: 100,  y: 27.5},
    {x:  50,  y: 12.5}, // top 
  ];
  const scaledpoints = points.map(p => ({x:p.x*scale, y:p.y*scale}));
  const cache = {};
  const outline = getCurvedPath(scaledpoints, r*scale, cache);

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
      x: points[i].x + Math.cos(angletocenter) * (textdistance),
      y: points[i].y + Math.sin(angletocenter) * (textdistance * 0.83),
    });
  }

  const text = getCurvedPath(innerpoints, r);

  template.content.querySelector('svg.outline path[id=outline]').setAttribute('d', outline);
  template.content.querySelector('svg.text path[id=text]').setAttribute('d', text);
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