import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  zoomed: boolean = false;
  zoomCount: number = 0;
  runningService:boolean = false;
  tempStream: any;
  tempData: any;
  pipe = new DatePipe('en-EU'); // Use your own locale

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
  config: any = {
    type: this.chartType,
    data: {
      labels: this.streamLabels,
      datasets: this.dataSet
    },

    options: {

      text: this.selectedColl,
      events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"],
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
        mode: 'x',

        speed: 1
      },

      // Container for zoom options
      zoom: {
        // Boolean to enable zooming
        enabled: true,
        // Zooming directions. Remove the appropriate direction to disable
        // Eg. 'y' would only allow zooming in the y direction
        mode: 'x',
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
  }
  chart: Chart = []; // This will hold our chart meta info
  firstHeader: string = null;

  constructor(private http: HttpClient) { }

  zoomIn() {
    this.zoomCount++;
    alert("zoomIn " + this.zoomCount);
    if (this.zoomCount != 0) {
      this.zoomed = true;
    } else {
      this.zoomed = false;
    }
  }
  zoomOut() {
    this.zoomCount--;
    alert("zoomOut " + this.zoomCount);
    if (this.zoomCount === 0) {
      this.zoomed = false;
    } else {
      this.zoomed = true;
    }
    this.chart.update();

  }
  resetZoom() {
    this.zoomCount = 0;
    this.zoomed = false;
    alert("resetZoom");
    this.chart.update();
  }
  panLeft() {
    alert("panLeft");
    this.chart.update();
  }
  panRight() {
    alert("panRight");
    this.chart.update();
  }
  listenForNewData(value) {

    setTimeout(() => {
      //Get last data from device stream
      this.http.get('/devices/' + value + '/one').subscribe(data => {
        this.tempData = data;

        if (this.tempData.createdAt !== this.streams[this.streams.length-1].createdAt) {
          //console.log(this.tempData.createdAt + " - " + this.streams[this.streams.length-1].createdAt)
          //console.log('new incomming data point')
          this.tempStream = data;
          //this.streams.push(data);

          //PUSH NEW LABELS
          const myFormattedDate = this.pipe.transform(this.streams[this.streams.length-1].createdAt, 'HH:mm dd/MM/yy');
          //this.streamLabels.push(myFormattedDate);
          this.chart.data.labels.push(myFormattedDate);
          console.log('new data ' + this.tempData )

          //PUSH DATA PUSH

          for (var n = 0; n < this.tempStream.Sensor.length; n++) {
            //populate datasets
            let sensorData = {
              "label": this.tempStream.Sensor[n].Name,
              "borderColor": this.borderColors[n],
              "data": [],
            }
            //retrieve data from each individual datapoint in stream
            sensorData.data.push(this.tempStream.Sensor[n].Value)

            this.chart.data.datasets.forEach((dataset) => {
                dataset.data.push(sensorData);
            });
          }



          this.chart.update();
          this.listenForNewData(value);
        } else {
          console.log('old data ' + this.tempData )
          this.listenForNewData(value);
        }
      });
    }, 1000);
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
          this.firstHeader = this.streams[0].DeviceName;
        });
        this.generateLabels(value);
        this.initiated = true;
        resolve();
      }, 500);
    });
    return promise;
  }

  generateLabels(value) {
    this.streamLabels = [];
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {

        for (var i = 0; i < this.streams.length; i++) {
          const myFormattedDate = this.pipe.transform(this.streams[i].createdAt, 'HH:mm dd/MM/yy');
          this.streamLabels.push(myFormattedDate);

          //this.streamLabels.push(this.streams[i].createdAt);
        }
        //this.streamLabels.sort();
        this.populateData(value);
        resolve();
      }, 500);
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
    //// TODO: condence this. theres a lot of rendudancy
    this.config = {
      type: this.chartType,
      data: {
        labels: this.streamLabels,
        datasets: this.dataSet
      },
      options: {

        text: this.selectedColl,
        events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"],
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
          mode: 'x',

          speed: 1
        },

        // Container for zoom options
        zoom: {
          // Boolean to enable zooming
          enabled: true,
          // Zooming directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow zooming in the y direction
          mode: 'x',
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

    //// TODO: Alternative methods for setting config
    //Set missing config directly
    // this.config.type = this.chartType;
    // this.config.data.labels = this.streamLabels;
    // this.config.data.dataset = this.dataSet;
    // this.config.options.text = this.selectedColl;


    //Trying to directly set chart
    // this.chart.type = this.chartType;
    // this.chart.data.labels = this.streamLabels;
    // this.chart.data.dataset = this.dataSet;
    // this.chart.options.text = this.selectedColl;

  }

  updateGraph(value) {
    // https://coursetro.com/posts/code/126/Let's-build-an-Angular-5-Chart.js-App---Tutorial
    this.chart.destroy();
    this.setConfig();
    this.chart = new Chart('canvas', this.config);
    this.runningService = true;
    this.listenForNewData(value);
  }

  onChange(value) {
    this.getData(value);
    this.runningService = false;
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
  ngAfterViewInit() {
    this.chart = new Chart('canvas', this.config);
  }

}
