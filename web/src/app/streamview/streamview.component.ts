import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-streamview',
  templateUrl: './streamview.component.html',
  styleUrls: ['./streamview.component.css'],

})
export class StreamviewComponent implements OnInit {
  initiated: boolean = false;
  streams: any = [];
  streamName: String;
  collections: any;
  selectedColl: null;
  config: any;
  tempStream: any;
  tempData: any;

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


  listenForNewData(value) {
    while (true) {
      var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          this.dataSet = []; //Clean dataset
          this.streamName = value;
          this.http.get('/devices/' + value + '/one').subscribe(data => {
            var streamLength = this.streams.length - 1;
            this.tempData = data;
            if (this.tempData.createdAt !== this.streams[streamLength].createdAt) {
              this.tempStream = data;
              this.streams.push(data);
              this.streamLabels.push(this.streams[streamLength].createdAt);
              this.populateData(value);
            }
          });

          resolve();
        }, 500);
      });
      return promise;
    }
  }
  getData(value) {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.dataSet = []; //Clean dataset
        this.streamName = value;
        this.http.get('/devices/' + value).subscribe(data => {
          this.streams = data;
          this.lat = Number(this.streams[0].Location.Latitude);
          this.lng = Number(this.streams[0].Location.Longitude);
        });
        this.generateLabels(value);
        this.initiated = true;
        resolve();
      }, 100);
    });
    return promise;
  }

  generateLabels(value) {
    this.streamLabels = [];
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {

        for (var i = 0; i < this.streams.length; i++) {
          this.streamLabels.push(this.streams[i].createdAt);
        }
        //this.streamLabels.sort();
        this.populateData(value);
        resolve();
      }, 100);
    });
    return promise;
  }

  populateData(value) {
    this.sensorCount = 0;
    for (var n = 0; n < this.streams[0].Sensor.length; n++) {
      //populate datasets
      let sensorData = {
        "label": this.streams[0].Sensor[n].Name,
        "borderColor": this.borderColors[n],
        "data": [],
      }
      //retrieve data from each individual datapoint in stream
      for (var m = 0; m < this.streams.length; m++) {
        sensorData.data.push(this.streams[m].Sensor[n].Value)
      }

      this.dataSet.push(sensorData);
      this.sensorCount++;
    }

    this.updateGraph(value);
  }
  setConfig() {
    this.config = {
      type: this.chartType,
      data: {
        labels: this.streamLabels,
        datasets: this.dataSet
      },
      options: {

        text: this.selectedColl,
        legend: {
             display: true,
             labels: {
               fontFamily: 'Raleway',
             }
         },
           scales: {
          yAxes: [{
            ticks: {
              fontFamily: 'Raleway',
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              fontFamily: 'Raleway',
            }
          }]
        },	// Container for pan options
        pan: {
          // Boolean to enable panning
          enabled: true,

          // Panning directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow panning in the y direction
          mode: 'xy',
          rangeMin: {
            // Format of min pan range depends on scale type
            x: null,
            y: null
          },
          rangeMax: {
            // Format of max pan range depends on scale type
            x: null,
            y: null
          }
        },

        // Container for zoom options
        zoom: {
          // Boolean to enable zooming
          enabled: true,

          // Enable drag-to-zoom behavior
          drag: true,

          // Zooming directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow zooming in the y direction
          mode: 'xy',
          rangeMin: {
            // Format of min zoom range depends on scale type
            x: null,
            y: null
          },
          rangeMax: {
            // Format of max zoom range depends on scale type
            x: null,
            y: null
          }
        },
        tooltips: {
          mode: 'point'
        }, title: {
          display: true,
          fontFamily: 'Raleway',
        },
        animation: {
          duration: 0
        }
      }
    };
  }

  updateGraph(value) {
    // https://coursetro.com/posts/code/126/Let's-build-an-Angular-5-Chart.js-App---Tutorial
    this.chart.destroy();
    this.setConfig();
    this.chart = new Chart('canvas', this.config);
    this.listenForNewData(value);
  }

  onChange(value) {
    this.getData(value);
  }

  ngOnInit() {
    //Get list of streams, for dropdown menu
    this.http.get('/devices/collection/list').subscribe(collectionList => {
      this.collections = collectionList;
      this.selectedColl = this.collections[0];
    });

    //init graph
    setTimeout(() => {
      this.getData(this.collections[0]);
    }, 500);
  }

}
