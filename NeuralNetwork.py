import numpy as np

weight1 = np.loadtxt("static/train-data/weight111.txt", delimiter=",")
weight2 = np.loadtxt("static/train-data/weight222.txt", delimiter=",")
weight3 = np.loadtxt("static/train-data/weight333.txt", delimiter=",")

class ActivationFunction:
    def leaky_relu(self, x):
        return np.maximum(0.01, x)
    def leaky_relu_derivative(self, x):
        y = np.copy(x)
        y[x < 0] = 0.01
        y[x > 0] = 1
        return y
    def relu(self, x):
        return np.maximum(0, x)
    def relu_derivative(self, x):
        y = np.copy(x)
        y[x <= 0] = 0
        y[x > 0] = 1
        return y
    def sigmoid(x):
        x = np.clip( x, -100, 100 )
        x = 1.0/( 1 + np.exp(-x))
        return x
    def softmax(self, x):
        y = [np.exp(x[i])/np.sum(np.exp(x[i])) for i in range(x.shape[0])]
        return np.array(y)
class NeuralNetwork:
    def __init__(self):
        a, b = -1, 1
        self.W1 = weight1
        self.W2 = weight2
        self.W3 = weight3
        # self.W1 = np.round((b - a)*np.random.rand(4, 7) + a, 5)
        # self.W2 = np.round((b - a)*np.random.rand(7, 7) + a, 5)
        # self.W3 = np.round((b - a)*np.random.rand(7, 6) + a, 5)
        self.activation_function = ActivationFunction()
    def fordward(self, X):
        self.Z1 = X@self.W1
        self.A1 = self.activation_function.leaky_relu(self.Z1)
        self.Z2 = self.A1@self.W2
        self.A2 = self.activation_function.leaky_relu(self.Z2)
        self.Z3 = self.A2@self.W3
        self.A3 = self.activation_function.softmax(self.Z3)
    def backpropagation(self):
        pass
    def train(self, X, Y, LR, epoch):
        self.success_list = []
        self.sum_list = []

        #mini batch gd
        for ep in range(epoch):
            #batch 32
            batch_X = []
            batch_Y = []
            iter = X.shape[0] // 32
            data = np.hstack((X, Y))
            np.random.shuffle(data)
            for i in range(0, iter):
                batch_X.append(data[i * 32:(i + 1) * 32][:,:4])
                batch_Y.append(data[i * 32:(i + 1) * 32][:,4:])
            if X.shape[0] % 32 != 0:
                batch_X.append(X[(i + 1) * 32: -1])
                batch_Y.append(Y[(i + 1) * 32: -1])
            for mini in range(7):
                self.fordward(batch_X[mini])
                self.W1 = self.W1 - LR*(batch_X[mini].T@((((((self.A3 - batch_Y[mini])@self.W3.T)*self.activation_function.leaky_relu_derivative(self.Z2))*self.activation_function.leaky_relu_derivative(self.Z1)))))
                self.W2 = self.W2 - LR*(self.A1.T@(((self.A3 - batch_Y[mini])@self.W3.T)*self.activation_function.leaky_relu_derivative(self.Z2)))
                self.W3 = self.W3 - LR*(self.A2.T@(self.A3 - batch_Y[mini]))
        
        #batch gd
        # for k in range(epoch):
        #     self.fordward(X)
        #     self.W1 = self.W1 - LR*(X.T@((((((self.A3 - Y)@self.W3.T)*self.activation_function.leaky_relu_derivative(self.Z2))*self.activation_function.leaky_relu_derivative(self.Z1)))))
        #     self.W2 = self.W2 - LR*(self.A1.T@(((self.A3 - Y)@self.W3.T)*self.activation_function.leaky_relu_derivative(self.Z2)))
        #     self.W3 = self.W3 - LR*(self.A2.T@(self.A3 - Y))

            #loss and accuracy
            self.fordward(X)
            Y1 = np.zeros((Y.shape[0], Y.shape[1]))
            cnt = 0
            for i in range(len(self.A3)):
                Y1[i][np.where(self.A3[i] == np.amax(self.A3[i]))] = 1
                comparsion = Y[i] == Y1[i]
                if comparsion.all() : cnt+=1
            self.success_list.append(cnt)
            sum = -np.sum(Y*np.log(self.A3))
            self.sum_list.append(sum)
    def predict(self, test):
        self.fordward(test)
        self.result = self.A3