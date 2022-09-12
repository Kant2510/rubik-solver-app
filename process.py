import numpy as np

def split_matrix(arr):
    r_x = arr.shape[1] % 3
    res_x = arr.shape[1] // 3

    r_y = arr.shape[0] % 3
    res_y = arr.shape[0] // 3
    B = []
    A = arr
    for i_y in range(3):
        for i_x in range(3):
            A = arr[res_y*i_y:res_y + res_y*i_y + (r_y if i_y == 2 else 0)]
            A = [line[res_x*i_x:res_x + res_x*i_x + (r_x if i_x == 2 else 0)] for line in A]
            B.append(np.array(A))
    return B
