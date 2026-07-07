# 🚀 MarkDown Reader

A premium, distraction-free markdown viewing and optimization environment designed for developers, writers, and readers alike. It features customized typography, interactive navigation, multiple theme configurations, layout controls, and comprehensive GitHub-Flavored Markdown (GFM) formatting support.

Developed with ❤️ by **Lucky Pawar**.

---

## 🎨 Key Features

- **Multiple Themes**: Toggle seamlessly between **Light**, **Dark**, **Sepia** (warm paper), and **Nord** (ocean slate) themes.
- **Typography Controls**: Choose between *Sans-Serif*, *Serif*, and *Monospace* fonts, adjust font sizes, and line-spacing for the perfect reading comfort.
- **Interactive Outline (Table of Contents)**: An automatically generated sidebar list based on your document's headers, complete with active scroll-spy highlighting for effortless navigation.
- **Responsive Width**: Toggle between a centered reading pane (optimized for reading) and full-width layout.
- **Syntax Highlighting**: Code blocks rendered with language-specific highlighting and a quick "Copy Code" button.
- **Callout & Alert Blocks**: Full parsing of standard GitHub-style Markdown alerts (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`).
- **Lists & Checklists**: Perfectly aligned bullet points, numbered lists, and interactive task checklists (`- [x]`, `- [ ]`).
- **Styled Tables**: Responsive, styled tables with zebra-striping and clean hover effects.
- **Local Storage Integration**: Remembers your preferred theme, font preferences, and options for persistent comfort across sessions.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Markdown Parsing**: [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lucky-KRMU/MarkDown-Reader.git
   cd MarkDown-Reader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Scripts

- **Development Server**: Run the app locally with hot-module replacement:
  ```bash
  npm run dev
  ```

- **Production Build**: Compile the app for production:
  ```bash
  npm run build
  ```

- **Linting**: Run the linter to verify code quality:
  ```bash
  npm run lint
  ```

- **Deploy**: Deploy the application to GitHub Pages:
  ```bash
  npm run deploy
  ```

---

## 👤 Developer / Author

- **Lucky Pawar** - *Initial Work & Architecture*
