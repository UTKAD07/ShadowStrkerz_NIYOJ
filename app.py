from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={
    r"/plan": {"origins": "*", "methods": ["GET"]}
})

@app.route("/plan", methods=["GET"])
def get_plan():
    fake_plan = {
        "plan_id": "DEMO001",
        "is_demo": True,
        "blocks": [
            {
                "block_id": "B001",
                "corridor": "STN01-STN02",
                "department": "Track",
                "task": "Rail crack repair",
                "start_time": "02:00",
                "end_time": "03:00"
            }
        ]
    }

    return jsonify(fake_plan), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)