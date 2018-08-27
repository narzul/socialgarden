import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

// TODO: The strengh of Angular comes, in part from its strong use of components. This component could be split into smaller once, which would be benificial in regards to readablity.
@Component({
  selector: 'app-streamview',
  templateUrl: './streamview.component.html',
  styleUrls: ['./streamview.component.css'],

})
export class StreamviewComponent implements OnInit {
  //Current state data
  chartConfig: any;
  typeUnit: String;
  listenerWrapperFunction: any;
  tempData: any;
  lat: number = 55;
  lng: number = 12;
  IsCoordsSetManually: boolean;
  sensorCount: number = 0;
  initiated: boolean = false;
  listenToData: boolean = false;
  streams: any = [];
  streamName: String;
  collections: any;
  selectedColl: null;
  streamHeaderTxt: string = null;
  testInterval: number = 500;

  //Chart settigns
  chartType: String = 'line';
  chart: Chart = []; // This will hold our chart meta info
  dataSet = []; // Holding data for drawing into graph
  streamLabels = [];
  borderColors: any = [
    'rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D', '#80B300', '#809900', '#E6B3B3', '#6680B3',
    '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC', '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF',
    '#4DB3FF', '#1AB399', '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933', '#FF3380', '#CCCC00',
    '#66E64D', '#4D80CC', '#9900B3', '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
  ];

  //Datepicker settings
  pipe = new DatePipe('en-UK'); //DatePipe for setting date format
  firstDate: Date;
  lastDate: Date;
  timeDiff: number = 3600001; //default timediff set to days
  datepickerSettings = { //Settings for datepickers
    bigBanner: true,
    timePicker: true,
    format: 'H:m d/M/yyyy',
    defaultOpen: false,
  }

  //Paggination settings
  pagginationPageCount: number;
  pagginationManager = {
    results: [],
    page: 1,
    offset: 10,
    Math: Math
  };
  constructor(private http: HttpClient) { }



