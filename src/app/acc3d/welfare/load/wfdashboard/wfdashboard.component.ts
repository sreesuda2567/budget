import { Component, OnInit } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-wfdashboard',
  templateUrl: './wfdashboard.component.html',
  styleUrls: ['./wfdashboard.component.scss']
})
export class WfdashboardComponent implements OnInit {
  public barChartPlugins = [DataLabelsPlugin];
  chart: any;
  url1 = "/acc3d/welfare/userpermission.php";
  url = "/acc3d/welfare/load/wfdashboard.php";
  dataAdd: any = {};
  dataYear: any;
  loading: any;
  dataCam: any;
  dataFac: any;

  // Summary card data
  medicalCount: number = 0;
  medicalTotal: number = 0;
  schoolCount: number = 0;
  schoolTotal: number = 0;

  // Chart data
  chartLabels: string[] = [];
  chartMedical: number[] = [];
  chartSchool: number[] = [];

  // Table data
  datalistMedical: any;
  datalistSchool: any;

  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
  ) { }

  ngOnInit(): void {
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();
  }

  fetchdata() {
    var varP = {
      "opt": "viewp",
      "citizen": this.tokenStorage.getUser().citizen
    }
    //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        var varN = {
          "opt": "viewcam",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((datacam: any) => {
            this.dataCam = datacam;
            this.dataAdd.CAMPUS_CODE = datacam[0].CAMPUS_CODE;
            this.fetchdataCam();
            var varY = {
              "opt": "viewyear"
            }
            this.apiService
              .getdata(varY, this.url1)
              .pipe(first())
              .subscribe((data: any) => {
                if (data && data.length > 0) {
                  this.dataYear = data;
                  this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
                  this.fetchdashboard();
                }
              });
          });

      });
  }
  fetchdataCam() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfac";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = '';
      });
  }
  fetchdashboard() {
    this.loading = true;
    // Destroy existing chart
    let chartStatus = Chart.getChart("wfBarChart");
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    this.dataAdd.opt = "readAll";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          // Summary cards
          this.medicalCount = 0;
          this.medicalTotal = 0;
          this.schoolCount = 0;
          this.schoolTotal = 0;


          // Chart data
          // this.chartLabels = data.chartLabels || [];
          //  this.chartMedical = data.datam ;
          // this.chartSchool = data.datas ;
          this.datalistMedical = data.datamd;
          this.datalistSchool = data.datasd;
          for (let i = 0; i < data.datam.length; i++) {
            this.medicalCount += Number(data.datam[i].num);
            this.medicalTotal += Number(data.datam[i].moneym);
          }
          for (let i = 0; i < data.datas.length; i++) {
            this.schoolCount += Number(data.datas[i].num);
            this.schoolTotal += Number(data.datas[i].moneys);
          }
          this.chartLabels = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
          this.chartMedical = [data.datam[0].moneym, data.datam[1].moneym, data.datam[2].moneym, data.datam[3].moneym, data.datam[4].moneym, data.datam[5].moneym, data.datam[6].moneym, data.datam[7].moneym, data.datam[8].moneym, data.datam[9].moneym, data.datam[10].moneym, data.datam[11].moneym];
          this.chartSchool = [data.datas[0].moneys, data.datas[1].moneys, data.datas[2].moneys, data.datas[3].moneys, data.datas[4].moneys, data.datas[5].moneys, data.datas[6].moneys, data.datas[7].moneys, data.datas[8].moneys, data.datas[9].moneys, data.datas[10].moneys, data.datas[11].moneys];
          //console.log(this.schoolCount);
          //console.log(this.schoolTotal);
          // Table data
          // this.datalistMedical = data.dataMedical || [];
          // this.datalistSchool = data.dataSchool || [];

          this.createBarChart();
        } else {
          // ใช้ mock data เมื่อยังไม่มี API
         // this.loadMockData();
        }
        this.loading = null;
      }, (error) => {
        // ใช้ mock data เมื่อ API ยังไม่พร้อม
       // this.loadMockData();
        this.loading = null;
      });
  }

 /* loadMockData() {
    this.medicalCount = 156;
    this.medicalTotal = 2845670.50;
    this.schoolCount = 89;
    this.schoolTotal = 1523480.00;

    this.chartLabels = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
    this.chartMedical = [245000, 312000, 198000, 287000, 356000, 425000, 189000, 267000, 312000, 0, 0, 0];
    this.chartSchool = [125000, 198000, 145000, 167000, 213000, 189000, 112000, 156000, 178000, 0, 0, 0];

    this.datalistMedical = [
      { FACULTY_TNAME: 'คณะวิศวกรรมศาสตร์', STF_FNAME: 'นายสมชาย ใจดี', FEREIMDT_WMONEY: 15000, FEDUCATION_RDATE: '10/02/2569' },
      { FACULTY_TNAME: 'คณะบริหารธุรกิจ', STF_FNAME: 'นางสาวสุดา รักเรียน', FEREIMDT_WMONEY: 8500, FEDUCATION_RDATE: '08/02/2569' },
      { FACULTY_TNAME: 'คณะศิลปศาสตร์', STF_FNAME: 'นายวิชัย สมบูรณ์', FEREIMDT_WMONEY: 22000, FEDUCATION_RDATE: '05/02/2569' },
      { FACULTY_TNAME: 'คณะครุศาสตร์อุตสาหกรรม', STF_FNAME: 'นางมาลี ดอกไม้', FEREIMDT_WMONEY: 12000, FEDUCATION_RDATE: '01/02/2569' },
      { FACULTY_TNAME: 'คณะวิทยาศาสตร์', STF_FNAME: 'นายประเสริฐ แก้วใส', FEREIMDT_WMONEY: 9500, FEDUCATION_RDATE: '28/01/2569' },
    ];

    this.datalistSchool = [
      { FACULTY_TNAME: 'คณะวิศวกรรมศาสตร์', STF_FNAME: 'นายสุรชัย มั่นคง', FEREIMDT_WMONEY: 25000, FEDUCATION_RDATE: '09/02/2569' },
      { FACULTY_TNAME: 'คณะบริหารธุรกิจ', STF_FNAME: 'นางสาวพิมพ์ใจ สวยงาม', FEREIMDT_WMONEY: 18000, FEDUCATION_RDATE: '07/02/2569' },
      { FACULTY_TNAME: 'คณะศิลปศาสตร์', STF_FNAME: 'นายอนันต์ กล้าหาญ', FEREIMDT_WMONEY: 30000, FEDUCATION_RDATE: '04/02/2569' },
      { FACULTY_TNAME: 'คณะเกษตรศาสตร์', STF_FNAME: 'นางจันทร์ สดใส', FEREIMDT_WMONEY: 22000, FEDUCATION_RDATE: '31/01/2569' },
      { FACULTY_TNAME: 'คณะครุศาสตร์อุตสาหกรรม', STF_FNAME: 'นายธีรชัย เก่งมาก', FEREIMDT_WMONEY: 15000, FEDUCATION_RDATE: '25/01/2569' },
    ];

    this.createBarChart();
  }*/

  createBarChart() {
    const myChart = new Chart('wfBarChart', {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'การรักษาพยาบาล',
            data: this.chartMedical,
            backgroundColor: 'rgba(220, 53, 69, 0.75)',
            borderColor: 'rgba(220, 53, 69, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'การศึกษาของบุตร',
            data: this.chartSchool,
            backgroundColor: 'rgba(13, 110, 253, 0.75)',
            borderColor: 'rgba(13, 110, 253, 1)',
            borderWidth: 1,
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: '#444',
            anchor: 'end',
            align: 'end',
            font: {
              size: 10,
            },
            formatter: function (value) {
              if (value === 0) return '';
              return new Intl.NumberFormat().format(value);
            }
          },
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 13
              },
              usePointStyle: true,
              pointStyle: 'rectRounded'
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return new Intl.NumberFormat().format(Number(value));
              }
            }
          }
        }
      }
    });
  }

  numberWithCommas(x: any) {
    if (x == null) return '0';
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
}
