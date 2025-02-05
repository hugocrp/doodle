export class NeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize) {
        this.weightsInputHidden = this.randomMatrix(hiddenSize, inputSize);
        this.weightsHiddenOutput = this.randomMatrix(outputSize, hiddenSize);
        this.biasHidden = this.randomMatrix(hiddenSize, 1).flat();
        this.biasOutput = this.randomMatrix(outputSize, 1).flat();
    }

    randomMatrix(rows, cols) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.random() * 2 - 1)
        );
    }
 
    produitMatrice(matrix, vector) {
        return matrix.map(row =>
            row.reduce((sum, value, index) => sum + value * vector[index], 0)
        );
    }

    sommePondereEtBiais(matrix, vector, bias) {
        const dotProductResult = this.produitMatrice(matrix, vector);
        return dotProductResult.map((value, index) => value + bias[index]);
    }

    relu(vector) {
        return vector.map(value => Math.max(0, value));
    }

    prediction(input) {
        let hidden = this.sommePondereEtBiais(this.weightsInputHidden, input, this.biasHidden);
        const hiddenAfterRelu = this.relu(hidden);
        
        let output = this.sommePondereEtBiais(this.weightsHiddenOutput, hiddenAfterRelu, this.biasOutput);
        const outputfinal = this.relu(output);
        const maxIndex = outputfinal.indexOf(Math.max(...outputfinal));

        // Renvoie -1, 0 ou 1 selon l'index du maximum
        return maxIndex - 1;
    }
}