  // Populate graph sequence step 1
  getData(value) {
    //Using promises for flowcontrol
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.dataSet = []; //Clean dataset
        this.streamName = value;

        this.http.get('/devices/' + value).subscribe(data => {
          this.streams = data;
          this.pagginationManager.results = this.streams;
          this.pagginationPageCount = Math.ceil(this.pagginationManager.results.length / this.pagginationManager.offset);
          this.lat = Number(this.streams[0].Location.Latitude);
          this.lng = Number(this.streams[0].Location.Longitude);
          this.streamHeaderTxt = this.streams[0].DeviceName;
          if (this.streams[0].Location.ManuallyCoords != null) {
            this.IsCoordsSetManually = this.streams[0].Location.ManuallyCoords;
          }
        });
        this.initiated = true;
        resolve();
      }, this.testInterval);
    });
    promise.then(() => {
      //When promise succeed, initiat Populate graph sequence step 2
      this.generateLabels(value);
    });
    return promise;
  }

  // Populate graph sequence step 2
  generateLabels(value) {
    this.streamLabels = [];
    //Using promises for flowcontrol
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {

        for (var i = 0; i < this.streams.length; i++) {
          try {
            //const myFormattedDate = this.pipe.transform(this.streams[i].createdAt, 'H:m d/M/yyyy');
            const myFormattedDate = this.streams[i].createdAt;
            if (i == 0) {
              this.firstDate = new Date(myFormattedDate)
            } else if (i == this.streams.length - 1) {
              this.lastDate = new Date(myFormattedDate)
            }

            this.streamLabels.push(myFormattedDate);
          }
          catch (e) {
            console.log('Formatting Date Error:', e);
          }

        }

        //Initate sequence step 3
        this.calculateDiffBetweenTwoTimeStamps();

        resolve();
      }, this.testInterval);
    });
    promise.then(() => {
      //When promise succeed, initiat Populate graph sequence step 3
      this.populateData(value);
    });
    return promise;
  }

  // Populate graph sequence step 3
  calculateDiffBetweenTwoTimeStamps() {
    //the idea is to caculate the time difference between the first and the last date. This is necessary in order to figure out which timeUnit we will you for the chart
    const start = new Date(this.firstDate).getTime();
    const end = new Date(this.lastDate).getTime();
    this.timeDiff = end - start;
    //SELECT unitType based on timediff between first and last date
    // 604800000 = week
    // 86400000 = day
    // 3600000 = hours
    if (this.timeDiff > 604800000) { // larger then a week
      this.typeUnit = 'week';
    }
    //less then a week but more then a day
    if (this.timeDiff < 604800000 && this.timeDiff > 86400000) {
      this.typeUnit = 'day';
    }
    // less then a day but more then a hour
    if (this.timeDiff < 86400000 && this.timeDiff > 3600000) {
      this.typeUnit = 'hour';
    }
    // less then a hour but more then a min
    if (this.timeDiff < 3600000 && this.timeDiff > 60000) {
      this.typeUnit = 'minute';
    }
    // less then a min but more then a sec
    if (this.timeDiff < 60000 && this.timeDiff > 1000) {
      this.typeUnit = 'second';
    }
    if (this.timeDiff < 1000) {
      this.typeUnit = 'millisecond';
    }
  }

  //Populate graph sequence step 4
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
    //Initiate Populate graph sequence step 4
    this.updateGraph(value);
  }

  //Populate graph sequence step 5
  updateGraph(value) {
    // https://coursetro.com/posts/code/126/Let's-build-an-Angular-5-Chart.js-App---Tutorial
    this.chart.destroy();
    this.listenerWrapperFunction = null;
    // Initiate Populate graph sequence step 6
    this.setConfig();
    this.chart = new Chart('canvas', this.chartConfig);
    // Initiate Populate graph sequence step
    this.listenerWrapperFunction = this.listenForNewData(value);
    this.listenToData = true;
  }

  //Populate graph sequence step 6
  setConfig() {

    this.chartConfig = {
      type: this.chartType,
      data: {
        labels: this.streamLabels,
        datasets: this.dataSet
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Unit: ' + this.typeUnit,
          fontFamily: 'Raleway',
        },
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
            type: 'time',
            display: true,
            scaleLabel: {
              //  display: true,
              labelString: 'Date'
            },

            time: {
              unit: this.typeUnit,
              min: new Date(this.firstDate).getTime(),
              max: new Date(this.lastDate).getTime(),
              distribution: 'series',
              displayFormats: {
                day: 'hh:mm DD/MM/YY',
              }

            },
            ticks: {
              fontFamily: 'Raleway',
            },
            scale: {
              bounds: 'data'
            }
          }]
        },	// Container for pan options
        tooltips: {
          mode: 'nearest',
          intersect: true,
        },

        animation: {
          duration: 100
        }
      }
    };

  }
  //Populate graph sequence step 7 - Listen to new incomming data
  //TODO something is wrong with the ListenForNewData function. The data is updating incorrectly on the website
  listenForNewData(value) {
    // TODO:  This listener, can be re-written to a service.  In order to do this, the variables which it interact with should be stored in the root scope. i.e. app.component.ts for easier message parsing. This method should thus be stored in stream.service.ts
    // TODO: This would also make the application run in parrallel, since each javascript component is parrallized as default.

    setTimeout(() => { //Listen for new data every 500 ms,
      //Get last data from device stream
      this.http.get('/devices/' + value + '/one').subscribe(data => {
        this.tempData = data;
        if (this.tempData.createdAt !== this.streams[this.streams.length - 1].createdAt) {
          this.streams.push(data);

          //CHECK IF DATAPOINT HAVE DIFFERENT TIMESTAMP THEN THE PREVIEOUS ONE
          //const myFormattedDate = this.pipe.transform(this.streams[this.streams.length - 1].createdAt, 'H:m d/M/yyyy');
          const myFormattedDate = this.streams[this.streams.length - 1].createdAt;
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
        } else if (this.listenToData) {
          //If listenToData boolean is true, then recursively call the function
          return this.listenerWrapperFunction = this.listenForNewData(value);
        }

      });
    }, 500);
  }

  //On change listeners - used for keeping on DOM in streamview.component.html
  onChangeSelectedStream(value) {
    this.listenToData = false; //Stop listener while getting new dataStream
    this.selectedColl = value;
    this.getData(value);
  }
  onChangeFirstDate(firstDate) {
    this.listenToData = false; //Stop listener while getting new dataStream
    //Initate sequence step 3
    this.calculateDiffBetweenTwoTimeStamps();
    this.updateGraph(this.selectedColl);
  }
  onChangeLastDate(lastDate) {
    this.listenToData = false; //Stop listener while getting new dataStream
    //Initate sequence step 3
    this.calculateDiffBetweenTwoTimeStamps();
    this.updateGraph(this.selectedColl);
  }

  //Lifecycle methods
  ngOnInit() {
    //Get list of streams, for dropdown menu, on component initiation
    this.http.get('/devices/collection/list').subscribe(collectionList => {
      this.collections = collectionList;
      this.collections.sort();
      this.selectedColl = this.collections[0];
    });
    //init graph
    setTimeout(() => { // TODO: perhaps a if statement which checks if things has loaded is better
      this.getData(this.collections[0]);
    }, 500);
  }
  ngAfterViewInit() {
    this.chart = new Chart('canvas', this.chartConfig);
  }
}
