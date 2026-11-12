// Flag SVG dictionary and rendering helper for Typst CV
// Option B1-A Rectangular 4:3 SVG with ISO Badge Fallback

#let flag-svgs = (
  "IT": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"10\" height=\"20\" fill=\"#009246\"/><rect x=\"10\" width=\"10\" height=\"20\" fill=\"#ffffff\"/><rect x=\"20\" width=\"10\" height=\"20\" fill=\"#ce2b37\"/></svg>",
  "FR": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"10\" height=\"20\" fill=\"#002654\"/><rect x=\"10\" width=\"10\" height=\"20\" fill=\"#ffffff\"/><rect x=\"20\" width=\"10\" height=\"20\" fill=\"#ed2939\"/></svg>",
  "DE": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"6.67\" fill=\"#000000\"/><rect y=\"6.67\" width=\"30\" height=\"6.67\" fill=\"#dd0000\"/><rect y=\"13.34\" width=\"30\" height=\"6.67\" fill=\"#ffce00\"/></svg>",
  "NL": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"6.67\" fill=\"#ae1c28\"/><rect y=\"6.67\" width=\"30\" height=\"6.67\" fill=\"#ffffff\"/><rect y=\"13.34\" width=\"30\" height=\"6.67\" fill=\"#21468b\"/></svg>",
  "ES": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"5\" fill=\"#aa151b\"/><rect y=\"5\" width=\"30\" height=\"10\" fill=\"#f1bf00\"/><rect y=\"15\" width=\"30\" height=\"5\" fill=\"#aa151b\"/></svg>",
  "GB": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 60 40\"><clipPath id=\"s\"><path d=\"M0,0 v40 h60 v-40 z\"/></clipPath><clipPath id=\"t\"><path d=\"M30,20 L60,40 H50 L25,23.33 z M30,20 L0,40 H10 L35,23.33 z M30,20 L0,0 H10 L35,16.67 z M30,20 L60,0 H50 L25,16.67 z\"/></clipPath><g clip-path=\"url(#s)\"><path d=\"M0,0 v40 h60 v-40 z\" fill=\"#012169\"/><path d=\"M0,0 L60,40 M60,0 L0,40\" stroke=\"#fff\" stroke-width=\"8\"/><path d=\"M0,0 L60,40 M60,0 L0,40\" clip-path=\"url(#t)\" stroke=\"#c8102e\" stroke-width=\"4\"/><path d=\"M30,0 v40 M0,20 h60\" stroke=\"#fff\" stroke-width=\"12\"/><path d=\"M30,0 v40 M0,20 h60\" stroke=\"#c8102e\" stroke-width=\"6\"/></g></svg>",
  "US": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 60 40\"><rect width=\"60\" height=\"40\" fill=\"#b22234\"/><path d=\"M0,3.08h60M0,9.23h60M0,15.38h60M0,21.54h60M0,27.69h60M0,33.85h60\" stroke=\"#fff\" stroke-width=\"3.08\"/><rect width=\"24\" height=\"21.54\" fill=\"#3c3b6e\"/><circle cx=\"6\" cy=\"5\" r=\"1.5\" fill=\"#fff\"/><circle cx=\"12\" cy=\"5\" r=\"1.5\" fill=\"#fff\"/><circle cx=\"18\" cy=\"5\" r=\"1.5\" fill=\"#fff\"/><circle cx=\"9\" cy=\"11\" r=\"1.5\" fill=\"#fff\"/><circle cx=\"15\" cy=\"11\" r=\"1.5\" fill=\"#fff\"/><circle cx=\"6\" cy=\"17\" r=\"1.5\" fill=\"#fff\"/><circle cx=\"12\" cy=\"17\" r=\"1.5\" fill=\"#fff\"/><circle cx=\"18\" cy=\"17\" r=\"1.5\" fill=\"#fff\"/></svg>",
  "PT": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"12\" height=\"20\" fill=\"#006600\"/><rect x=\"12\" width=\"18\" height=\"20\" fill=\"#ff0000\"/><circle cx=\"12\" cy=\"10\" r=\"4\" fill=\"#ffcc00\"/><circle cx=\"12\" cy=\"10\" r=\"2.8\" fill=\"#ffffff\"/><rect x=\"10.8\" y=\"8.8\" width=\"2.4\" height=\"2.4\" fill=\"#003399\"/></svg>",
  "JP": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"20\" fill=\"#ffffff\"/><circle cx=\"15\" cy=\"10\" r=\"6\" fill=\"#bc002d\"/></svg>",
  "CN": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"20\" fill=\"#de2910\"/><polygon points=\"5,2 6.2,5.8 3,3.4 7,3.4 3.8,5.8\" fill=\"#ffde00\"/><circle cx=\"10\" cy=\"2\" r=\"0.8\" fill=\"#ffde00\"/><circle cx=\"12\" cy=\"4\" r=\"0.8\" fill=\"#ffde00\"/><circle cx=\"12\" cy=\"7\" r=\"0.8\" fill=\"#ffde00\"/><circle cx=\"10\" cy=\"9\" r=\"0.8\" fill=\"#ffde00\"/></svg>",
  "RU": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"6.67\" fill=\"#ffffff\"/><rect y=\"6.67\" width=\"30\" height=\"6.67\" fill=\"#0039a6\"/><rect y=\"13.34\" width=\"30\" height=\"6.67\" fill=\"#d52b1e\"/></svg>",
  "PL": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"10\" fill=\"#ffffff\"/><rect y=\"10\" width=\"30\" height=\"10\" fill=\"#dc143c\"/></svg>",
  "SE": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"20\" fill=\"#006aa7\"/><rect x=\"9\" width=\"4\" height=\"20\" fill=\"#fecc00\"/><rect y=\"8\" width=\"30\" height=\"4\" fill=\"#fecc00\"/></svg>",
  "NO": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"20\" fill=\"#ba0c2f\"/><rect x=\"8\" width=\"6\" height=\"20\" fill=\"#ffffff\"/><rect y=\"7\" width=\"30\" height=\"6\" fill=\"#ffffff\"/><rect x=\"10\" width=\"2\" height=\"20\" fill=\"#00205b\"/><rect y=\"9\" width=\"30\" height=\"2\" fill=\"#00205b\"/></svg>",
  "DK": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"20\" fill=\"#c60c30\"/><rect x=\"9\" width=\"3.5\" height=\"20\" fill=\"#ffffff\"/><rect y=\"8.25\" width=\"30\" height=\"3.5\" fill=\"#ffffff\"/></svg>",
  "FI": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"20\" fill=\"#ffffff\"/><rect x=\"8\" width=\"4.5\" height=\"20\" fill=\"#003580\"/><rect y=\"7.75\" width=\"30\" height=\"4.5\" fill=\"#003580\"/></svg>",
  "CH": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"20\" fill=\"#da291c\"/><rect x=\"13\" y=\"4\" width=\"4\" height=\"12\" fill=\"#ffffff\"/><rect x=\"9\" y=\"8\" width=\"12\" height=\"4\" fill=\"#ffffff\"/></svg>",
  "AT": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"6.67\" fill=\"#ed2939\"/><rect y=\"6.67\" width=\"30\" height=\"6.67\" fill=\"#ffffff\"/><rect y=\"13.34\" width=\"30\" height=\"6.67\" fill=\"#ed2939\"/></svg>",
  "BE": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"10\" height=\"20\" fill=\"#000000\"/><rect x=\"10\" width=\"10\" height=\"20\" fill=\"#fddf00\"/><rect x=\"20\" width=\"10\" height=\"20\" fill=\"#ef3340\"/></svg>",
  "GR": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"30\" height=\"20\" fill=\"#0d5eaf\"/><path d=\"M0,2.22h30M0,6.67h30M0,11.11h30M0,15.56h30\" stroke=\"#fff\" stroke-width=\"2.22\"/><rect width=\"10\" height=\"10\" fill=\"#0d5eaf\"/><rect x=\"3.8\" width=\"2.4\" height=\"10\" fill=\"#ffffff\"/><rect y=\"3.8\" width=\"10\" height=\"2.4\" fill=\"#ffffff\"/></svg>",
  "IE": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 30 20\"><rect width=\"10\" height=\"20\" fill=\"#169b62\"/><rect x=\"10\" width=\"10\" height=\"20\" fill=\"#ffffff\"/><rect x=\"20\" width=\"10\" height=\"20\" fill=\"#ff883e\"/></svg>",
)

#let render-flag(iso) = {
  if iso in flag-svgs {
    box(
      stroke: 0.4pt + rgb("#cbd5e0"),
      radius: 1.5pt,
      clip: true,
      width: 13pt,
      height: 9.5pt,
      baseline: 15%,
      image(bytes(flag-svgs.at(iso)), format: "svg", width: 100%, height: 100%, fit: "cover")
    )
  } else if iso != "" and iso != none {
    box(
      stroke: 0.4pt + rgb("#cbd5e0"),
      radius: 1.5pt,
      inset: (x: 2.5pt, y: 1pt),
      baseline: 15%,
      text(size: 6pt, weight: "bold", fill: rgb("#4a5568"), iso)
    )
  }
}
