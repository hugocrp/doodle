/**
 * Classe NeuralNetwork : Implémente un réseau de neurones simple.
 */
export class NeuralNetwork {
    /**
     * Constructeur de NeuralNetwork.
     * @param {number} inputSize - Nombre d'entrées.
     * @param {number} hiddenSize - Nombre de neurones dans la couche cachée.
     * @param {number} outputSize - Nombre de sorties.
     */
    constructor(inputSize, hiddenSize, outputSize) {
        this.weightsInputHidden = this.randomMatrix(hiddenSize, inputSize);
        this.weightsHiddenOutput = this.randomMatrix(outputSize, hiddenSize);
        this.biasHidden = this.randomMatrix(hiddenSize, 1).flat();
        this.biasOutput = this.randomMatrix(outputSize, 1).flat();
    }

    /**
     * Génère une matrice de valeurs aléatoires.
     * @param {number} rows - Nombre de lignes.
     * @param {number} cols - Nombre de colonnes.
     * @returns {Array} - Matrice générée.
     */
    randomMatrix(rows, cols) {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.random() * 2 - 1)
        );
    }

    /**
     * Calcule le produit matriciel entre une matrice et un vecteur.
     * @param {Array} matrix - Matrice.
     * @param {Array} vector - Vecteur.
     * @returns {Array} - Résultat du produit matriciel.
     */
    produitMatrice(matrix, vector) {
        return matrix.map(row =>
            row.reduce((sum, value, index) => sum + value * vector[index], 0)
        );
    }

    /**
     * Calcule la somme pondérée et ajoute les biais.
     * @param {Array} matrix - Matrice.
     * @param {Array} vector - Vecteur.
     * @param {Array} bias - Biais.
     * @returns {Array} - Résultat de la somme pondérée.
     */
    sommePondereEtBiais(matrix, vector, bias) {
        const dotProductResult = this.produitMatrice(matrix, vector);
        return dotProductResult.map((value, index) => value + bias[index]);
    }

    /**
     * Applique la fonction d'activation ReLU.
     * @param {Array} vector - Vecteur.
     * @returns {Array} - Vecteur après application de ReLU.
     */
    relu(vector) {
        return vector.map(value => Math.max(0, value));
    }

    /**
     * Effectue une prédiction en fonction des entrées.
     * @param {Array} input - Entrées.
     * @returns {number} - Prédiction (-1, 0 ou 1).
     */
    prediction(input) {
        let hidden = this.sommePondereEtBiais(this.weightsInputHidden, input, this.biasHidden);
        const hiddenAfterRelu = this.relu(hidden);

        let output = this.sommePondereEtBiais(this.weightsHiddenOutput, hiddenAfterRelu, this.biasOutput);
        const outputfinal = this.relu(output);
        const maxIndex = outputfinal.indexOf(Math.max(...outputfinal));

        return maxIndex - 1; // Renvoie -1, 0 ou 1
    }
}