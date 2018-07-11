import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-streamview',
  templateUrl: './streamview.component.html',
  styleUrls: ['./streamview.component.css'],

})
export class StreamviewComponent implements OnInit {
  initiated:boolean = false;
  devices: any;
  streamName: String;
  collections: any;
  selectedColl: null;
  config: any;

  chart: Chart = new Chart('canvas', this.config); // This will hold our chart meta info
  dataSet = []; // Holding data for drawing into graph
  streamLabels = [];
  title: string = 'My first AGM project';
  lat: number = 55;
  lng: number = 12;
  sensorCount: number = 0;
  chartType: String = 'line';
  borderColors: any = [
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  constructor(private http: HttpClient) { }



  getData(value) {
    this.dataSet = [];
    this.streamName = value;
    this.http.get('/devices/' + value).subscribe(data => {
      this.devices = data;
      this.lat = Number(this.devices[0].Location.Latitude);
      this.lng = Number(this.devices[0].Location.Longitude);
    });
    this.generateLabels();
  }

  generateLabels() {
    this.streamLabels = [];
    for (let dev of this.devices) {
      this.streamLabels.push(dev.createdAt);
    }
    this.streamLabels.sort();
    this.populateData();
  }

  populateData() {
    this.sensorCount = 0;
    for (var n = 1; n <= this.devices[0].Sensor.length; n++) {
      //populate datasets
      let sensorData = {
        "label": "",
        "borderColor": this.borderColors,
        "data": [],
      }
      //retrieve data from each individual datapoint in stream
      for (let stream of this.devices) {
        //retrieve individual sensors from each datapoint in stream

        for (let sens of stream.Sensor) {
          sensorData.label = sens.Name + " " + n;
          //sensorData.label = this.devices[0].Sensor[n].Name
          sensorData.data.push(sens.Value)

        }
      }
      this.dataSet.push(sensorData);
      this.sensorCount++;
    }
    this.updateGraph();
  }

  updateGraph() {
    // https://coursetro.com/posts/code/126/Let's-build-an-Angular-5-Chart.js-App---Tutorial
    this.chart.destroy();

    this.config.type = this.chartType;
    this.config.data.labels = this.streamLabels;
    this.config.data.datasets = this.dataSet;
    this.config.options.text = this.selectedColl

    this.chart = new Chart('canvas', this.config);
    this.chart.update();
  }
  onChange(value) {
    this.getData(value);
  }

  ngOnInit() {
    this.http.get('/devices/collection/list').subscribe(col => {
      this.collections = col;
      this.selectedColl = this.collections[0];
    });

    this.config = {
      type: this.chartType,
      data: {
      //  labels: this.streamLabels,
      //  datasets: this.dataSet
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          mode: 'point'
        }, title: {
          display: true,
        //  text: this.selectedColl
        }
      }
    };

    this.getData('mystream3');
  }

}
