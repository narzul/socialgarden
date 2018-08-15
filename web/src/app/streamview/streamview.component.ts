import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DatepickerOptions } from 'ng2-datepicker';
import * as frLocale from 'date-fns/locale/fr';


@Component({
  selector: 'app-streamview',
  templateUrl: './streamview.component.html',
  styleUrls: ['./streamview.component.css'],

})
export class StreamviewComponent implements OnInit {
  initiated: boolean = false;
  listenToData: boolean = false;
  streams: any = [];
  streamName: String;
  collections: any;
  selectedColl: null;


  tempStream: any;
  tempData: any;
  pipe = new DatePipe('en-EU'); // Use your own locale
  globalFunc: any;
  dataSet = []; // Holding data for drawing into graph
  streamLabels = [];
  title: string = 'My first AGM project';
  lat: number = 55;
  lng: number = 12;
  sensorCount: number = 0;
  chartType: String = 'line';
  firstDate: Date;
  lastDate: Date;

  borderColors: any = [
    'rgba(255,99,132,1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)',
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6','#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D','#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399','#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680','#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933', '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3','#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
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
            min:this.firstDate,
            max:this.lastDate,
          }
        }]
      },	// Container for pan options
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        enabled: true,
          mode: 'x',
      },
      tooltips: {
        mode: 'point'
      }, title: {
        display: true,
        fontFamily: 'Raleway',
      },
      animation: {
        duration: 100
      }
    }
  }
  chart: Chart = []; // This will hold our chart meta info
  firstHeader: string = null;
  testInterval: number = 500;

    firstSettings = {
        bigBanner: true,
        timePicker: true,
        format: 'HH:mm dd/MM/yy',
        defaultOpen: false
      }
      lastSettings = {
          bigBanner: true,
          timePicker: true,
          format: 'HH:mm dd/MM/yy',
          defaultOpen: false
        }

  constructor(private http: HttpClient) { }

  listenForNewData(value) {

    setTimeout(() => {
      //Get last data from device stream
      this.http.get('/devices/' + value + '/one').subscribe(data => {
        this.tempData = data;
        if (this.tempData.createdAt !== this.streams[this.streams.length - 1].createdAt) {
          //  this.tempStream = data;
          this.streams.push(data);

          //CHECK IF DATAPOINT HAVE DIFFERENT TIMESTAMP THEN THE PREVIEOUS ONE
          const myFormattedDate = this.pipe.transform(this.streams[this.streams.length - 1].createdAt, 'HH:mm dd/MM/yy');
          if (this.chart.data.labels[this.chart.data.labels.length] !== myFormattedDate) {
            //PUSH NEW LABELS
            this.chart.data.labels.push(myFormattedDate);
            //PUSH DATA FOR EACH SENSOR
            for (var n = 0; n < this.tempData.Sensor.length; n++) {

              this.chart.data.datasets.forEach((dataset) => {
                dataset.data.push(this.tempData.Sensor[n].Value);
              });

            }

            this.chart.update();
          }



        }
        if (!this.listenToData) {
          return;
        }
        if (this.listenToData) {
          return this.globalFunc = this.listenForNewData(value);
        }

      });
    }, 500);
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
        this.initiated = true;
        resolve();
      }, this.testInterval);
    });
    promise.then(() => {
  // successMessage is whatever we passed in the resolve(...) function above.
  // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
    this.generateLabels(value);
  });
  return promise;
  }

  generateLabels(value) {
    this.streamLabels = [];
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {

        for (var i = 0; i < this.streams.length; i++) {
          const myFormattedDate = this.pipe.transform(this.streams[i].createdAt, 'HH:mm dd/MM/yy');
          if(i==0){
             this.firstDate = new Date(myFormattedDate)
          }
          if(i==this.streams.length){
             this.lastDate = new Date(myFormattedDate)
          }
          this.streamLabels.push(myFormattedDate);

        }
        resolve();
      }, this.testInterval);
    });
    promise.then(() => {
      this.populateData(value);
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
              beginAtZero:true
            }
          }],
          xAxes: [{
            ticks: {
              fontFamily: 'Raleway',
              min:this.firstDate,
              max:this.lastDate,
            }
          }]
        },	// Container for pan options
        pan: {
          // Boolean to enable panning
          enabled: true,
          // Panning directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow panning in the y direction
          mode: 'x',
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
          duration: 100
        }
      }
    };

  }

  updateGraph(value) {
    // https://coursetro.com/posts/code/126/Let's-build-an-Angular-5-Chart.js-App---Tutorial
    this.chart.destroy();
    this.globalFunc = null;
    this.setConfig();
    this.chart = new Chart('canvas', this.config);
    this.globalFunc = this.listenForNewData(value);
    this.listenToData = true;
  }

  onChangeSelectedStream(value) {
    this.listenToData = false;
    this.selectedColl = value;
    this.getData(value);
  }
  onChangeFirstDate(firstDate){
    this.chart.config.options.scales.xAxes[0].ticks.min = this.firstDate;
    this.updateGraph(this.selectedColl);
  }
  onChangeLastDate(lastDate){
    this.chart.config.options.scales.xAxes[0].ticks.max = this.lastDate;
    this.updateGraph(this.selectedColl);
  }
  ngOnInit() {
    //Get list of streams, for dropdown menu
    this.http.get('/devices/collection/list').subscribe(collectionList => {
      this.collections = collectionList;
      this.collections.sort();
      this.selectedColl = this.collections[0];
    });

    //init graph
    setTimeout(() => {
      this.getData(this.collections[0]);
    }, this.testInterval);
  }
  ngAfterViewInit() {
    this.chart = new Chart('canvas', this.config);
  }

}
