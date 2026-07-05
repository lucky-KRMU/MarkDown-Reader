export const sampleMarkdown = `# 🚀 Welcome to the Enhanced Markdown Reader!

This application is a premium, distraction-free markdown viewing environment designed for developers and readers alike. It features customized typography, interactive navigation, theme switcher, layout controls, and comprehensive formatting support.

---

## 🎨 Layout & Styling Features

Here are some key interactive features you can control using the top actions bar:
1. **Multiple Themes**: Toggle between **Light**, **Dark**, **Sepia** (warm paper), and **Nord** (ocean slate) themes.
2. **Typography Controls**: Choose between Sans-Serif, Serif, and Monospace fonts, adjust font sizes, and change line spacing.
3. **Responsive Width**: Toggle between a centered reading pane (optimized for reading comfort) and full-width layout.
4. **Table of Contents (TOC)**: A sidebar outline is automatically generated from document headers for smooth-scrolling navigation with active Scroll Spy highlighting.

---

## 📢 Callout & Alert Blocks

The reader parses standard GitHub-style Markdown alerts to render highlighted notice boxes:

> [!NOTE]
> This is a helpful **Note** callout. Use it to provide useful background context, details, or side notes.

> [!TIP]
> This is a **Tip** callout. Perfect for highlighting best practices, keyboard shortcuts, or optimization tips.

> [!IMPORTANT]
> This is an **Important** callout. Highlighting essential requirements or steps that the reader must not miss.

> [!WARNING]
> This is a **Warning** callout. Warns readers about potential gotchas, breaking changes, or issues.

> [!CAUTION]
> This is a **Caution** callout. Alerting users of high-risk actions that could cause data loss or security issues.

---

## 🛠️ Code Blocks & Syntax Highlight

Here is an example code block with syntax highlighting and a quick **Copy Code** button at the top right of the code panel:

\`\`\`javascript
// Example JavaScript code showing how reading time is calculated
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return \`\${readTime} min read\`;
}

console.log(calculateReadingTime("Hello reader, hope you enjoy this markdown app!"));
\`\`\`

Here is a short HTML/CSS code snippet:

\`\`\`html
<div class="card shadow-lg rounded-2xl p-6 bg-zinc-800 text-white">
  <h3 class="text-xl font-bold">Premium UI Card</h3>
  <p class="text-zinc-400 mt-2">Smooth shadows and rounded borders.</p>
</div>
\`\`\`

---

## 📋 Lists & Nested Items

Here are some nested lists to showcase bullet alignments:

### Unordered List Items
- Primary bullet item
  - First nested bullet item
  - Second nested bullet item
    - Deeply nested detail bullet
- Another primary item

### Ordered List Items
1. First step in the guide
2. Second step in the guide
   1. Sub-step detail
   2. Another sub-step detail
3. Final step

### GFM Checklists
- [x] Integrate \`react-markdown\` and GFM tables plugin
- [x] Style headings and custom list bullets
- [/] Design beautiful CSS themes
- [ ] Add dark mode toggles and font selectors

---

## 📊 Beautiful Tables

Tables are rendered with clean borders, zebra-striping, and hover effects:

| Theme Name | Background Color | Text Color | Best Used For |
| :--- | :---: | :---: | :--- |
| **Light** | White (\`#FFFFFF\`) | Slate-900 | High contrast, bright daylight |
| **Dark** | Slate-900 | Slate-50 | Distraction-free, dark environments |
| **Sepia** | Warm Cream | Dark Brown | Extended reading sessions, low eye strain |
| **Nord** | Deep Slate Blue | Pastel Grey | Modern aesthetic, soft colors |

---

## 🖋️ Typography & Inline Styles

This paragraph demonstrates various inline styles such as **bold text**, *italic text*, ~~strikethrough~~, \`inline code\`, and [hyperlinks](https://github.com). You can also combine them, like ***bold italic text***.

We hope you enjoy using the Markdown Reader. Drag and drop any of your local \`.md\` files here to start reading!
`;
