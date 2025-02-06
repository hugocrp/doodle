import { NeuralNetwork } from './neuralNetwork.js';
import Model from '../game/model.js';
import View from '../game/view.js';
import Controller from '../game/controller.js';
import Graphic from './Graphic.js';

/**
 * Classe GeneticAlgorithm : Implémente un algorithme génétique pour entraîner des réseaux de neurones.
 */
class GeneticAlgorithm {
    /**
     * Constructeur de GeneticAlgorithm.
     * @param {number} populationSize - Taille de la population.
     * @param {number} inputSize - Nombre d'entrées du réseau de neurones.
     * @param {number} hiddenSize - Nombre de neurones dans la couche cachée.
     * @param {number} outputSize - Nombre de sorties du réseau de neurones.
     */
    constructor(populationSize, inputSize, hiddenSize, outputSize) {
        this.populationSize = populationSize;
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.population = this.createInitialPopulation();
        this.generation = 1;
        this.chart = new Graphic('chart_div');
    }

    /**
     * Crée la population initiale de réseaux de neurones.
     * @returns {Array} - Population initiale.
     */
    createInitialPopulation() {
        return Array.from({ length: this.populationSize }, () =>
            new NeuralNetwork(this.inputSize, this.hiddenSize, this.outputSize)
        );
    }

    /**
     * Évalue la population en exécutant chaque réseau de neurones dans le jeu.
     * @param {Function} callback - Fonction de rappel appelée après l'évaluation.
     */
    evaluatePopulation(callback) {
        const evaluatedPopulation = [];
        let completed = 0;

        this.population.forEach((network, index) => {
            const model = new Model();
            const view = new View(`my_canvas_${index}`, `score_${index}`);
            const controller = new Controller(model, view);

            controller.runGameWithNetwork(network, score => {
                evaluatedPopulation.push({ network, score });
                completed++;
                if (completed === this.population.length) {
                    callback(evaluatedPopulation);
                }
            }, index);
        });
    }

    /**
     * Sélectionne les meilleurs réseaux de neurones.
     * @param {Array} evaluatedPopulation - Population évaluée.
     * @param {number} numBest - Nombre de meilleurs réseaux à sélectionner.
     * @returns {Array} - Meilleurs réseaux de neurones.
     */
    selectBest(evaluatedPopulation, numBest) {
        return evaluatedPopulation
            .sort((a, b) => b.score - a.score)
            .slice(0, numBest)
            .map(individual => individual.network);
    }

    /**
     * Crée un nouvel individu par reproduction de deux parents.
     * @param {NeuralNetwork} parent1 - Premier parent.
     * @param {NeuralNetwork} parent2 - Deuxième parent.
     * @returns {NeuralNetwork} - Enfant créé.
     */
    reproduction(parent1, parent2) {
        const child = new NeuralNetwork(this.inputSize, this.hiddenSize, this.outputSize);

        // Reproduction des poids de la couche d'entrée à la couche cachée
        child.weightsInputHidden = parent1.weightsInputHidden.map((row, i) =>
            row.map((value, j) => (value + parent2.weightsInputHidden[i][j]) / 2)
        );

        // Reproduction des poids de la couche cachée à la couche de sortie
        child.weightsHiddenOutput = parent1.weightsHiddenOutput.map((row, i) =>
            row.map((value, j) => (value + parent2.weightsHiddenOutput[i][j]) / 2)
        );

        // Reproduction des biais
        child.biasHidden = parent1.biasHidden.map((value, i) => (value + parent2.biasHidden[i]) / 2);
        child.biasOutput = parent1.biasOutput.map((value, i) => (value + parent2.biasOutput[i]) / 2);

        return child;
    }

    /**
     * Applique une mutation à un réseau de neurones.
     * @param {NeuralNetwork} network - Réseau de neurones à muter.
     * @param {number} mutationRate - Taux de mutation.
     */
    mutate(network, mutationRate) {
        network.weightsInputHidden = network.weightsInputHidden.map(row =>
            row.map(value => Math.random() < mutationRate ? value + (Math.random() * 2 - 1) * 0.1 : value)
        );

        network.weightsHiddenOutput = network.weightsHiddenOutput.map(row =>
            row.map(value => Math.random() < mutationRate ? value + (Math.random() * 2 - 1) * 0.1 : value)
        );

        network.biasHidden = network.biasHidden.map(value =>
            Math.random() < mutationRate ? value + (Math.random() * 2 - 1) * 0.1 : value
        );

        network.biasOutput = network.biasOutput.map(value =>
            Math.random() < mutationRate ? value + (Math.random() * 2 - 1) * 0.1 : value
        );
    }

    /**
     * Crée la prochaine génération de réseaux de neurones.
     * @param {Array} bestPopulation - Meilleurs réseaux de la génération actuelle.
     * @param {number} mutationRate - Taux de mutation.
     */
    createNextGeneration(bestPopulation, mutationRate) {
        const nextGeneration = [...bestPopulation];
        while (nextGeneration.length < this.populationSize) {
            const parent1 = bestPopulation[Math.floor(Math.random() * bestPopulation.length)];
            const parent2 = bestPopulation[Math.floor(Math.random() * bestPopulation.length)];
            const child = this.reproduction(parent1, parent2);
            this.mutate(child, mutationRate);
            nextGeneration.push(child);
        }
        this.population = nextGeneration.slice(0, this.populationSize);
    }

    /**
     * Retourne le meilleur score de la population évaluée.
     * @param {Array} evaluatedPopulation - Population évaluée.
     * @returns {number} - Meilleur score.
     */
    getBestScore(evaluatedPopulation) {
        return evaluatedPopulation.length > 0
            ? evaluatedPopulation.reduce((max, obj) => obj.score > max ? obj.score : max, evaluatedPopulation[0].score)
            : 0;
    }

    /**
     * Retourne la moyenne des scores de la population évaluée.
     * @param {Array} evaluatedPopulation - Population évaluée.
     * @returns {number} - Moyenne des scores.
     */
    getAverageScore(evaluatedPopulation) {
        return evaluatedPopulation.length > 0
            ? evaluatedPopulation.reduce((acc, obj) => acc + obj.score, 0) / evaluatedPopulation.length
            : 0;
    }

    /**
     * Exécute une génération de l'algorithme génétique.
     * @param {number} numBest - Nombre de meilleurs réseaux à sélectionner.
     * @param {number} mutationRate - Taux de mutation.
     * @param {Function} callback - Fonction de rappel appelée après l'exécution.
     */
    run(numBest, mutationRate, callback) {
        this.evaluatePopulation(evaluatedPopulation => {
            const bestPopulation = this.selectBest(evaluatedPopulation, numBest);
            this.createNextGeneration(bestPopulation, mutationRate);
            console.log("Moyenne des scores: " + this.getAverageScore(evaluatedPopulation), "Génération : ", this.generation);

            this.chart.addRows([[this.generation, this.getBestScore(evaluatedPopulation), this.getAverageScore(evaluatedPopulation)]]);
            this.generation++;

            callback();
        });
    }
}

export { GeneticAlgorithm };