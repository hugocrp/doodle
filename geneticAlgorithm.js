import { NeuralNetwork } from './neuralNetwork.js';
import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';
import Graphic from './Graphic.js';

class GeneticAlgorithm {
    constructor(populationSize, inputSize, hiddenSize, outputSize) {
        this.populationSize = populationSize;
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.population = this.createInitialPopulation();
        this.generation = 1;
        this.chart = new Graphic('chart_div');
    }

    createInitialPopulation() {
        return Array.from({ length: this.populationSize }, () => 
            new NeuralNetwork(this.inputSize, this.hiddenSize, this.outputSize)
        );
    }
    
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

    selectBest(evaluatedPopulation, numBest) {
        return evaluatedPopulation
            .sort((a, b) => b.score - a.score)
            .slice(0, numBest)
            .map(individual => individual.network);
    }

    reproduction(parent1, parent2) {
        const child = new NeuralNetwork(this.inputSize, this.hiddenSize, this.outputSize);
        // mutation de la population nouvelle donc on change un peu les poids des matrices
        child.weightsInputHidden = [];
        for (let i = 0; i < parent1.weightsInputHidden.length; i++) {
            const row = [];
            for (let j = 0; j < parent1.weightsInputHidden[i].length; j++) {
            row.push((parent1.weightsInputHidden[i][j] + parent2.weightsInputHidden[i][j]) / 2);
            }
            child.weightsInputHidden.push(row);
        }

        child.weightsHiddenOutput = [];
        for (let i = 0; i < parent1.weightsHiddenOutput.length; i++) {
            const row = [];
            for (let j = 0; j < parent1.weightsHiddenOutput[i].length; j++) {
            row.push((parent1.weightsHiddenOutput[i][j] + parent2.weightsHiddenOutput[i][j]) / 2);
            }
            child.weightsHiddenOutput.push(row);
        }
        /// mutation des biais également
        child.biasHidden = parent1.biasHidden.map((value, i) => (value + parent2.biasHidden[i]) / 2);
        child.biasOutput = parent1.biasOutput.map((value, i) => (value + parent2.biasOutput[i]) / 2);
        return child;
    }

    mutate(network, mutationRate) {
        for (let i = 0; i < network.weightsInputHidden.length; i++) {
            for (let j = 0; j < network.weightsInputHidden[i].length; j++) {
                if (Math.random() < mutationRate) {
                    network.weightsInputHidden[i][j] += (Math.random() * 2 - 1) * 0.1;
                }
            }
        }

        for (let i = 0; i < network.weightsHiddenOutput.length; i++) {
            for (let j = 0; j < network.weightsHiddenOutput[i].length; j++) {
                if (Math.random() < mutationRate) {
                    network.weightsHiddenOutput[i][j] += (Math.random() * 2 - 1) * 0.1;
                }
            }
        }

        for (let i = 0; i < network.biasHidden.length; i++) {
            if (Math.random() < mutationRate) {
                network.biasHidden[i] += (Math.random() * 2 - 1) * 0.1;
            }
        }

        for (let i = 0; i < network.biasOutput.length; i++) {
            if (Math.random() < mutationRate) {
                network.biasOutput[i] += (Math.random() * 2 - 1) * 0.1;
            }
        }
    }

    createNextGeneration(bestPopulation, mutationRate) {
        const nextGeneration = [...bestPopulation];
        while (nextGeneration.length < this.populationSize) {
            const parent1 = bestPopulation[Math.floor(Math.random() * bestPopulation.length)];
            const parent2 = bestPopulation[Math.floor(Math.random() * bestPopulation.length)];
            const child = this.reproduction(parent1, parent2);
            this.mutate(child, mutationRate);
            nextGeneration.push(child);
        }
        this.population = nextGeneration.slice(0, this.populationSize); // pour ne pas dépasser la population voulu (de 100 là)
    }

    getBestScore(evaluatedPopulation) {
        return evaluatedPopulation.length > 0
            ? evaluatedPopulation.reduce((max, obj) => obj.score > max ? obj.score : max, evaluatedPopulation[0].score)
            : 0; // Fallback value if the array is empty
    }
    
    getAverageScore(evaluatedPopulation) {
        return evaluatedPopulation.length > 0
            ? evaluatedPopulation.reduce((acc, obj) => acc + obj.score, 0) / evaluatedPopulation.length
            : 0; // Fallback value if the array is empty
    }
    

    run(numBest, mutationRate, callback) {
        this.evaluatePopulation(evaluatedPopulation => {
            const bestPopulation = this.selectBest(evaluatedPopulation, numBest);
            this.createNextGeneration(bestPopulation, mutationRate);
    
            console.log("Average score: " + this.getAverageScore(evaluatedPopulation), " generation : ", this.generation);
    
            // Ensure data is passed as a 2D array
            this.chart.addRows([[this.generation, this.getBestScore(evaluatedPopulation), this.getAverageScore(evaluatedPopulation)]]);
            this.generation++;
    
            callback();
        });
    }
    

}

export { GeneticAlgorithm };