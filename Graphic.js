class Graphic {
    constructor(chart_id) {
        this.chart_id = chart_id;
        this.data = null;
        this.chart = null;
        this.options = {
            hAxis: {
                title: 'Generation'
            },
            vAxis: {
                title: 'Score'
            },
            colors: ['#FF0000', '#0000FF']
        };

        google.charts.setOnLoadCallback(() => {
            this.data = new google.visualization.DataTable();
            this.data.addColumn('number', 'Generation');
            this.data.addColumn('number', 'Best');
            this.data.addColumn('number', 'Average');
            this.chart = new google.visualization.LineChart(document.getElementById(this.chart_id));
        });
    }

    addRows(rows) {
        if (this.data) {
            this.data.addRows(rows);
        }
    }

    draw() {
        if (this.chart && this.data) {
            this.chart.draw(this.data, this.options);
        }
    }
}

export default Graphic;