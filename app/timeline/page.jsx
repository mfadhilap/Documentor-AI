"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const BANNER_COLORS = ["#0643ae", "#1a5276", "#154360"];

function formatDate(date) {
  return new Date(date).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Timeline() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [showJoinBox, setShowJoinBox] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postFiles, setPostFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    const res = await fetch("/api/classes");
    if (res.status === 401) { router.push("/"); return; }
    const data = await res.json();
    setClasses(data);
  }

  async function loadCards(classId) {
    setActiveClass(classId);
    setShowPostForm(false);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId }),
    });
    const data = await res.json();
    setPosts(data.posts || []);
    setIsCreator(data.success);
  }

  async function createClass() {
    if (!className.trim()) return alert("Please enter a class name.");
    const res = await fetch("/api/createClasses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ className }),
    });
    if (res.ok) {
      setClassName("");
      setShowCreateBox(false);
      loadClasses();
    } else {
      const d = await res.json();
      alert("Error: " + d.error);
    }
  }

  async function joinClass() {
    if (!classCode.trim()) return alert("Please enter a class code.");
    const res = await fetch("/api/joinClasses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classCode }),
    });
    if (res.ok) {
      setClassCode("");
      setShowJoinBox(false);
      loadClasses();
    } else {
      const d = await res.json();
      alert("Error: " + d.error);
    }
  }

  async function submitPost() {
    if (!postContent.trim()) return alert("Please enter some content.");
    if (!activeClass) return alert("Please select a class first.");

    const formData = new FormData();
    formData.append("classId", activeClass);
    formData.append("content", postContent);
    for (const file of postFiles) {
      formData.append("media", file);
    }

    const res = await fetch("/api/postit", { method: "POST", body: formData });
    if (res.ok) {
      setPostContent("");
      setPostFiles([]);
      setShowPostForm(false);
      loadCards(activeClass);
    } else {
      alert("Failed to post.");
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ fontFamily: "'Jost', sans-serif" }}>
      {/* Nav */}
      <nav className="flex justify-between items-center w-full h-[60px] bg-navy px-5 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <img src="/list.svg" width={40} height={35} alt="" />
          <span className="text-white text-2xl font-bold">Docu</span>
          <span className="text-light-blue text-2xl font-bold" style={{ color: "#A2CAFF" }}>Mentor</span>
          <span className="text-white text-2xl font-bold">Ai</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-white text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          Logout
        </button>
      </nav>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="flex flex-col w-[320px] shrink-0 overflow-hidden" style={{ backgroundColor: "#A2CAFF" }}>
          {/* Buttons */}
          <div className="flex gap-2 p-4 shrink-0">
            <button
              onClick={() => { setShowCreateBox(!showCreateBox); setShowJoinBox(false); }}
              className="flex-1 py-2 rounded-lg font-bold text-white text-sm transition-all"
              style={{ backgroundColor: "#01296F" }}
            >
              + Create
            </button>
            <button
              onClick={() => { setShowJoinBox(!showJoinBox); setShowCreateBox(false); }}
              className="flex-1 py-2 rounded-lg font-bold text-white text-sm transition-all"
              style={{ backgroundColor: "#01296F" }}
            >
              Join
            </button>
          </div>

          {/* Create box */}
          {showCreateBox && (
            <div className="mx-4 mb-3 bg-white rounded-xl p-4 shadow">
              <h3 className="font-bold text-navy mb-2" style={{ color: "#01296F" }}>Create a Class</h3>
              <input
                type="text"
                placeholder="Class name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createClass()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none"
              />
              <button
                onClick={createClass}
                className="w-full py-2 rounded-lg text-white text-sm font-bold"
                style={{ backgroundColor: "#01296F" }}
              >
                Create
              </button>
            </div>
          )}

          {/* Join box */}
          {showJoinBox && (
            <div className="mx-4 mb-3 bg-white rounded-xl p-4 shadow">
              <h3 className="font-bold mb-2" style={{ color: "#01296F" }}>Join a Class</h3>
              <input
                type="text"
                placeholder="Class code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinClass()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none"
              />
              <button
                onClick={joinClass}
                className="w-full py-2 rounded-lg text-white text-sm font-bold"
                style={{ backgroundColor: "#01296F" }}
              >
                Join
              </button>
            </div>
          )}

          {/* Class cards */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-4 pb-4">
            {classes.length === 0 && (
              <p className="text-center text-navy font-semibold mt-10 opacity-60" style={{ color: "#01296F" }}>
                No classes yet
              </p>
            )}
            {classes.map((cls, i) => (
              <ClassCard
                key={cls.classId}
                cls={cls}
                colorIndex={i % 3}
                isActive={activeClass === cls.classId}
                onClick={() => loadCards(cls.classId)}
              />
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f4f7fc]">
          {!activeClass ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-xl font-semibold">Select a class to view posts</p>
            </div>
          ) : (
            <>
              {/* Posts list */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                {posts.length === 0 && (
                  <p className="text-gray-400 text-center mt-10">No posts yet.</p>
                )}
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {/* Post form */}
              {isCreator && (
                <div className="shrink-0 border-t border-gray-200 bg-white p-4">
                  {!showPostForm ? (
                    <button
                      onClick={() => setShowPostForm(true)}
                      className="flex items-center gap-2 text-navy font-bold px-5 py-2 rounded-full border-2 border-navy hover:bg-navy hover:text-white transition-all"
                      style={{ color: "#01296F", borderColor: "#01296F" }}
                    >
                      <img src="/post.svg" width={20} alt="" /> POST
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={3}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-navy text-sm"
                      />
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-500 hover:text-navy">
                          <img src="/file.svg" width={18} alt="" />
                          {postFiles.length > 0 ? `${postFiles.length} file(s)` : "Attach files"}
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => setPostFiles(Array.from(e.target.files))}
                          />
                        </label>
                        <div className="flex gap-2 ml-auto">
                          <button
                            onClick={() => { setShowPostForm(false); setPostContent(""); setPostFiles([]); }}
                            className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={submitPost}
                            className="px-6 py-2 rounded-lg text-sm text-white font-bold"
                            style={{ backgroundColor: "#01296F" }}
                          >
                            POST
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ClassCard({ cls, colorIndex, isActive, onClick }) {
  const [flipped, setFlipped] = useState(false);
  const banners = ["/banner1.jpg", "/banner2.jpg", "/banner3.jpg"];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer shadow-md"
      style={{ height: "150px", perspective: "1000px" }}
      onClick={onClick}
      onContextMenu={(e) => { e.preventDefault(); setFlipped(!flipped); }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={banners[colorIndex]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg">{cls.classname}</h3>
            <p className="text-white text-xs opacity-80">by {cls.creatorName}</p>
          </div>
          {isActive && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full" />
          )}
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", backgroundColor: "#01296F" }}
        >
          <p className="text-white font-bold text-sm">Code: {cls.classcode}</p>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <img src="/prof.svg" width={35} height={35} alt="" />
        <div>
          <h3 className="font-bold text-sm" style={{ color: "#01296F" }}>{post.author?.name}</h3>
          <p className="text-xs text-gray-400">{formatDate(post.postedAt)}</p>
        </div>
      </div>
      <hr className="mb-3 border-gray-100" />
      <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p>

      {post.media?.newFilename?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.media.newFilename.map((filename, i) => (
            <a
              key={i}
              href={`/pdf-viewer?pdf=${encodeURIComponent("/uploads/" + filename)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-semibold"
              style={{ backgroundColor: "#0643ae" }}
            >
              📄 {post.media.originalFilename[i] || "File"}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}