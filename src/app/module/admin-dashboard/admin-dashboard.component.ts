import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlListService } from '../services/url-list.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss', '../../app.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  displayName = 'Administer';
  userinfo: any;
  dashboardData = {
    totalUser: 0,
    totalMale: 0,
    totalFemale: 0,
    totalAssess: 0,
    totalPass: 0,
    totalFail: 0,
    totalDistrict: 0,
    totalDept: 0,
    totalRole: 0,
    totalNotTakenExam: 0
  };
  assessmentData = [];
  genderData = []
  districtListCheck = [
    {name:'West Tripura - West-Tripura (01)',code:'01', username: 'eoWest-Tripura01'},
    {name:'Sepahijala - Sepahijala (02)',code:'02', username: 'eoSepahijala02'},
    {name:'Gomati - Gomati (03)',code:'03', username: 'eoGomati03'},
    {name:'South Tripura - South-Tripura (04)',code:'04', username: 'eoSouth-Tripura04'},
    {name:'Khowai - Khowai (05)',code:'05', username: 'eoKhowai05'},
    {name:'North Tripura - North-Tripura (06)',code:'06', username: 'eoNorth-Tripura06'},
    {name:'Dhalai - Dhalai (07)',code:'07', username: 'eoDhalai07'},
    {name:'Unakoti - Unakoti (08)',code:'08', username: 'eoUnakoti08'},
  ];

  districtList = [
    {"display":"All","name":"All","code":"678", "userdisplay":"","pre":""},
    {"display":"West Tripura","name":"West Tripura (01)","code":"01", "userdisplay":"","pre":"eoWest-Tripura01"},
    {"display":"Sepahijala","name":"Sepahijala (02)","code":"02", "userdisplay":"","pre":"eoSepahijala02"},
    {"display":"Gomati","name":"Gomati (03)","code":"03", "userdisplay":"","pre":"eoGomati03"},
    {"display":"South Tripura","name":"South Tripura (04)","code":"04", "userdisplay":"","pre":"eoSouth-Tripura04"},
    {"display":"Khowai","name":"Khowai (05)","code":"05", "userdisplay":"","pre":"eoKhowai05"},
    {"display":"North Tripura","name":"North Tripura (06)","code":"06", "userdisplay":"","pre":"eoNorth-Tripura06"},
    {"display":"Dhalai","name":"Dhalai (07)","code":"07", "userdisplay":"","pre":"eoDhalai07"},
    {"display":"Unakoti","name":"Unakoti (08)","code":"08", "userdisplay":"","pre":"eoUnakoti08"}
  ];
  district = 'All';


  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Total Assessed', 'Total Assessed Satisfactorily', 'Total Needing Improvement'];
  pieChartData = [0,0,0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  
  // bar 
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels = [
    'West Tripura - West-Tripura (01)',
    'Sepahijala - Sepahijala (02)',
    'Gomati - Gomati (03)',
    'South Tripura - South-Tripura (04)',
    'Khowai - Khowai (05)',
    'North Tripura - North-Tripura (06)',
    'Dhalai - Dhalai (07)',
    'Unakoti - Unakoti (08)'
  ];
  
  // public barChartData: ChartDataSets[] = [
  //   { data: [300, 250, 80], label: 'Total Registered Users' },
  //   { data: [300, 400, 40], label: 'Total Male' },
  //   { data: [300, 400, 40], label: 'Total Female' },
  //   { data: [300, 400, 40], label: 'Total Assessed' },
  //   { data: [300, 400, 40], label: 'Total Assessed Satisfactorily' },
  //   { data: [300, 400, 40], label: 'Total Needing Improvement' }
  // ];

  barChartData = [];

  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions = {
    responsive: true,
  };
  public lineChartColors = [
    {
      borderColor: 'black',
  //    backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  // Chart end

  eoData: any;

  constructor(private router: Router, private http: HttpClient, private urlListService: UrlListService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  ngOnInit() {
    this.userinfo = JSON.parse(localStorage.getItem('aeci-userifo'));
    if(this.userinfo.name) {
      this.displayName = this.userinfo.name;
    }
    if(this.userinfo.job_role === 'ADMIN') {
      this.getChartData();
      this.getDashboardData('All');
    } else {
      for(var i=0; i<this.districtList.length; i++) {
        if(this.districtList[i].pre === this.userinfo.username) {
          this.eoData = this.districtList[i];
        }
      }
      if(this.eoData === undefined) {
        localStorage.clear();
        this.router.navigate(['']);
      }
      this.displayName = this.eoData.name;
      this.district = this.eoData.display;
      this.getDashboardData(this.eoData.display);
    }
  }

  getDashboardData(item) {
    let response: any;
    this.http.get(this.urlListService.urls.getDashboard + '/' + item)
      .subscribe(event => {
        response = event;
        response.totalMale = response.totalUser - response.totalFemale;
        response.totalFail = response.totalAssess - response.totalPass;
        this.dashboardData = response;
        this.pieChartData = [this.dashboardData.totalAssess, this.dashboardData.totalPass, this.dashboardData.totalFail];
      },
      errorMessage => {
      }
    );
  }

  getChartData() {
    let response: any;
    this.http.post(this.urlListService.urls.getDashboard + '/All', {})
      .subscribe(event => {
        response = event;
        var totalUser = response.userQuery.sort((a, b) => (a.working_district > b.working_district) ? 1 : -1)
        var totalMale = response.maleQuery.sort((a, b) => (a.working_district > b.working_district) ? 1 : -1)
        var totalFemale = response.femaleQuery.sort((a, b) => (a.working_district > b.working_district) ? 1 : -1)
        var totalAssess = response.assessQuery.sort((a, b) => (a.working_district > b.working_district) ? 1 : -1)
        var totalPass = response.totalPass.sort((a, b) => (a.working_district > b.working_district) ? 1 : -1)
        var totalFail = response.totalFail.sort((a, b) => (a.working_district > b.working_district) ? 1 : -1)
        
        var tempFail = [
          (totalFail.find(o => o.working_district === 'West Tripura')) ? (totalFail.find(o => o.working_district === 'West Tripura')).totalFail : 0,
          (totalFail.find(o => o.working_district === 'Sepahijala')) ? (totalFail.find(o => o.working_district === 'Sepahijala')).totalFail : 0,
          (totalFail.find(o => o.working_district === 'Gomati')) ? (totalFail.find(o => o.working_district === 'Gomati')).totalFail : 0,
          (totalFail.find(o => o.working_district === 'South Tripura')) ? (totalFail.find(o => o.working_district === 'South Tripura')).totalFail : 0,
          (totalFail.find(o => o.working_district === 'Khowai')) ? (totalFail.find(o => o.working_district === 'Khowai')).totalFail : 0,
          (totalFail.find(o => o.working_district === 'North Tripura')) ? (totalFail.find(o => o.working_district === 'North Tripura')).totalFail : 0,
          (totalFail.find(o => o.working_district === 'Dhalai')) ? (totalFail.find(o => o.working_district === 'Dhalai')).totalFail : 0,
          (totalFail.find(o => o.working_district === 'Unakoti')) ? (totalFail.find(o => o.working_district === 'Unakoti')).totalFail : 0          
        ];

        this.barChartData = [
          { backgroundColor: 'cornflowerblue', data: [ totalAssess[31].totalAssess, totalAssess[22].totalAssess, totalAssess[7].totalAssess, totalAssess[17].totalAssess, totalAssess[29].totalAssess, totalAssess[30].totalAssess, totalAssess[49].totalAssess, totalAssess[44].totalAssess, totalAssess[15].totalAssess, totalAssess[14].totalAssess, totalAssess[32].totalAssess, totalAssess[33].totalAssess, totalAssess[10].totalAssess, totalAssess[9].totalAssess, totalAssess[5].totalAssess, totalAssess[6].totalAssess, totalAssess[18].totalAssess, totalAssess[2].totalAssess, totalAssess[1].totalAssess, totalAssess[26].totalAssess, totalAssess[28].totalAssess, totalAssess[27].totalAssess, totalAssess[40].totalAssess, totalAssess[0].totalAssess, totalAssess[48].totalAssess, totalAssess[11].totalAssess, totalAssess[43].totalAssess, totalAssess[3].totalAssess, totalAssess[4].totalAssess, totalAssess[37].totalAssess, totalAssess[39].totalAssess, totalAssess[38].totalAssess, totalAssess[23].totalAssess, totalAssess[19].totalAssess, totalAssess[20].totalAssess, totalAssess[21].totalAssess, totalAssess[24].totalAssess, totalAssess[25].totalAssess, totalAssess[36].totalAssess, totalAssess[42].totalAssess, totalAssess[41].totalAssess, totalAssess[8].totalAssess, totalAssess[35].totalAssess, totalAssess[34].totalAssess, totalAssess[12].totalAssess, totalAssess[13].totalAssess, totalAssess[16].totalAssess, totalAssess[47].totalAssess, totalAssess[45].totalAssess, totalAssess[46].totalAssess ], label: 'Total Assessed' },
          { backgroundColor: 'forestgreen', data: [ totalPass[31].totalPass, totalPass[22].totalPass, totalPass[7].totalPass, totalPass[17].totalPass, totalPass[29].totalPass, totalPass[30].totalPass, totalPass[49].totalPass, totalPass[44].totalPass, totalPass[15].totalPass, totalPass[14].totalPass, totalPass[32].totalPass, totalPass[33].totalPass, totalPass[10].totalPass, totalPass[9].totalPass, totalPass[5].totalPass, totalPass[6].totalPass, totalPass[18].totalPass, totalPass[2].totalPass, totalPass[1].totalPass, totalPass[26].totalPass, totalPass[28].totalPass, totalPass[27].totalPass, totalPass[40].totalPass, totalPass[0].totalPass, totalPass[48].totalPass, totalPass[11].totalPass, totalPass[43].totalPass, totalPass[3].totalPass, totalPass[4].totalPass, totalPass[37].totalPass, totalPass[39].totalPass, totalPass[38].totalPass, totalPass[23].totalPass, totalPass[19].totalPass, totalPass[20].totalPass, totalPass[21].totalPass, totalPass[24].totalPass, totalPass[25].totalPass, totalPass[36].totalPass, totalPass[42].totalPass, totalPass[41].totalPass, totalPass[8].totalPass, totalPass[35].totalPass, totalPass[34].totalPass, totalPass[12].totalPass, totalPass[13].totalPass, totalPass[16].totalPass, totalPass[47].totalPass, totalPass[45].totalPass, totalPass[46].totalPass ], label: 'Total Assessed Satisfactorily' },
          { backgroundColor: 'chocolate', data: tempFail, label: 'Total Needing Improvement' },
          //{ backgroundColor: 'darkslategray', hidden: true, data: [ totalUser[31].totalUser, totalUser[22].totalUser, totalUser[7].totalUser, totalUser[17].totalUser, totalUser[29].totalUser, totalUser[30].totalUser, totalUser[49].totalUser, totalUser[44].totalUser, totalUser[15].totalUser, totalUser[14].totalUser, totalUser[32].totalUser, totalUser[33].totalUser, totalUser[10].totalUser, totalUser[9].totalUser, totalUser[5].totalUser, totalUser[6].totalUser, totalUser[18].totalUser, totalUser[2].totalUser, totalUser[1].totalUser, totalUser[26].totalUser, totalUser[28].totalUser, totalUser[27].totalUser, totalUser[40].totalUser, totalUser[0].totalUser, totalUser[48].totalUser, totalUser[11].totalUser, totalUser[43].totalUser, totalUser[3].totalUser, totalUser[4].totalUser, totalUser[37].totalUser, totalUser[39].totalUser, totalUser[38].totalUser, totalUser[23].totalUser, totalUser[19].totalUser, totalUser[20].totalUser, totalUser[21].totalUser, totalUser[24].totalUser, totalUser[25].totalUser, totalUser[36].totalUser, totalUser[42].totalUser, totalUser[41].totalUser, totalUser[8].totalUser, totalUser[35].totalUser, totalUser[34].totalUser, totalUser[12].totalUser, totalUser[13].totalUser, totalUser[16].totalUser, totalUser[47].totalUser, totalUser[45].totalUser, totalUser[46].totalUser ], label: 'Total Registered Users' },
          //{ backgroundColor: 'turquoise', hidden: true, data: [ totalMale[31].totalMale, totalMale[22].totalMale, totalMale[7].totalMale, totalMale[17].totalMale, totalMale[29].totalMale, totalMale[30].totalMale, totalMale[49].totalMale, totalMale[44].totalMale, totalMale[15].totalMale, totalMale[14].totalMale, totalMale[32].totalMale, totalMale[33].totalMale, totalMale[10].totalMale, totalMale[9].totalMale, totalMale[5].totalMale, totalMale[6].totalMale, totalMale[18].totalMale, totalMale[2].totalMale, totalMale[1].totalMale, totalMale[26].totalMale, totalMale[28].totalMale, totalMale[27].totalMale, totalMale[40].totalMale, totalMale[0].totalMale, totalMale[48].totalMale, totalMale[11].totalMale, totalMale[43].totalMale, totalMale[3].totalMale, totalMale[4].totalMale, totalMale[37].totalMale, totalMale[39].totalMale, totalMale[38].totalMale, totalMale[23].totalMale, totalMale[19].totalMale, totalMale[20].totalMale, totalMale[21].totalMale, totalMale[24].totalMale, totalMale[25].totalMale, totalMale[36].totalMale, totalMale[42].totalMale, totalMale[41].totalMale, totalMale[8].totalMale, totalMale[35].totalMale, totalMale[34].totalMale, totalMale[12].totalMale, totalMale[13].totalMale, totalMale[16].totalMale, totalMale[47].totalMale, totalMale[45].totalMale, totalMale[46].totalMale ], label: 'Total Male' },
          //{ hidden: true, data: [ totalFemale[31].totalFemale, totalFemale[22].totalFemale, totalFemale[7].totalFemale, totalFemale[17].totalFemale, totalFemale[29].totalFemale, totalFemale[30].totalFemale, totalFemale[49] ? totalFemale[49].totalFemale : 0, totalFemale[44] ? totalFemale[44].totalFemale : 0, totalFemale[15].totalFemale, totalFemale[14].totalFemale, totalFemale[32].totalFemale, totalFemale[33].totalFemale, totalFemale[10].totalFemale, totalFemale[9].totalFemale, totalFemale[5].totalFemale, totalFemale[6].totalFemale, totalFemale[18].totalFemale, totalFemale[2].totalFemale, totalFemale[1].totalFemale, totalFemale[26].totalFemale, totalFemale[28].totalFemale, totalFemale[27].totalFemale, totalFemale[40] ? totalFemale[40].totalFemale : 0, totalFemale[0].totalFemale, totalFemale[48] ? totalFemale[48].totalFemale : 0, totalFemale[11].totalFemale, totalFemale[43] ? totalFemale[43].totalFemale : 0, totalFemale[3].totalFemale, totalFemale[4].totalFemale, totalFemale[37] ? totalFemale[37].totalFemale : 0, totalFemale[39] ? totalFemale[39].totalFemale : 0, totalFemale[38] ? totalFemale[38].totalFemale : 0, totalFemale[23].totalFemale, totalFemale[19].totalFemale, totalFemale[20].totalFemale, totalFemale[21].totalFemale, totalFemale[24].totalFemale, totalFemale[25].totalFemale, totalFemale[36].totalFemale, totalFemale[42] ? totalFemale[42].totalFemale : 0, totalFemale[41] ? totalFemale[41].totalFemale : 0, totalFemale[8].totalFemale, totalFemale[35].totalFemale, totalFemale[34].totalFemale, totalFemale[12].totalFemale, totalFemale[13].totalFemale, totalFemale[16].totalFemale, totalFemale[47] ? totalFemale[47].totalFemale : 0, totalFemale[45] ? totalFemale[45].totalFemale : 0, totalFemale[46] ? totalFemale[46].totalFemale : 0 ], label: 'Total Female' }          
        ];
      },
      errorMessage => {
      }
    );
  }

  goto(item) {
    if(item === 'facebook') {
      window.open("https://m.facebook.com/people/Chief-Electoral-Officer-Tripura/100067971144825/");
    }
    if(item === 'twitter') {
      window.open("https://twitter.com/ceotripura?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor");
    }
    if(item === 'youtube') {
      window.open("");
    }
    if(item === 'instagram') {
      window.open("https://www.instagram.com/ceo_tripura/");
    }
  }
  
  routeGoTo(item) {
    if(item === 'home') {
      if(this.userinfo.job_role === 'ADMINEO') {
        this.router.navigate(['/eo/' + Math.floor((Math.random() * 1000) + 5) + '/jt56eqw7']);
      } else {
        this.router.navigate(['/administer-access']);
      }
    }
    if(item === 'user') {
      this.router.navigate(['/administer-user']);
    }
    if(item === 'question') {
      this.router.navigate(['/administer-question']);
    }
    if(item === 'report') {
      this.router.navigate(['/administer-report']);
    }
    if(item === 'logout') {
      this.router.navigate(['']);
    }    
    if(item === 'updatepassword') {
      this.router.navigate(['/updatepassword']);
    }
  }
}
