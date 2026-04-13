"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function PdfViewer() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get("pdf");

  // Extract filename from URL e.g. /uploads/1234-abc.pdf -> 1234-abc.pdf
  const filename = pdfUrl ? pdfUrl.split("/").pop() : null;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/vid3.mp4");

  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);
  const chatEndRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!pdfUrl) return;
    loadPdfJs();
  }, [pdfUrl]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function loadPdfJs() {
    if (window.pdfjsLib) { initPdf(); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      initPdf();
    };
    document.head.appendChild(script);
  }

  async function initPdf() {
    try {
      const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      setPdfLoaded(true);
      renderPage(pdf, 1);
    } catch (e) {
      console.error("Error loading PDF:", e);
    }
  }

  async function renderPage(pdf, pageNum) {
    const page = await pdf.getPage(pageNum);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: 1.2 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
  }

  function goToPrev() {
    if (currentPage <= 1) return;
    const next = currentPage - 1;
    setCurrentPage(next);
    renderPage(pdfDocRef.current, next);
  }

  function goToNext() {
    if (currentPage >= totalPages) return;
    const next = currentPage + 1;
    setCurrentPage(next);
    renderPage(pdfDocRef.current, next);
  }

  function switchVideo(src, loop) {
    setVideoSrc(src);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.loop = loop;
        videoRef.current.load();
        videoRef.current.play();
      }
    }, 50);
  }

  function formatResponse(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(?:^|\n)[-•]\s*(.*?)(?=\n|$)/g, "<li>$1</li>");
    if (text.includes("<li>")) {
      text = `<ul style="list-style:disc;padding-left:20px;margin-top:8px">${text}</ul>`;
    }
    text = text.replace(/\n/g, "<br/>");
    return text;
  }

  async function askQuestion() {
    if (!question.trim() || loading) return;
    if (!filename) return alert("No file loaded.");

    const userQ = question;
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: userQ }]);
    setLoading(true);
    switchVideo("/vid2.mp4", false);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQ, filename }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: "ai", text: data.error }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Error fetching response." }]);
    } finally {
      setLoading(false);
      switchVideo("/vid3.mp4", true);
    }
  }

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{ fontFamily: "'Jost', sans-serif", background: "url('/bg.jpg') center/cover no-repeat" }}
    >
      {/* Nav */}
      <nav
        className="flex justify-between items-center w-full h-[60px] shrink-0 px-5"
        style={{ backgroundColor: "#01296F" }}
      >
        <div className="flex items-center gap-2">
          <img src="/list.svg" width={40} height={35} alt="" />
          <span className="text-white text-2xl font-bold">Docu</span>
          <span className="text-2xl font-bold" style={{ color: "#A2CAFF" }}>Mentor</span>
          <span className="text-white text-2xl font-bold">Ai</span>
        </div>
        <a href="/timeline" className="text-white text-sm opacity-70 hover:opacity-100">
          ← Back
        </a>
      </nav>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4">

        {/* PDF Panel */}
        <div
          className="flex flex-col rounded-2xl p-4 w-[380px] shrink-0 shadow-xl"
          style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}
        >
          <h2 className="text-white text-lg font-bold mb-3 text-center">📄 PDF Viewer</h2>

          <div className="flex-1 overflow-auto flex items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            {!pdfLoaded && (
              <p className="text-white opacity-60 text-sm">Loading PDF...</p>
            )}
            <canvas ref={canvasRef} className="max-w-full rounded" />
          </div>

          <div className="flex justify-between items-center mt-3 gap-2">
            <button
              onClick={goToPrev}
              disabled={currentPage <= 1}
              className="flex-1 py-2 rounded-lg text-white font-bold text-sm disabled:opacity-40"
              style={{ backgroundColor: "#0643ae", border: "2px solid #669af5" }}
            >
              ⬅ Prev
            </button>
            <span className="text-white text-sm font-semibold whitespace-nowrap">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={goToNext}
              disabled={currentPage >= totalPages}
              className="flex-1 py-2 rounded-lg text-white font-bold text-sm disabled:opacity-40"
              style={{ backgroundColor: "#0643ae", border: "2px solid #669af5" }}
            >
              Next ➡
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex rounded-2xl overflow-hidden shadow-xl bg-white">

          {/* Robot video */}
          <div className="flex items-center justify-center p-6 shrink-0" style={{ width: "260px" }}>
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted
              loop
              className="rounded-xl w-full"
              style={{ maxHeight: "380px", objectFit: "cover" }}
            />
          </div>

          {/* Divider */}
          <div className="w-[2px] self-stretch my-6 bg-gray-200" />

          {/* Chat */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden">

            {/* RAG notice */}
            <p className="text-xs text-gray-400 mb-3 text-center">
              💡 Answers are based only on content found in this document
            </p>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4">
              {messages.length === 0 && (
                <p className="text-gray-400 text-sm text-center mt-10">
                  Ask a question about the document...
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="rounded-2xl px-5 py-4 text-white text-sm shadow-md"
                  style={{
                    backgroundColor: msg.role === "user" ? "#0643ae" : "#669af5",
                    alignSelf: msg.role === "user" ? "flex-start" : "flex-end",
                    maxWidth: "85%",
                    lineHeight: "1.6",
                  }}
                  dangerouslySetInnerHTML={
                    msg.role === "ai"
                      ? { __html: formatResponse(msg.text) }
                      : undefined
                  }
                >
                  {msg.role === "user" ? msg.text : undefined}
                </div>
              ))}
              {loading && (
                <div
                  className="self-end rounded-2xl px-5 py-4 text-white text-sm animate-pulse"
                  style={{ backgroundColor: "#669af5" }}
                >
                  Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                placeholder="Ask a question about this document..."
                className="w-full border border-gray-300 rounded-full px-5 py-3 pr-14 text-sm focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={askQuestion}
                disabled={loading}
                className="absolute right-2 w-10 h-10 rounded-full text-white font-bold text-xl flex items-center justify-center disabled:opacity-50"
                style={{ backgroundColor: "#0643ae" }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}