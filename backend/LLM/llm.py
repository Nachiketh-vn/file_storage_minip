from io import StringIO
from langchain_community.vectorstores import Qdrant
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import Any
from pydantic import BaseModel
from qdrant_client import QdrantClient
from langchain_community.chat_models import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
import os
from flask_socketio import SocketIO, emit
from Sockets import STATUS, emitMessage, RESPONES_END, RESPONSE_START, RESPONSE_UPDATE

# embedding model setup
model_name = "BAAI/bge-large-en"
model_kwargs = {'device': 'cpu'}
embeddings = HuggingFaceBgeEmbeddings(
    model_name=model_name, model_kwargs=model_kwargs)
print("Embedding model loaded")


# setup vector db
# qdrant setup -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
url = "http://localhost:6333"
collection_name = "test_collection"
client = QdrantClient(url, prefer_grpc=False)
print("Qdrant client created")
qdrant = Qdrant(client=client, collection_name=collection_name,
                embeddings=embeddings)
print("Qdrant object created")
retriever = qdrant.as_retriever()
print("Qdrant object converted to retriever")
# qdrant setup -----------------------------------------------------------------------------------------------------------------------------------------------------------------------


def generateEmbeddings(filepath, socketio):

    emitMessage(socketio, STATUS, "Generating Embeddings")
    # Get texts
    loader = PyPDFLoader(filepath)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    text_chunks = text_splitter.split_documents(documents)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    text_chunks = text_splitter.split_documents(documents)

    emitMessage(socketio, STATUS, "Storing in DB")
    qdrant = Qdrant.from_documents(
        text_chunks,
        embeddings,
        url=url,
        collection_name=collection_name,
        prefer_grpc=False
    )

    print("embedding saved in qudrant")
    emitMessage(socketio, STATUS, "Embedding saved in qudran")


template = """answer the question based on the following context :- {context},
for the question {question} Please give provide the source name and page number only once for the meta data."""
prompt = ChatPromptTemplate.from_template(template)


model = ChatOllama(model="llama3")

# RAG pipeline
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)


def generate_response(message, socketio):
    print("generating response for ", message)
    emitMessage(socketio, RESPONSE_START, "")
    response = chain.stream(message)
    for partial in response:
        token = partial
        print(token)
        emitMessage(socketio, RESPONSE_UPDATE, token)
    emitMessage(socketio, RESPONES_END, "")
    print("response generation completed ", message)
