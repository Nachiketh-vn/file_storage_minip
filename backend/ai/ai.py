import streamlit as st
from io import StringIO
from langchain.vectorstores import Qdrant
from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import Any
from pydantic import BaseModel
from qdrant_client import QdrantClient
from langchain_community.chat_models import ChatOllama
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
import os


def get_full_message():
    full_message = ""
    for message in st.session_state["messages"]:
        full_message += message["content"]
    return st.session_state["messages"][-1]["content"]

def run_intro_completion():
    with st.form(key="my_form2"):
       intro_dialogue = st.text_input(label="Introduce yourself")
       submit_button = st.form_submit_button(label="Submit")
    num_tokens = 0
    if submit_button:
       return intro_dialogue
    # else:
    return None


class Element(BaseModel):
    type: str
    text: Any

#embeddings model setup -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
model_name="BAAI/bge-large-en"
model_kwargs={'device':'cpu'}
embeddings=HuggingFaceBgeEmbeddings(model_name=model_name,model_kwargs=model_kwargs)
print("Embedding model loaded")
#embeddings model setup -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

#qdrant setup -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
url="http://localhost:6333"
collection_name="test_collection"
client=QdrantClient(url,prefer_grpc=False)
print("Qdrant client created")
qdrant=Qdrant(client=client,collection_name=collection_name,embeddings=embeddings)
print("Qdrant object created")
retriever = qdrant.as_retriever()
print("Qdrant object converted to retriever")
#qdrant setup -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

################## one time end

# upload pdf file -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
uploaded_files = st.file_uploader("Upload a PDF file", type=["pdf"], accept_multiple_files=True)
for uploaded_file in uploaded_files:
    bytes_data = uploaded_file.read()
    st.write("filename:", uploaded_file.name)
#writing pdf to pdfs folder and adding to qdrant
for uploaded_file in uploaded_files:

    if os.path.exists(f"{uploaded_file.name}"):
        continue

    with open(f"{uploaded_file.name}", "wb") as f:
        f.write(bytes_data)

    st.write(f"Saved {uploaded_file.name} wait for processing...")
    # saving embeddings to qdrant
    output_dir = "images"

    # Get texts
    loader=PyPDFLoader(f"{uploaded_file.name}")
    documents=loader.load()

    text_splitter=RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
    )

    text_chunks=text_splitter.split_documents(documents)

    text_splitter=RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
    )

    # table_chunks=text_splitter.split_text(table_summaries)

    st.write("Text and tables split, now saving to Qdrant...")

    qdrant=Qdrant.from_documents(
    text_chunks,
    embeddings,
    url=url,
    collection_name=collection_name,
    prefer_grpc=False
    )

    print("text index in qdrant")

    print("tables index in qdrant")
    st.write("Text and tables saved to Qdrant, ready for retrieval!")

#upload pdf file -----------------------------------------------------------------------------------------------------------------------------------------------------------------------


# chain setup 1 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Prompt template
template = """answer the question based on the following context :- {context},
for the question {question} Please give answers such that it can be used in exams by students , so explain in detail such that can write in exams.
 and provide the source name and page number only once for the meta data."""
prompt = ChatPromptTemplate.from_template(template)

# Option 1: LLM
model = ChatOllama(model="llama3")
# Option 2: Multi-modal LLM
# model = LLaVA

# RAG pipeline
chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

st.title('Search Library')

if "messages" not in st.session_state:
	st.session_state["messages"] = [{"role": "assistant","content":"Hello! How can I help you today?"}]

# write messages
for msg in st.session_state.messages:
	st.chat_message(msg["role"]).write(msg["content"])

def generate_response():
	response = chain.stream(get_full_message())
	print(response)
	for partial_resp in response:
		token = partial_resp
		print(token)
		st.session_state["full_msg"] += token
		yield token

# def generate_response():
#     if st.session_state['run']==0:
#         response = chain1.stream(get_full_message())
#         print(response)
#         nextq=""
#         for partial_resp in response:
#             token = partial_resp
#             if token=="69934" or token=="clarify" or token=="?":
#                 st.session_state['run']=1
#             print(token)
#             st.session_state["full_msg"] += token
#             yield token

#     else:
#         response = chain2.stream(get_full_message())
#         print(response)
#         for partial_resp in response:
#         	token = partial_resp
#         	print(token)
#         	st.session_state["full_msg"] += token
#         	yield token


prompt = st.chat_input()
if prompt:
    st.session_state["run"]=0
    st.session_state.messages.append({"role": "user", "content": prompt})
    st.chat_message("user").write(prompt)
    st.session_state["full_msg"] = ""
    st.chat_message("assistant").write_stream(generate_response())
    st.session_state.messages.append({"role": "assistant", "content": st.session_state["full_msg"]})

# chatbot -----------------------------------------------------------------------------------------------------------------------------------------------------------------------