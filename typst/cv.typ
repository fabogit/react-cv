// Typst CV Template matching React-CV styling and A4 2-page calibration
#import "flags.typ": render-flag

#let cv = json(bytes(sys.inputs.at("data", default: "{}")))
#let showPhoto = sys.inputs.at("showPhoto", default: "true") == "true"

#set page(
  paper: "a4",
  margin: (x: 7mm, y: 6mm),
)

#set text(
  font: "Liberation Sans",
  size: 8pt,
  fill: rgb("#2d3748"),
  lang: cv.at("lang", default: "it"),
)
#set par(
  leading: 0.42em,
  justify: true,
)

#let primary-color = rgb("#003366")
#let text-color = rgb("#2d3748")
#let muted-color = rgb("#4a5568")
#let border-color = rgb("#e2e8f0")

#let has-asset(dict, key) = {
  dict.at(key, default: none) != none and dict.at(key, default: "") != ""
}

#let card(body, breakable: false, inset: (x: 8.5pt, y: 7pt)) = block(
  stroke: 0.5pt + border-color,
  radius: 4.5pt,
  inset: inset,
  width: 100%,
  breakable: breakable,
  body
)

#let section-title(title) = {
  align(center)[
    #text(fill: primary-color, size: 9.5pt, weight: "bold")[#title]
  ]
  v(1.5pt)
}

#let render-contact-item(c) = box[
  #if has-asset(c, "icon") [
    #box(width: 7pt, height: 7pt, baseline: 10%, image(c.icon, width: 100%, height: 100%, fit: "contain"))
    #h(1.5pt)
  ]
  #if has-asset(c, "link") [
    #link(c.link)[#text(fill: primary-color)[#c.value]]
  ] else [
    #text(fill: muted-color)[#c.value]
  ]
]

#let render-contact-row(items) = {
  for (i, c) in items.enumerate() [
    #if i > 0 [ #h(3.5pt) #text(fill: rgb("#cbd5e0"))[•] #h(3.5pt) ]
    #render-contact-item(c)
  ]
}

// Header Card (Variant H1: 2-Column Split)
#let has-photo = showPhoto and has-asset(cv.header, "image")
#let header-left = if has-photo {
  grid(
    columns: (40pt, 1fr),
    gutter: 8pt,
    align: (center + horizon, left + horizon),
    block(
      width: 40pt,
      height: 40pt,
      radius: 20pt,
      clip: true,
      stroke: 0.5pt + border-color,
      image(cv.header.image, width: 100%, height: 100%, fit: "cover"),
    ),
    [
      #text(fill: primary-color, size: 14pt, weight: "bold")[#cv.header.name] \
      #v(1.5pt)
      #text(fill: muted-color, size: 8.8pt, weight: "medium")[#cv.header.title]
    ],
  )
} else {
  [
    #text(fill: primary-color, size: 14pt, weight: "bold")[#cv.header.name] \
    #v(1.5pt)
    #text(fill: muted-color, size: 8.8pt, weight: "medium")[#cv.header.title]
  ]
}

#let contacts-list = cv.header.at("contacts", default: ())
#let total-contacts = contacts-list.len()
#let split-idx = calc.ceil(total-contacts / 2)
#let contacts-row1 = contacts-list.slice(0, split-idx)
#let contacts-row2 = if split-idx < total-contacts { contacts-list.slice(split-idx) } else { () }

#let header-right = if total-contacts > 0 {
  align(right + horizon)[
    #text(size: 7.1pt)[
      #render-contact-row(contacts-row1)
      #if contacts-row2.len() > 0 [
        \ #v(2.5pt)
        #render-contact-row(contacts-row2)
      ]
    ]
  ]
} else {
  none
}

#card[
  #grid(
    columns: (1fr, auto),
    gutter: 10pt,
    align: (left + horizon, right + horizon),
    header-left,
    header-right,
  )
  #v(2.5pt)
  #line(length: 100%, stroke: 0.4pt + border-color)
  #v(2pt)
  #for (i, p) in cv.header.summary.enumerate() [
    #if i > 0 [ #v(1.5pt) ]
    #text(size: 7.3pt, fill: text-color)[#p]
  ]
]

#v(4.5pt)

// Work Experience Card
#card(breakable: true)[
  #section-title(cv.work.title)
  #for (idx, item) in cv.work.list.enumerate() [
    #if idx > 0 [
      #v(3pt)
      #line(length: 100%, stroke: 0.3pt + border-color)
      #v(3pt)
    ]
    #block(breakable: false)[
      #grid(
        columns: (
          if has-asset(item, "logo") {
            14pt
          } else {
            0pt
          },
          1fr,
          auto,
        ),
        gutter: 5pt,
        align: (horizon, top + left, top + right),
        if has-asset(item, "logo") {
          box(width: 14pt, height: 14pt, radius: 2pt, clip: true, image(item.logo, width: 100%, height: 100%, fit: "contain"))
        } else {
          none
        },
        [
          #text(weight: "bold", size: 8.2pt, fill: text-color)[#item.company]
          #if has-asset(item, "location") [
            #text(size: 7.2pt, fill: muted-color)[ • #item.location]
          ] \
          #text(style: "italic", size: 7.5pt, fill: primary-color)[#item.role]
        ],
        [
          #text(size: 7.2pt, fill: muted-color)[#item.date]
        ],
      )
      #v(1.5pt)
      #list(
        marker: ([•]),
        spacing: 2pt,
        ..item.tasks.map(t => text(size: 7.2pt, fill: text-color)[#t])
      )
    ]
  ]
]

