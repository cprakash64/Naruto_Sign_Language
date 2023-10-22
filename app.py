# app.py
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/greeting', methods=['GET'])
def greet():
    return jsonify(message="Hello from Flask!")

if __name__ == '__main__':
    app.run(debug=True)
