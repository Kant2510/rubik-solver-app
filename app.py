import NeuralNetwork as nn
import process
import Base64ToImage as bti
import cv2
import numpy as np
from sklearn.preprocessing import MinMaxScaler

from flask import Flask, render_template, request, jsonify
import collections.abc
collections.Iterable = collections.abc.Iterable
collections.Mapping = collections.abc.Mapping
from rubik_solver import utils as rs
app = Flask(__name__)
np.set_printoptions(threshold = np.inf)
@app.route("/", methods = ['GET', 'POST'])

def index():
    return render_template('index.html')

color_recog = nn.NeuralNetwork()

@app.route('/result', methods = ['GET', 'POST'])
def result():
    res = []
    if request.method == "POST":
        #nhan hinh anh tu web
        name = request.get_data()
        image = bti.stringToImage(name)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        #xu ly hinh anh thanh ma tran
        image_matrix = np.array(image_rgb)
        image_matrix_split = process.split_matrix(image_matrix)
        #create input
        input = []
        for co in range(9):
            sum = np.array([[0, 0, 0]])
            for ii in range(25, image_matrix_split[co].shape[0] - 25):
                for jj in range(25, image_matrix_split[co].shape[1] - 25):
                    sum += image_matrix_split[co][ii][jj]
            input.append(np.round(sum / ((image_matrix_split[co].shape[0] - 50)*(image_matrix_split[co].shape[1] - 50)))[0])
        scaler = MinMaxScaler()
        scaler.fit(np.array(input))
        input = scaler.transform(input)
        input = np.concatenate((np.ones((input.shape[0], 1)), input), axis = 1)

        #predict
        color_recog.predict(input)
        colors = ["yellow", "blue", "red", "green", "orange", "white"]
        for i in range(len(color_recog.result)):
            print(colors[np.where(color_recog.result[i] == np.amax(color_recog.result[i]))[0][0]])
            res.append(colors[np.where(color_recog.result[i] == np.amax(color_recog.result[i]))[0][0]])
        print("____")
    result = {'colors': res}
    return jsonify(result)

@app.route('/solve', methods = ['GET', 'POST'])
def solve():
    result_of_solve = ""
    if request.method == "POST":
        string_color_to_solve = str(request.get_data())[2:-1]
        print(string_color_to_solve)
        print(rs.solve(string_color_to_solve, 'Kociemba'))
        result_of_solve = str(rs.solve(string_color_to_solve, 'Kociemba'))
    result = {'step': result_of_solve}
    return jsonify(result)
if __name__ == "__main__":
    app.run(debug = True)