#v(4.5pt)

// Education Card
#card[
  #section-title(cv.education.title)
  #for (idx, item) in cv.education.list.enumerate() [
    #if idx > 0 [
      #v(2.5pt)
      #line(length: 100%, stroke: 0.3pt + border-color)
      #v(2.5pt)
    ]
    #block(breakable: false)[
      #grid(
        columns: (
          if has-asset(item, "logo") {
            14pt
          } else {
            0pt
          },
          1fr,
          auto,
        ),
        gutter: 5pt,
        align: (horizon, top + left, top + right),
        if has-asset(item, "logo") {
          box(width: 14pt, height: 14pt, radius: 2pt, clip: true, image(item.logo, width: 100%, height: 100%, fit: "contain"))
        } else {
          none
        },
        [
          #text(weight: "bold", size: 8.2pt, fill: text-color)[#item.institute]
          #if has-asset(item, "location") [
            #text(size: 7.2pt, fill: muted-color)[ • #item.location]
          ] \
          #text(size: 7.4pt, fill: text-color)[#item.description]
        ],
        [
          #text(size: 7.2pt, fill: muted-color)[#item.date]
        ],
      )
    ]
  ]
]

#v(4.5pt)

// Languages Card & Skills Cards (Adaptive Layout L2)
#let render-languages-card(is-compact: false) = card(
  inset: if is-compact { (x: 6.5pt, y: 5.5pt) } else { (x: 8.5pt, y: 7pt) }
)[
  #section-title(cv.languages.title)
  #let cols = range(calc.max(1, cv.languages.list.len())).map(_ => 1fr)
  #grid(
    columns: cols,
    gutter: if is-compact { 4pt } else { 8pt },
    align: center,
    ..cv.languages.list.map(l => [
      #align(center)[
        #render-flag(l.iso) #h(if is-compact { 2pt } else { 2.5pt }) #text(weight: "bold", size: if is-compact { 7.4pt } else { 7.8pt })[#l.name] \
        #text(size: if is-compact { 6.5pt } else { 6.8pt }, fill: muted-color)[#l.level]
      ]
    ])
  )
]

#let soft-skills-card = card[
  #section-title(cv.skills.softTitle)
  #list(
    marker: ([•]),
    spacing: 2.5pt,
    ..cv.skills.soft.map(s => text(size: 7.3pt, fill: text-color)[#s])
  )
]

#let hard-skills-card = card[
  #section-title(cv.skills.hardTitle)
  #list(
    marker: ([•]),
    spacing: 2.5pt,
    ..cv.skills.hard.map(s => text(size: 7.3pt, fill: text-color)[#s])
  )
]

#let is-skills-asymmetric = {
  let soft-items = cv.skills.at("soft", default: ())
  let hard-items = cv.skills.at("hard", default: ())
  let soft-count = soft-items.len()
  let hard-count = hard-items.len()
  let soft-chars = soft-items.fold(0, (acc, it) => acc + str(it).len())
  let hard-chars = hard-items.fold(0, (acc, it) => acc + str(it).len())
  (hard-count >= soft-count + 3) or (hard-chars > soft-chars * 1.4 and hard-count > soft-count)
}

#if is-skills-asymmetric [
  #block(breakable: false)[
    #grid(
      columns: (1fr, 1.28fr),
      gutter: 6pt,
      align: (top, top),
      stack(
        spacing: 4.5pt,
        render-languages-card(is-compact: true),
        soft-skills-card,
      ),
      hard-skills-card,
    )
  ]
] else [
  #render-languages-card(is-compact: false)
  #v(4.5pt)
  #block(breakable: false)[
    #grid(
      columns: (1fr, 1fr),
      gutter: 6pt,
      soft-skills-card,
      hard-skills-card,
    )
  ]
]

#v(4.5pt)

// Legal Notes Card
#card[
  #line(length: 100%, stroke: 0.3pt + border-color)
  #v(1.5pt)
  #align(center)[
    #text(size: 6.2pt, fill: muted-color)[#cv.legal.text]
  ]
  #v(1.5pt)
  #line(length: 100%, stroke: 0.3pt + border-color)
  #v(2pt)
  #grid(
    columns: (1fr, auto),
    align: (left + horizon, right + horizon),
    text(size: 7.4pt, fill: muted-color)[#cv.legal.date],
    if has-asset(cv.legal, "signature") {
      let sig-alt = cv.legal.at("signatureAlt", default: none)
      if sig-alt != none and sig-alt != "" {
        box(height: 16pt, image(cv.legal.signature, height: 100%, fit: "contain", alt: sig-alt))
      } else {
        box(height: 16pt, image(cv.legal.signature, height: 100%, fit: "contain"))
      }
    } else {
      none
    },
  )
]
