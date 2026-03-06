"use client";

import { useState, useRef, useCallback } from "react";

type Block =
  | { id: string; type: "question"; question: string; code: string }
  | { id: string; type: "text"; content: string };

interface DocMeta {
  title: string;
  date: string;
  name: string;
  subject: string;
  rollNo: string;
}

let idCounter = 0;
const uid = () => `block-${++idCounter}`;

export default function Home() {
  const [meta, setMeta] = useState<DocMeta>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    name: "",
    subject: "",
    rollNo: "",
  });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [previewing, setPreviewing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateMeta = (key: keyof DocMeta, val: string) =>
    setMeta((p) => ({ ...p, [key]: val }));

  const addQuestion = () =>
    setBlocks((p) => [...p, { id: uid(), type: "question", question: "", code: "" }]);

  const addText = () =>
    setBlocks((p) => [...p, { id: uid(), type: "text", content: "" }]);

  const updateBlock = (id: string, patch: Record<string, string>) =>
    setBlocks((p) =>
      p.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b))
    );

  const removeBlock = (id: string) =>
    setBlocks((p) => p.filter((b) => b.id !== id));

  const moveBlock = (id: string, dir: -1 | 1) =>
    setBlocks((p) => {
      const i = p.findIndex((b) => b.id === id);
      const j = i + dir;
      if (j < 0 || j >= p.length) return p;
      const next = [...p];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const getQuestionNumber = (id: string) => {
    let n = 0;
    for (const b of blocks) {
      if (b.type === "question") n++;
      if (b.id === id) return n;
    }
    return n;
  };

  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const buildPreviewHtml = useCallback(() => {
    let questionNum = 0;
    const blocksHtml = blocks
      .map((b) => {
        if (b.type === "question") {
          questionNum++;
          return `
            <div style="margin-bottom:28px;">
              <p style="font-weight:600;margin-bottom:10px;font-size:15px;">Q${questionNum}. ${escapeHtml(b.question) || "(No question text)"}</p>
              <p style="font-weight:600;margin-bottom:6px;font-size:13px;color:#555;">Code:</p>
              <pre style="border:1px solid #ddd;border-radius:4px;padding:14px;background:#f5f5f5;font-family:'Courier New',monospace;font-size:12px;line-height:1.5;overflow-x:auto;white-space:pre-wrap;word-wrap:break-word;">${escapeHtml(b.code)}</pre>
              <p style="font-weight:600;margin:14px 0 6px;font-size:13px;color:#555;">Output:</p>
              <div data-output-block="${b.id}" style="border:1px solid #ddd;border-radius:4px;padding:16px;background:#fff;">
                ${b.code}
              </div>
            </div>`;
        }
        return `<div style="margin-bottom:24px;white-space:pre-wrap;">${escapeHtml(b.content)}</div>`;
      })
      .join("");

    return `
      <div style="font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto;color:#111;">
        <h1 style="text-align:center;font-size:22px;margin-bottom:4px;">${escapeHtml(meta.title) || "Untitled Document"}</h1>
        <div style="text-align:center;margin-bottom:24px;color:#555;font-size:14px;">
          ${[meta.subject, meta.name, meta.rollNo, meta.date].filter(Boolean).map(escapeHtml).join(" | ")}
        </div>
        <hr style="margin-bottom:24px;border:none;border-top:1px solid #ccc;" />
        ${blocksHtml}
      </div>`;
  }, [blocks, meta]);

  const handlePreview = () => setPreviewing(true);

  const exportPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const el = previewRef.current;
    if (!el) return;
    html2pdf()
      .set({
        margin: 10,
        filename: `${meta.title || "document"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(el)
      .save();
  };

  const renderCodeToImage = async (code: string): Promise<Uint8Array> => {
    const html2canvas = (await import("html2canvas")).default;
    const container = document.createElement("div");
    container.style.cssText =
      "position:absolute;left:-9999px;top:0;width:700px;padding:16px;background:#fff;font-family:Arial,sans-serif;font-size:14px;";
    container.innerHTML = code;
    document.body.appendChild(container);
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff" });
    document.body.removeChild(container);
    const dataUrl = canvas.toDataURL("image/png");
    const raw = atob(dataUrl.split(",")[1]);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  };

  const exportDOCX = async () => {
    const {
      Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
      ImageRun, BorderStyle, TabStopPosition, TabStopType,
    } = await import("docx");
    const { saveAs } = await import("file-saver");

    const children: any[] = [
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
        // Question heading
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

        // "Code:" label
        children.push(
          new Paragraph({
            spacing: { before: 120 },
            children: [
              new TextRun({ text: "Code:", bold: true, size: 22, color: "555555" }),
            ],
          })
        );

        // Code lines in a bordered box
        const codeLines = b.code.split("\n");
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

        // "Output:" label
        children.push(
          new Paragraph({
            spacing: { before: 160 },
            children: [
              new TextRun({ text: "Output:", bold: true, size: 22, color: "555555" }),
            ],
          })
        );

        // Render output as image
        if (b.code.trim()) {
          try {
            const imgData = await renderCodeToImage(b.code);
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
          } catch {
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

    const doc = new Document({
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${meta.title || "document"}.docx`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Code2Docx</h1>

        {/* ---- META FIELDS ---- */}
        <section className="mb-8 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Document Info</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(
              [
                ["title", "Document Title"],
                ["subject", "Subject"],
                ["name", "Your Name"],
                ["rollNo", "Roll No"],
                ["date", "Date"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex flex-col gap-1 text-sm font-medium">
                {label}
                <input
                  type={key === "date" ? "date" : "text"}
                  value={meta[key]}
                  onChange={(e) => updateMeta(key, e.target.value)}
                  className="rounded border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </label>
            ))}
          </div>
        </section>

        {/* ---- BLOCKS ---- */}
        <section className="mb-8 space-y-4">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="rounded-lg border border-zinc-200 bg-white shadow-sm"
            >
              {/* block header */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2">
                <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
                  {b.type === "question"
                    ? `Question ${getQuestionNumber(b.id)}`
                    : "Text Block"}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveBlock(b.id, -1)}
                    className="rounded px-2 py-1 text-xs hover:bg-zinc-100"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveBlock(b.id, 1)}
                    className="rounded px-2 py-1 text-xs hover:bg-zinc-100"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeBlock(b.id)}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="p-4">
                {b.type === "question" ? (
                  <>
                    <input
                      placeholder="Question text..."
                      value={b.question}
                      onChange={(e) =>
                        updateBlock(b.id, { question: e.target.value })
                      }
                      className="mb-3 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-medium text-zinc-500">
                          HTML / CSS Code
                        </p>
                        <textarea
                          value={b.code}
                          onChange={(e) =>
                            updateBlock(b.id, { code: e.target.value })
                          }
                          rows={10}
                          spellCheck={false}
                          className="w-full resize-y rounded border border-zinc-300 bg-zinc-50 p-3 font-mono text-xs leading-relaxed focus:border-blue-500 focus:outline-none"
                          placeholder="<div style='color:red;'>Hello</div>"
                        />
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium text-zinc-500">
                          Live Preview
                        </p>
                        <div className="min-h-[200px] rounded border border-zinc-200 bg-white p-3">
                          <iframe
                            srcDoc={`<!DOCTYPE html><html><head><style>body{margin:0;font-family:Arial,sans-serif;font-size:14px;}</style></head><body>${b.code}</body></html>`}
                            className="h-full w-full min-h-[180px] border-0"
                            sandbox="allow-same-origin"
                            title="preview"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <textarea
                    value={b.content}
                    onChange={(e) =>
                      updateBlock(b.id, { content: e.target.value })
                    }
                    rows={4}
                    className="w-full resize-y rounded border border-zinc-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Enter text content..."
                  />
                )}
              </div>
            </div>
          ))}

          {/* add buttons */}
          <div className="flex gap-3">
            <button
              onClick={addQuestion}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add Question
            </button>
            <button
              onClick={addText}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
            >
              + Add Text Block
            </button>
          </div>
        </section>

        {/* ---- GENERATE / EXPORT ---- */}
        <section className="mb-8 flex gap-3">
          <button
            onClick={handlePreview}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Generate Preview
          </button>
          {previewing && (
            <>
              <button
                onClick={exportPDF}
                className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                Export PDF
              </button>
              <button
                onClick={exportDOCX}
                className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                Export DOCX
              </button>
            </>
          )}
        </section>

        {/* ---- PREVIEW ---- */}
        {previewing && (
          <section className="mb-12 rounded-lg border border-zinc-300 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
              <span className="text-sm font-semibold">Document Preview</span>
              <button
                onClick={() => setPreviewing(false)}
                className="text-xs text-zinc-500 hover:text-zinc-800"
              >
                Close Preview
              </button>
            </div>
            <div
              ref={previewRef}
              dangerouslySetInnerHTML={{ __html: buildPreviewHtml() }}
              className="p-4"
            />
          </section>
        )}
      </div>
    </div>
  );
}
