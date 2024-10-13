import joblib
from os import path
from flask import Flask, jsonify, request
from Preprocessing import preprocess_string
from Vectorizing import vectorizing_string

app = Flask(__name__)

root_dir = path.dirname(path.abspath(__file__))
model_path = path.normpath(path.join(root_dir, 'Review_Tagger_Model.pkl'))
review_tagger_model = joblib.load(model_path)


@app.route('/')
def home():
    return jsonify({'message': 'Hello World From PTIT HCM!'})


@app.route('/predict-tags', methods=['POST'])
def predict_tags():
    try:
        body = request.get_json()
        review = body.get('review')

        if not review or not isinstance(review, str):
            return jsonify({'predicted_tags': []})

        # Preprocess the review
        preprocessed_review = preprocess_string(review)
        vectorized_review = vectorizing_string(preprocessed_review)

        # Make the prediction
        all_tags = ['Acting', 'Plot', 'Scene', 'Comedy', 'Touching']
        prediction = review_tagger_model.predict(vectorized_review).toarray()

        # Return the predicted tags as a JSON response
        return jsonify(
            {'predicted_tags': [tag for idx, tag in enumerate(all_tags) if prediction[0][idx]]}
        )
    except Exception:
        return jsonify({'predicted_tags': []})


if __name__ == '__main__':
    app.run(debug=True, port=8080)
