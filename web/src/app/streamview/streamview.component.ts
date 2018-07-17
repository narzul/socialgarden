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
  streams: any;
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
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.dataSet = [];
        this.streamName = value;
        this.http.get('/devices/' + value).subscribe(data => {
          this.streams = data;
          this.lat = Number(this.streams[0].Location.Latitude);
          this.lng = Number(this.streams[0].Location.Longitude);
        });
        this.generateLabels();
        resolve();
      }, 100);
    });
    return promise;




  }

  generateLabels() {
      var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          this.streamLabels = [];
          for(var i =0; i< this.streams.length;i++){
            this.streamLabels.push(this.streams[i].createdAt);
          }
          this.streamLabels.sort();
          this.populateData();
          resolve();
        }, 100);
      });
      return promise;
  }

  populateData() {
    this.sensorCount = 0;
    for (var n = 0; n < this.streams[0].Sensor.length; n++) {
      //populate datasets
      let sensorData = {
        "label": this.streams[0].Sensor[n].Name,
        "borderColor": this.borderColors[n],
        "data": [],
      }
      //retrieve data from each individual datapoint in stream
      for(var m = 0; m< this.streams.length;m++){
        sensorData.data.push(this.streams[m].Sensor[n].Value)
      }

      this.dataSet.push(sensorData);
      this.sensorCount++;
    }

    this.updateGraph();
  }
  setConfig(){
    this.config = {
      type: this.chartType,
      data: {
        labels: this.streamLabels,
        datasets: this.dataSet
      },
      options: {
        text:this.selectedColl,
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
        }
      }
    };
  }

  updateGraph() {
    // https://coursetro.com/posts/code/126/Let's-build-an-Angular-5-Chart.js-App---Tutorial
    this.chart.destroy();
    this.setConfig();
    this.chart = new Chart('canvas', this.config);
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

    this.getData(this.selectedColl);
  }

}
