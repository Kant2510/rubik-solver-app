# Rubik-solver-app
- A small project about using deep learning model to recognize color of the rubik's cube.
- Example: 
- ![example](https://user-images.githubusercontent.com/88287313/190311522-b69f3268-85a7-4002-a791-5b6a0034bb1e.jpg)
# Deep learning model
- Using artificial neural network with 3 input nodes (RGB color code), 2 hidden layers (7 nodes each layer) and we have 6 nodes for the output layer (in accordance with 6 colors of the rubik's cube).
- Activation function for hidden layer is leaky-relu and output layer is softmax funtion
- **A tip to simplify input data:** raw data is images of cube's faces that has (300px x 300px) resolution. Then we split each of that images into 9 smaller images (resolution 100px x 100px). After that, removing the image border (about 25px) and we get 9 single color images (50px x 50px) for each image of cube's face. Finally, we use opencv library to convert single color image into a RGB color code matrix size 50x50 (2500 pixels), we take the average of 2500 RGB color codes and regard this average value as the representation of 2500 RGB color codes. So we use that value for 3 input nodes.
# Loss function
![Figure_5](https://user-images.githubusercontent.com/88287313/190311418-65e7c928-201b-485a-b28f-7987e10a119f.png)
# Accuracy
![Figure_3](https://user-images.githubusercontent.com/88287313/190311451-c66cb28c-535d-4dbf-9e42-dad7d6440fd5.png)
# Product
https://rubik-cube-solver-by-kant.herokuapp.com/
