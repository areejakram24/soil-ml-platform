import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import yaml
import os

def preprocess():
    with open("params.yaml","r") as fl:
        config = yaml.safe_load(fl)
        test_size = config["preprocessing"]["test_size"]
        random_state = config["preprocessing"]["random_state"]
        fl.close()

        raw_path = os.path.join("data","raw","soil_data.csv")
        df = pd.read_csv(raw_path)

#separate features; my dataset had 'label'
        x = df.drop(columns = ["label"])
        y = df["label"]

        x_train, x_test, y_train, y_test = train_test_split(x,y,test_size = test_size, random_state = random_state)

        scale = StandardScaler()
        x_scaled_train = scale.fit_transform(x_train)
        x_scaled_test = scale.transform(x_test)

        #convert back to data frames cuz format preserving
        x_df_train = pd.DataFrame(x_scaled_train, columns = x.columns)
        x_df_test = pd.DataFrame(x_scaled_test, columns=x.columns)

        os.makedirs(os.path.join("data","processed"),exist_ok = True)

        x_df_train.to_csv(os.path.join("data","processed","x_train.csv"), index = False)
        x_df_test.to_csv(os.path.join("data","processed","x_test.csv"), index = False)
        y_test.to_csv(os.path.join("data","processed","y_test.csv"), index = False)
        y_train.to_csv(os.path.join("data","processed","y_train.csv"), index = False)

        print("Data cleaning completed!")


if __name__ == "__main__":
    preprocess()
