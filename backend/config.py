import os
from supabase import create_client
from Sockets import emitMessage, STATUS, PROCESS_END
from LLM.llm import generate_response, generateEmbeddings

url = "https://teqskwxomxbmyhpwxenr.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcXNrd3hvbXhibXlocHd4ZW5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzM3Nzc2NSwiZXhwIjoyMDI4OTUzNzY1fQ.J6Rg0R2ZvSMnR2ledJtNGuNOWXXfqmGrHjKtdCmrAik"
SupabaseClient = create_client(url, key)


def isFileExist(file_name):
    return os.path.isfile(f"./temp/{file_name}")


def downloadFile(file_path, file_name, socketio):
    if not isFileExist(file_name):
        emitMessage(socketio, STATUS, "Downloading file...")
        print("Downloading file...")
        
        with open(f"./temp/{file_name}", 'wb+') as f:
            res = SupabaseClient.storage.from_('files').download(file_path)
            f.write(res)
        
        emitMessage(socketio, STATUS, "File Downloaded Generating embeddings")
        generateEmbeddings(f"./temp/{file_name}", socketio)
       
    else:
        emitMessage(socketio, STATUS, "File Exist Ready for question")
        print("File already exists")
    
    emitMessage(socketio, PROCESS_END)
