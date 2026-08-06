from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allows your HTML page to send requests to this server

@app.route('/shutdown', methods=['POST'])
def shutdown_windows():
    # Executes Windows shutdown command (10-second delay to allow web response)
    os.system("shutdown /s /t 10")
    return jsonify({"status": "success", "message": "Windows shutdown initiated."})

if __name__ == '__main__':
    print("Local Shutdown Server running on http://localhost:5000...")
    app.run(host='127.0.0.1', port=5000)
