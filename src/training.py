import pandas as pd
import yaml
import os
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib


def train_model():
    with open("params.yaml","r") as f:
        config = yaml.safe_load(f)
    n_estimators = config["model"]["n_estimators"]
    max_depth = config["model"]["max_depth"]
    random_state = config["model"]["random_state"]

    mlflow.set_tracking_uri("http://127.0.0.1:5000")
    mlflow.set_experiment("Soil Crop Recommendation")

    x_train = pd.read_csv(os.path.join("data","processed","x_train.csv"))
    x_test = pd.read_csv(os.path.join("data","processed","x_test.csv"))
    y_train = pd.read_csv(os.path.join("data","processed","y_train.csv"))
    y_test = pd.read_csv(os.path.join("data","processed","y_test.csv"))

    with mlflow.start_run():
        print("Trainign random forest with trees = {n_estimators} and depth = {max_depth}")
        model = RandomForestClassifier(
            n_estimators = n_estimators, max_depth = max_depth, random_state = random_state
        )

        model.fit(x_train, y_train.values.ravel())

        y_pred = model.predict(x_test)
        accu = accuracy_score(y_test, y_pred)

        print("Model Accuracy = {accu}")

        mlflow.log_param("n_estimators", n_estimators)
        mlflow.log_param("max_depth", max_depth)
        mlflow.log_metric("accuracy", accu)

        os.makedirs("models", exist_ok=True)
        joblib.dump(model, os.path.join("models", "soil_model.pkl"))

        print("Training model compeleted.")

if __name__ == "__main__":
    train_model()

