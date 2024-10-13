import pandas as pd
from os import path
from sklearn.feature_extraction.text import TfidfVectorizer

root_dir = path.dirname(path.abspath(__file__))
preprocessed_data_path = path.normpath(path.join(root_dir, 'data', 'Preprocessed_Dataset.csv'))

df = pd.read_csv(preprocessed_data_path)
df = df.astype(str)
corpus = df['Preprocessed Reviews']


def get_fitted_tfidf_instance():
    tfidf = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), min_df=2, max_df=0.8)
    tfidf.fit(corpus)

    return tfidf


def vectorizing_string(document: str):
    tfidf_ins = get_fitted_tfidf_instance()

    vector = tfidf_ins.transform([document]).toarray()
    return vector
