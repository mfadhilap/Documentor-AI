# DocuMentor AI

DocuMentor AI is a full-stack RAG-based study assistant that enables users to upload documents, organize classes, share study materials, and get AI-powered answers grounded in their PDFs.

---

## 🚀 Features

* User authentication (register & login)
* Create and join classes
* Post and share study materials
* Upload and parse PDF documents
* Chunk storage for efficient retrieval
* AI-powered Q&A based on uploaded content
* Timeline and PDF viewer interface

---

## 🛠 Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** MongoDB (Mongoose)
* **AI:** OpenAI API
* **RAG Pipeline:** LangChain

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Documentor-AI.git
cd Documentor-AI
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Setup environment variables

Create a `.env.local` file in the root directory and add:

```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://localhost:27017/DocuMentor
```

---

## ▶️ Running the Project

Make sure MongoDB is running, then start the development server:

```bash
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## ⚙️ Requirements

* Node.js installed
* MongoDB installed and running locally
* OpenAI API key

---

## 📁 Project Structure (Simplified)

```
app/              → Frontend pages & API routes  
lib/              → Database, models, RAG logic  
public/           → Static assets  
```

---

## 🔮 Future Improvements

* Vector database integration (FAISS / Pinecone)
* Improved retrieval accuracy and chunking
* Streaming AI responses
* Deployment (Vercel + MongoDB Atlas)

---

## 📄 License

This project is for educational purposes.
