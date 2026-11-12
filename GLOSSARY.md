# CV Rendering & Export Context

The domain context for rendering personal resume data and exporting print-ready documents within `react-cv`.

## Language

**Curriculum Vitae (CV)**:
The complete, structured professional profile data and its visual presentation.
_Avoid_: Resume, portfolio, bio

**Print Flow**:
The native browser workflow that leverages CSS print media queries to preview and serialize the rendered CV into an A4 PDF.
_Avoid_: PDF export, download flow, canvas rasterization

**Entry**:
A single historical event in education or professional work experience.
_Avoid_: Item, post, block, row

**Spacer**:
A manual DOM element with fixed vertical dimensions used to force pagination boundaries across print pages.
_Avoid_: Gap, margin filler, blank div
