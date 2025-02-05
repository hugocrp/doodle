/**
 * Classe Graphic : Gère l'affichage des graphiques pour l'algorithme génétique.
 */
class Graphic {
    /**
     * Constructeur de Graphic.
     * @param {string} chart_id - ID de l'élément HTML pour le graphique.
     */
    constructor(chart_id) {
        this.chart_id = chart_id;
        this.data = null;
        this.chart = null;
        this.options = {
            hAxis: {
                title: 'Génération'
            },
            vAxis: {
                title: 'Score'
            },
            colors: ['#FF0000', '#0000FF']
        };

        google.charts.setOnLoadCallback(() => {
            this.data = new google.visualization.DataTable();
            this.data.addColumn('number', 'Génération');
            this.data.addColumn('number', 'Meilleur');
            this.data.addColumn('number', 'Moyenne');
            this.chart = new google.visualization.LineChart(document.getElementById(this.chart_id));
        });
    }

    /**
     * Ajoute des lignes au graphique.
     * @param {Array} rows - Lignes à ajouter.
     */
    addRows(rows) {
        if (this.data) {
            this.data.addRows(rows);
        }
    }

    /**
     * Dessine le graphique.
     */
    draw() {
        if (this.chart && this.data) {
            this.chart.draw(this.data, this.options);
        }
    }
}

export default Graphic;