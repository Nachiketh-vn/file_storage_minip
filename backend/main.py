from flask import Flask, jsonify, request
from flask_cors import CORS
from config import downloadFile
from flask_socketio import SocketIO, emit
import json
from Sockets import STATUS, RESPONSE_START, PROCESS_START, emitMessage
from LLM.llm import generate_response

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Secret'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/")
def helloWorld():
    return 'Hello World'


@app.route("/question", methods=["POST"])
def gen_response():
    if request.is_json:
        data = request.get_json()

        question = data['question']
        socketio.emit(RESPONSE_START, {"data": "New"})
        generate_response(question, socketio)
        return jsonify({"message": "Flask ID received"}), 200


@app.route('/fileid', methods=['POST'])
def receive_file():
    emitMessage(socketio, PROCESS_START)
    emitMessage(socketio, STATUS, "File id received")

    # Check if the request contains JSON data
    if request.is_json:
        # Parse the JSON data
        data = request.get_json()
        print(data)
        # Extract the 'flask_id' field from the data
        flask_id = data.get('file_id')
        file_path = data.get('file_path')
        file_name = data.get('file_name')

        downloadFile(file_path, file_name, socketio)

        if flask_id:
            # Process the Flask ID (e.g., save to database, perform some action)
            return jsonify({"message": "Flask ID received", "flask_id": flask_id}), 200
        else:
            return jsonify({"error": "Flask ID is missing"}), 400
    else:
        return jsonify({"error": "Request must be JSON"}), 400


if __name__ == "__main__":
    socketio.run(app=app, debug=True, host="0.0.0.0")
