import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
# NEW IMPORTS: Swapped OpenAI for Google GenAI
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ReguBite Compliance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_store = None

class QueryRequest(BaseModel):
    question: str

@app.on_event("startup")
def initialize_rag():
    global vector_store
    try:
        print("Starting RAG Initialization pipeline with Google Gemini...")
        
        if not os.path.exists("data") or not os.listdir("data"):
            print("Warning: 'data' directory is empty. Please add FSSAI PDFs.")
            return

        loader = DirectoryLoader(
            "data", 
            glob="**/*.pdf", 
            loader_cls=PyPDFLoader
        )
        documents = loader.load()
        print(f"Loaded {len(documents)} total pages from your PDFs.")
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, 
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", " ", ""]
        )
        chunks = text_splitter.split_documents(documents)
        chunks = chunks[:50]
        print(f"Successfully split data into {len(chunks)} searchable chunks.")
        
        embeddings = GoogleGenerativeAIEmbeddings(
            model="gemini-embedding-001"
        )
        vector_store = Chroma.from_documents(chunks, embeddings)
        print("Multi-document RAG Engine fully initialized and ready!")
        
    except Exception as e:
        print(f"Error during RAG initialization: {e}")

@app.post("/api/query")
async def query_compliance(request: QueryRequest):
    if not vector_store:
        return {
            "answer": "The compliance database is empty or still initializing. Please check backend logs.", 
            "sources": []
        }
    
    docs = vector_store.similarity_search(request.question, k=3)
    context = "\n\n".join([doc.page_content for doc in docs])
    
    sources = []
    for doc in docs:
        file_path = doc.metadata.get('source', 'Unknown Document')
        file_name = os.path.basename(file_path) 
        page_num = doc.metadata.get('page', 0) + 1 
        sources.append(f"{file_name} (Page {page_num})")

    sources = list(set(sources))

    system_prompt = f"""You are a strict Food Safety Compliance Assistant. 
    Answer the user's question accurately using ONLY the provided regulatory context below. 
    
    Guidelines:
    - Rely only on clear facts directly mentioned in the context.
    - Do not assume, extrapolate, or bring in outside knowledge.
    - If the context does not contain the answer, reply exactly with: 'Information not found in current regulatory guidelines.'
    
    Context:
    {context}
    """
    
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.question}
    ]
    
    response = llm.invoke(messages)
    
    return {
        "answer": response.content,
        "sources": sources
    }