# Code2Docx

A web tool to build code question documents and export them as PDF or DOCX. Designed for students and educators to quickly assemble lab/assignment submissions with formatted code blocks and rendered output previews.

## How It Works

1. **Document Info** — Fill in title, subject, name, roll number, and date.
2. **Add Blocks** — Add question blocks (with code files) or free-text blocks.
3. **Attach Code Files** — Each question can have multiple files (HTML, CSS, JS, etc.). Files are combined to render a live output preview.
4. **Export** — Hit **Export PDF** or **Export DOCX** to download a formatted document with code listings and output screenshots.

## Libraries Used

| Library | Purpose |
|---------|---------|
| [Next.js](https://nextjs.org/) | React framework (app router, build tooling) |
| [React](https://react.dev/) | UI component library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [docx](https://github.com/dolanmedia/docx) | Generates `.docx` Word documents in the browser |
| [jsPDF](https://github.com/parallax/jsPDF) | Client-side PDF generation |
| [html2canvas](https://html2canvas.hertzen.dev/) | Renders HTML/CSS output to canvas for screenshots |
| [file-saver](https://github.com/eligrey/FileSaver.js) | Triggers browser file downloads |
| [Sonner](https://sonner.emilkowal.dev/) | Toast notifications |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to use the app.
