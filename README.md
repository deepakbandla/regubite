# ReguBite – AI-Powered Food Business Compliance Navigator

ReguBite is a full-stack **Retrieval-Augmented Generation (RAG)** application that helps food business owners, cloud kitchens, restaurants, and food manufacturers navigate complex **FSSAI regulations** using natural language.

Instead of manually searching through hundreds of pages of government documents, users can ask questions in plain English and receive accurate, citation-backed answers generated using AI.

---

# Features

- **Semantic Search** – Retrieves the most relevant regulatory clauses using Gemini embeddings.
- **Source Verification** – Displays the exact document name and page number used to generate every answer.
- **Anti-Hallucination Guardrails** – The AI answers strictly from the retrieved regulatory documents and refuses to fabricate information.
- **Multi-PDF Support** – Automatically indexes multiple FSSAI PDF documents.
- **Fast Retrieval** – Uses ChromaDB for efficient vector similarity search.
- **Powered by Gemini 2.5 Flash** for fast and accurate responses.

---

# Tech Stack

## Frontend

- React (Vite)
- Tailwind CSS

## Backend

- FastAPI
- LangChain
- ChromaDB

## AI Models

- **Embeddings:** Gemini Embedding (`gemini-embedding-001`)
- **LLM:** Gemini 2.5 Flash

---

# Project Structure

```text
ReguBite/
│
├── backend/
│   ├── data/                 # FSSAI PDFs
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

---

# Prerequisites

Ensure the following software is installed before running the project:

- Python 3.9 or later
- Node.js 18 or later
- npm
- Git
- Google AI Studio API Key

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/regubite.git
cd regubite
```

---

## 2. Backend Setup

Navigate to the backend directory.

```bash
cd backend
```

Create a virtual environment.

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the required dependencies.

```bash
pip install fastapi uvicorn langchain langchain-community langchain-google-genai langchain-text-splitters chromadb pydantic python-dotenv pypdf unstructured
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

```env
GOOGLE_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY
```

---

## 4. Add Regulatory Documents

Create the following directory:

```text
backend/data
```

Place the required FSSAI regulation PDFs inside this folder.

Example:

```text
backend/
└── data/
    ├── Packaging_Regulations.pdf
    ├── Labelling_Regulations.pdf
    ├── Licensing_Regulations.pdf
    └── ...
```

---

## 5. Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd frontend
npm install
```

---

# Running the Application

The frontend and backend must be run in separate terminals.

## Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

A successful startup should display:

```text
Starting RAG Initialization...
Loaded XX pages.
Successfully split data into XX chunks.
Multi-document RAG Engine fully initialized and ready.
```

---

## Start the Frontend

```bash
cd frontend
npm run dev
```

Open the application in your browser:

```
http://localhost:5173
```

---

# How It Works

1. Loads all regulatory PDF documents.
2. Splits each document into smaller text chunks.
3. Generates vector embeddings for each chunk.
4. Stores the embeddings in ChromaDB.
5. Accepts a user's natural language question.
6. Retrieves the most relevant document chunks using semantic search.
7. Passes the retrieved context to Gemini.
8. Generates an answer strictly based on the retrieved regulatory content.
9. Displays the supporting document names and page numbers alongside the response.

---

# Features Demonstrated

- Retrieval-Augmented Generation (RAG)
- Semantic Vector Search
- Prompt Engineering
- FastAPI REST APIs
- LangChain Pipelines
- Chroma Vector Database
- Google Gemini API Integration
- React + Tailwind CSS
- Source Citation
- Multi-document Retrieval

---

# Note on Gemini Free Tier

Google's free Gemini Embedding API imposes rate limits on embedding requests.

During development, you may temporarily reduce the number of indexed chunks:

```python
chunks = chunks[:50]
```

For production-scale indexing, consider:

- Persisting the Chroma vector database
- Using local Hugging Face embedding models
- Upgrading the Gemini API quota

---

# Future Improvements

- Conversation history
- User authentication
- Persistent vector database
- Support for FDA and EFSA regulations
- PDF upload through the frontend
- Multi-language support
- Compliance report generation
- Hybrid keyword and semantic search
- Docker deployment

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push the branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Author

**Deepak Bandla**

- GitHub: https://github.com/<your-username>
- LinkedIn: https://linkedin.com/in/<your-linkedin>