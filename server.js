import os
import platform
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class ShutdownHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight request
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path == '/shutdown':
            os_name = platform.system()
            if os_name == "Windows":
                # Executes Windows shutdown command (10-second delay to allow web response)
                os.system("shutdown /s /t 10")
            elif os_name == "Darwin":
                # Executes macOS AppleScript shutdown cleanly (does not require sudo)
                os.system("osascript -e 'tell app \"System Events\" to shut down'")
            else:
                # Executes Linux shutdown command
                os.system("shutdown -h +1")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
            response = {"status": "success", "message": f"{os_name} shutdown initiated."}
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run(port=5000):
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, ShutdownHandler)
    print(f"Local Shutdown Server running on http://127.0.0.1:{port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == '__main__':
    run()
