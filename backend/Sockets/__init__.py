STATUS = "status"
PROCESS_START = "process_start"
PROCESS_END = "process_end"
RESPONSE_START = "res_start"
RESPONES_END = "res_end"
RESPONSE_UPDATE = 'res'


def emitMessage(socketio, type, message="", room="message"):
    socketio.emit(room, {"type": type, "data": message})
