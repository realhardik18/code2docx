"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

let idCounter = 0;
const uid = () => `b-${++idCounter}`;
const fid = () => `f-${++idCounter}`;

export default function Home() {
  const [meta, setMeta] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    name: "",
    subject: "",
    rollNo: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [exporting, setExporting] = useState(false);

  const updateMeta = (key, val) =>
    setMeta((p) => ({ ...p, [key]: val }));

  const loadDemo = () => {
    setMeta({
      title: "Web Development Lab",
      date: new Date().toISOString().split("T")[0],
      name: "John Doe",
      subject: "Web Technologies",
      rollNo: "2024001",
    });
    setBlocks([
      {
        id: uid(),
        type: "question",
        question: "Create a webpage with a heading and a styled paragraph using HTML and CSS.",
        files: [
          {
            id: fid(),
            name: "index.html",
            content: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello World</h1>
  <p class="intro">This is a simple styled paragraph using external CSS.</p>
</body>
</html>`,
          },
          {
            id: fid(),
            name: "style.css",
            content: `body {
  font-family: Arial, sans-serif;
  margin: 40px;
  background: #f9f9f9;
}

h1 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

.intro {
  color: #555;
  font-size: 16px;
  line-height: 1.6;
}`,
          },
        ],
        collapsed: false,
        includeOutput: true,
      },
      {
        id: uid(),
        type: "question",
        question: "Design a simple card component with a shadow and rounded corners.",
        files: [
          {
            id: fid(),
            name: "index.html",
            content: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <h2>Card Title</h2>
    <p>This is a simple card component with shadow and rounded corners.</p>
    <button class="btn">Read More</button>
  </div>
</body>
</html>`,
          },
          {
            id: fid(),
            name: "style.css",
            content: `body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  padding: 40px;
  background: #eef2f7;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card h2 {
  margin: 0 0 12px;
  color: #333;
}

.card p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.btn {
  margin-top: 16px;
  padding: 8px 20px;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}`,
          },
        ],
        collapsed: false,
        includeOutput: true,
      },
      {
        id: uid(),
        type: "question",
        question: "Create a navigation bar with a horizontal list of links.",
        files: [
          {
            id: fid(),
            name: "index.html",
            content: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="navbar">
    <div class="logo">MySite</div>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
</body>
</html>`,
          },
          {
            id: fid(),
            name: "style.css",
            content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2c3e50;
  padding: 14px 24px;
}

.logo {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: #ecf0f1;
  text-decoration: none;
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.nav-links a:hover {
  color: #3498db;
}`,
          },
        ],
        collapsed: false,
        includeOutput: true,
      },
    ]);
  };

  const addQuestion = () =>
    setBlocks((p) => [
      ...p,
      {
        id: uid(),
        type: "question",
        question: "",
        files: [{ id: fid(), name: "index.html", content: "" }],
        collapsed: false,
        includeOutput: true,
      },
    ]);

  const addText = () =>
    setBlocks((p) => [
      ...p,
      { id: uid(), type: "text", content: "", collapsed: false },
    ]);

  const updateBlock = (id, patch) =>
    setBlocks((p) =>
      p.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );

  const removeBlock = (id) =>
    setBlocks((p) => p.filter((b) => b.id !== id));

  const moveBlock = (id, dir) =>
    setBlocks((p) => {
      const i = p.findIndex((b) => b.id === id);
      const j = i + dir;
      if (j < 0 || j >= p.length) return p;
      const next = [...p];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const toggleCollapse = (id) =>
    setBlocks((p) =>
      p.map((b) =>
        b.id === id ? { ...b, collapsed: !b.collapsed } : b
      )
    );

  // File operations within a question block
  const addFile = (blockId) =>
    setBlocks((p) =>
      p.map((b) => {
        if (b.id !== blockId || b.type !== "question") return b;
        return { ...b, files: [...b.files, { id: fid(), name: "style.css", content: "" }] };
      })
    );

  const updateFile = (blockId, fileId, patch) =>
    setBlocks((p) =>
      p.map((b) => {
        if (b.id !== blockId || b.type !== "question") return b;
        return {
          ...b,
          files: b.files.map((f) => (f.id === fileId ? { ...f, ...patch } : f)),
        };
      })
    );

  const removeFile = (blockId, fileId) =>
    setBlocks((p) =>
      p.map((b) => {
        if (b.id !== blockId || b.type !== "question") return b;
        if (b.files.length <= 1) return b; // keep at least one file
        return { ...b, files: b.files.filter((f) => f.id !== fileId) };
      })
    );

  const getQuestionNumber = (id) => {
    let n = 0;
    for (const b of blocks) {
      if (b.type === "question") n++;
      if (b.id === id) return n;
    }
    return n;
  };

  const escapeHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Combine all files into renderable HTML (inline CSS into HTML via <style>)
  const combineFilesForRender = (files) => {
    const htmlFile = files.find((f) => f.name.endsWith(".html"));
    const cssFiles = files.filter((f) => f.name.endsWith(".css"));
    const jsFiles = files.filter((f) => f.name.endsWith(".js"));
    const otherFiles = files.filter(
      (f) => !f.name.endsWith(".html") && !f.name.endsWith(".css") && !f.name.endsWith(".js")
    );

    let html = htmlFile?.content || "";
    const cssBlock = cssFiles.map((f) => f.content).join("\n");
    const jsBlock = jsFiles.map((f) => f.content).join("\n");
    const otherBlock = otherFiles.filter((f) => f !== htmlFile).map((f) => f.content).join("\n");

    if (cssBlock) html = `<style>${cssBlock}</style>\n${html}`;
    if (jsBlock) html = `${html}\n<script>${jsBlock}<\/script>`;
    if (otherBlock) html = `${html}\n${otherBlock}`;
    return html;
  };

  const buildExportHtml = useCallback(() => {
    let questionNum = 0;
    const blocksHtml = blocks
      .map((b) => {
        if (b.type === "question") {
          questionNum++;

          const filesHtml = b.files
            .map(
              (f) => `
              <div style="margin-bottom:12px;">
                <div style="display:inline-block;background:#e2e2e2;color:#444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:3px 3px 0 0;font-family:'Courier New',monospace;letter-spacing:0.3px;">${escapeHtml(f.name)}</div>
                <pre style="margin:0;border:1px solid #d0d0d0;border-top:none;border-radius:0 3px 3px 3px;padding:10px 12px;background:#f7f7f7;font-family:'Courier New',monospace;font-size:10px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word;color:#1a1a1a;">${escapeHtml(f.content) || " "}</pre>
              </div>`
            )
            .join("");

          const combined = combineFilesForRender(b.files);
          const outputHtml =
            b.includeOutput && combined.trim()
              ? `<div style="margin-top:12px;">
                   <div style="font-weight:700;margin-bottom:6px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Output</div>
                   <div style="border:1px solid #d0d0d0;border-radius:3px;padding:12px;background:#fff;">
                     ${combined}
                   </div>
                 </div>`
              : "";

          return `
            <div style="margin-bottom:24px;">
              <div style="margin-bottom:10px;padding-bottom:6px;border-bottom:1.5px solid #222;">
                <span style="font-weight:700;font-size:13px;color:#000;">Q${questionNum}. </span>
                <span style="font-size:12px;color:#222;">${escapeHtml(b.question) || "(No question text)"}</span>
              </div>
              <div style="font-weight:700;margin-bottom:6px;font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Code</div>
              ${filesHtml}
              ${outputHtml}
            </div>`;
        }
        return `<div style="margin-bottom:16px;white-space:pre-wrap;font-size:11px;line-height:1.6;color:#333;">${escapeHtml(b.content)}</div>`;
      })
      .join("");

    const metaItems = [meta.subject, meta.name, meta.rollNo, meta.date].filter(Boolean);
    const metaLine = metaItems.map(escapeHtml).join("  |  ");

    return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #fff; color: #111; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.4; }
  pre { font-family: 'Courier New', Courier, monospace; }
</style>
</head><body>
<div style="padding:28px 32px;max-width:700px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:20px;">
    <div style="font-size:18px;font-weight:700;color:#000;margin-bottom:4px;">${escapeHtml(meta.title) || "Untitled Document"}</div>
    ${metaLine ? `<div style="font-size:10px;color:#666;">${metaLine}</div>` : ""}
  </div>
  <hr style="border:none;border-top:1px solid #ccc;margin-bottom:20px;" />
  ${blocksHtml}
</div>
</body></html>`;
  }, [blocks, meta]);

  const exportPDF = async () => {
    setExporting(true);
    toast("Your file is being prepared...");
    try {
      // Render in an isolated iframe so dark theme doesn't bleed in
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;top:0;width:794px;height:200px;border:none;background:#fff;";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(buildExportHtml());
      iframeDoc.close();

      // Wait for iframe to fully render
      await new Promise((r) => {
        if (iframe.contentWindow) {
          iframe.contentWindow.onload = () => r(undefined);
          // Fallback timeout in case onload doesn't fire
          setTimeout(() => r(undefined), 800);
        } else {
          setTimeout(() => r(undefined), 800);
        }
      });

      // Resize iframe to full content height
      const contentHeight = iframeDoc.body.scrollHeight;
      iframe.style.height = contentHeight + "px";
      await new Promise((r) => setTimeout(r, 300));

      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        backgroundColor: "#ffffff",
        width: 794,
        windowWidth: 794,
        height: contentHeight,
      });

      document.body.removeChild(iframe);

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;
      const scaledH = (canvas.height * contentW) / canvas.width;
      const totalPages = Math.ceil(scaledH / contentH);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const srcY = page * contentH * (canvas.height / scaledH);
        const srcH = Math.min(contentH, scaledH - page * contentH) * (canvas.height / scaledH);

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = Math.ceil(srcH);
        const ctx = sliceCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0, Math.floor(srcY), canvas.width, Math.ceil(srcH),
          0, 0, sliceCanvas.width, Math.ceil(srcH)
        );

        const renderH = Math.min(contentH, scaledH - page * contentH);
        pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.95), "JPEG", margin, margin, contentW, renderH);
      }

      pdf.save(`${meta.title || "document"}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.error("PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const renderCodeToImage = async (html) => {
    const html2canvas = (await import("html2canvas")).default;

    // Use an iframe to isolate each render — prevents html2canvas DOM conflicts
    const iframe = document.createElement("iframe");
    iframe.style.cssText =
      "position:fixed;left:-9999px;top:0;width:700px;height:600px;border:none;background:#fff;";
    document.body.appendChild(iframe);

    try {
      const iDoc = iframe.contentDocument || iframe.contentWindow.document;
      iDoc.open();
      iDoc.write(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#fff;font-family:Arial,sans-serif;font-size:14px;padding:16px;}</style></head><body>${html}</body></html>`);
      iDoc.close();

      await new Promise((r) => setTimeout(r, 300));

      // Resize iframe to fit content
      const h = iDoc.body.scrollHeight;
      iframe.style.height = h + "px";
      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(iDoc.body, {
        scale: 2,
        backgroundColor: "#ffffff",
        width: 700,
        windowWidth: 700,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const raw = atob(dataUrl.split(",")[1]);
      const arr = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
      return arr;
    } finally {
      document.body.removeChild(iframe);
    }
  };

  const exportDOCX = async () => {
    setExporting(true);
    toast("Your file is being prepared...");
    try {
      const {
        Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
        ImageRun, BorderStyle,
      } = await import("docx");
      const { saveAs } = await import("file-saver");

      // Pre-render all output images first to avoid sequential DOM issues
      const outputImages = new Map();
      for (const b of blocks) {
        if (b.type === "question" && b.includeOutput) {
          const combined = combineFilesForRender(b.files);
          if (combined.trim()) {
            try {
              const imgData = await renderCodeToImage(combined);
              outputImages.set(b.id, imgData);
            } catch (err) {
              console.warn(`Output render failed for block ${b.id}:`, err);
            }
          }
        }
      }

      const children = [
        new Paragraph({
          text: meta.title || "Untitled Document",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: [meta.subject, meta.name, meta.rollNo, meta.date].filter(Boolean).join(" | "),
              size: 22,
              color: "666666",
            }),
          ],
        }),
        new Paragraph({ text: "" }),
      ];

      let questionNum = 0;
      for (const b of blocks) {
        if (b.type === "question") {
          questionNum++;
          children.push(
            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun({
                  text: `Q${questionNum}. ${b.question || "(No question text)"}`,
                  bold: true,
                  size: 24,
                }),
              ],
            })
          );

          // Each file
          for (const f of b.files) {
            children.push(
              new Paragraph({
                spacing: { before: 140 },
                children: [
                  new TextRun({ text: f.name, bold: true, size: 20, color: "555555", font: "Courier New" }),
                ],
              })
            );

            const codeLines = f.content.split("\n");
            for (let i = 0; i < codeLines.length; i++) {
              children.push(
                new Paragraph({
                  spacing: { after: 0, before: 0, line: 276 },
                  shading: { fill: "F5F5F5" },
                  border: {
                    top: i === 0 ? { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" } : undefined,
                    bottom: i === codeLines.length - 1 ? { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" } : undefined,
                    left: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
                  },
                  children: [
                    new TextRun({
                      text: codeLines[i] || " ",
                      font: "Courier New",
                      size: 20,
                    }),
                  ],
                })
              );
            }
          }

          // Output
          if (b.includeOutput) {
            children.push(
              new Paragraph({
                spacing: { before: 160 },
                children: [
                  new TextRun({ text: "Output:", bold: true, size: 22, color: "555555" }),
                ],
              })
            );

            const imgData = outputImages.get(b.id);
            if (imgData) {
              children.push(
                new Paragraph({
                  spacing: { before: 80 },
                  children: [
                    new ImageRun({
                      data: imgData,
                      transformation: { width: 550, height: 300 },
                      type: "png",
                    }),
                  ],
                })
              );
            } else {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: "(Could not render output)", italics: true, color: "999999" }),
                  ],
                })
              );
            }
          }

          children.push(new Paragraph({ text: "" }));
        } else {
          children.push(new Paragraph({ text: b.content }));
          children.push(new Paragraph({ text: "" }));
        }
      }

      const doc = new Document({ sections: [{ children }] });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${meta.title || "document"}.docx`);
      toast.success("DOCX exported successfully!");
    } catch (err) {
      console.error("DOCX export failed:", err);
      toast.error("DOCX export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const questionBlocks = blocks.filter((b) => b.type === "question");

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-zinc-200 pb-24">
      <div className="mx-auto max-w-3xl p-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Code2Docx</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Build question documents and export as PDF or DOCX
            </p>
          </div>
          {blocks.length === 0 && (
            <button
              onClick={loadDemo}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200 transition-colors"
            >
              Load Demo
            </button>
          )}
        </div>

        {/* ---- META FIELDS ---- */}
        <section className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Document Info
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["title", "Document Title"],
              ["subject", "Subject"],
              ["name", "Your Name"],
              ["rollNo", "Roll No"],
              ["date", "Date"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex flex-col gap-1.5 text-xs font-medium text-zinc-500"
              >
                {label}
                <input
                  type={key === "date" ? "date" : "text"}
                  value={meta[key]}
                  onChange={(e) => updateMeta(key, e.target.value)}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </label>
            ))}
          </div>
        </section>

        {/* ---- BLOCKS ---- */}
        <section className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Blocks{" "}
              {blocks.length > 0 && (
                <span className="text-zinc-600">({blocks.length})</span>
              )}
            </h2>
          </div>

          {blocks.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-12 text-center text-sm text-zinc-600">
              No blocks yet. Add a question or text block to get started.
            </div>
          )}

          {blocks.map((b) => {
            const isQuestion = b.type === "question";
            const qNum = isQuestion ? getQuestionNumber(b.id) : 0;
            const summary = isQuestion
              ? b.question || "(empty question)"
              : b.content.slice(0, 50) || "(empty text)";

            return (
              <div
                key={b.id}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden"
              >
                {/* block header */}
                <div className="flex items-center gap-2 px-3 py-2.5 select-none">
                  <div className="flex flex-col -space-y-1">
                    <button
                      onClick={() => moveBlock(b.id, -1)}
                      className="rounded px-1 py-0.5 text-[10px] text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveBlock(b.id, 1)}
                      className="rounded px-1 py-0.5 text-[10px] text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>

                  <button
                    onClick={() => toggleCollapse(b.id)}
                    className="flex flex-1 items-center gap-2 text-left min-w-0"
                  >
                    <span
                      className={`text-[10px] text-zinc-600 transition-transform duration-150 ${b.collapsed ? "" : "rotate-90"}`}
                    >
                      ▶
                    </span>
                    <span className="text-sm font-medium text-zinc-300 truncate">
                      {isQuestion ? (
                        <span className="text-indigo-400">Q{qNum}. </span>
                      ) : (
                        <span className="text-emerald-400">Text: </span>
                      )}
                      <span className="font-normal text-zinc-500">{summary}</span>
                    </span>
                  </button>

                  {isQuestion && (
                    <span className="text-[10px] text-zinc-600 tabular-nums">
                      {b.files.length} file
                      {b.files.length !== 1 ? "s" : ""}
                    </span>
                  )}

                  {isQuestion && (
                    <label
                      className="flex items-center gap-1.5 text-xs text-zinc-500 whitespace-nowrap cursor-pointer hover:text-zinc-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={b.includeOutput}
                        onChange={(e) =>
                          updateBlock(b.id, {
                            includeOutput: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      Output
                    </label>
                  )}

                  <button
                    onClick={() => removeBlock(b.id)}
                    className="rounded-lg px-2 py-1 text-xs text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Remove block"
                  >
                    ✕
                  </button>
                </div>

                {/* block body */}
                {!b.collapsed && (
                  <div className="px-4 pb-4 pt-2 border-t border-white/[0.04]">
                    {isQuestion ? (
                      <>
                        <input
                          placeholder="Question text..."
                          value={b.question}
                          onChange={(e) =>
                            updateBlock(b.id, { question: e.target.value })
                          }
                          className="mb-4 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                        />

                        {/* Files */}
                        <div className="space-y-3">
                          {b.files.map((f) => (
                            <div
                              key={f.id}
                              className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                            >
                              {/* file header */}
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03]">
                                <input
                                  value={f.name}
                                  onChange={(e) =>
                                    updateFile(b.id, f.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  className="flex-1 bg-transparent text-xs font-mono text-zinc-400 focus:text-zinc-200 focus:outline-none placeholder-zinc-700"
                                  placeholder="filename.ext"
                                />
                                {b.files.length > 1 && (
                                  <button
                                    onClick={() => removeFile(b.id, f.id)}
                                    className="text-[10px] text-zinc-700 hover:text-red-400 transition-colors px-1"
                                    title="Remove file"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                              <textarea
                                value={f.content}
                                onChange={(e) =>
                                  updateFile(b.id, f.id, {
                                    content: e.target.value,
                                  })
                                }
                                rows={8}
                                spellCheck={false}
                                className="w-full resize-y border-t border-white/[0.04] bg-[#111115] p-3 font-mono text-xs leading-relaxed text-zinc-300 placeholder-zinc-700 focus:outline-none"
                                placeholder={
                                  f.name.endsWith(".css")
                                    ? "body { margin: 0; }"
                                    : f.name.endsWith(".js")
                                      ? 'console.log("hello");'
                                      : "<div>Hello World</div>"
                                }
                              />
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => addFile(b.id)}
                          className="mt-2 rounded-lg border border-dashed border-white/[0.08] px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-400 hover:border-white/[0.15] transition-colors"
                        >
                          + Add file
                        </button>
                      </>
                    ) : (
                      <textarea
                        value={b.content}
                        onChange={(e) =>
                          updateBlock(b.id, { content: e.target.value })
                        }
                        rows={4}
                        className="w-full resize-y rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                        placeholder="Enter text content..."
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* add buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={addQuestion}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              + Question
            </button>
            <button
              onClick={addText}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200 transition-colors"
            >
              + Text Block
            </button>
          </div>
        </section>
      </div>

      {/* ---- STICKY EXPORT BAR ---- */}
      {blocks.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 border-t border-white/[0.06] bg-[#0c0c0f]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-3">
            <p className="text-xs text-zinc-600">
              {questionBlocks.length} question
              {questionBlocks.length !== 1 ? "s" : ""},{" "}
              {questionBlocks.filter((b) => b.includeOutput).length}{" "}
              with output
            </p>
            <div className="flex gap-2">
              <button
                onClick={exportPDF}
                disabled={exporting}
                className="rounded-xl bg-rose-600/90 px-5 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-40 transition-colors"
              >
                {exporting ? "Exporting..." : "Export PDF"}
              </button>
              <button
                onClick={exportDOCX}
                disabled={exporting}
                className="rounded-xl bg-violet-600/90 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-40 transition-colors"
              >
                {exporting ? "Exporting..." : "Export DOCX"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
