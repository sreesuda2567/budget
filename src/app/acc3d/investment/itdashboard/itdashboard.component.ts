import { Component, OnInit } from '@angular/core';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { first } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-itdashboard',
  templateUrl: './itdashboard.component.html',
  styleUrls: ['./itdashboard.component.scss']
})
export class ItdashboardComponent implements OnInit {
  public barChartPlugins = [DataLabelsPlugin];
  chart: any;
  url1 = "/acc3d/investment/userpermission.php";
  url = "/acc3d/investment/dashboard/itdashboard.php";
  dataAdd: any = {};
  dataYear: any;
  dataCam: any;
  dataFac: any;
  loading: any;

  // Summary card data
  assetCount: number = 0;
  assetTotal: number = 0;
  assetpCount: number = 0;
  assetpTotal: number = 0;
  buildingCount: number = 0;
  buildingTotal: number = 0;
  projectCount: number = 0;
  projectTotal: number = 0;

  // Chart data
  chartLabels: string[] = [];
  chartAssetData: number[] = [];
  chartBuildingData: number[] = [];
  chartProjectData: number[] = [];
  chartAssetInstance: any;
  chartBuildingInstance: any;
  chartProjectInstance: any;
  dataPstatus: any;
  // Table data
  datalistAsset: any;
  datalistBuilding: any;
  datalistProject: any;
  dataMyear: any;
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
    this.apiService.getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        this.dataAdd.PRIVILEGERSTATUS = data[0].PRIVILEGE_RSTATUS;
        //สถานะ
        var Tabletar = {
          "opt": "viewPRSTATUS",
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(Tabletar, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPstatus = data;
            this.dataAdd.PRASSET_RSTATUS = data[3].PRSTATUS_CODE;
          });
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
            //ปีงบประมาณ
            var Tabletar = {
              "opt": "viewmyear"
            }
            this.apiService
              .getdata(Tabletar, this.url1)
              .pipe(first())
              .subscribe((data: any) => {
                this.dataMyear = data;
                this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
                this.onChangeyear();
                
              });


          });
      });

  }

  fetchdataCam() {
    this.dataAdd.opt = "viewrfac";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
        this.fetchdashboard();
      });
  }
  // ฟังก์ขันสำหรับการดึงปีตามแผน
  onChangeyear() {
    //รายการปี
    this.dataAdd.opt = "viewyearduring";
    this.dataYear = null;
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        // this.fetchdatalist();
        this.dataAdd.PRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
      });
  }
  fetchdashboard() {
    this.loading = true;
    // Destroy existing charts
    ['chartAsset', 'chartBuilding', 'chartProject'].forEach(id => {
      let chartStatus = Chart.getChart(id);
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }
    });

    this.dataAdd.opt = "readAll";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          // Reset
          this.assetCount = 0;
          this.assetTotal = 0;
          this.assetpCount = 0;
          this.assetpTotal = 0;
          this.buildingCount = 0;
          this.buildingTotal = 0;
          this.projectCount = 0;
          this.projectTotal = 0;

          // Build year labels from dataYear (6 years)
          this.chartLabels = [];
          if (this.dataYear && this.dataYear.length > 0) {
            for (let i = 0; i < this.dataYear.length; i++) {
              this.chartLabels.push(this.dataYear[i].PLYEARBUDGET_CODE);
            }
          }

          // Initialize chart data arrays with zeros for each year
          this.chartAssetData = new Array(this.chartLabels.length).fill(0);
          this.chartBuildingData = new Array(this.chartLabels.length).fill(0);
          this.chartProjectData = new Array(this.chartLabels.length).fill(0);

          // Summary & chart data from dataAsset
          if (data.dataAsset) {
            for (let i = 0; i < data.dataAsset.length; i++) {
              this.assetCount += Number(data.dataAsset[i].num);
              this.assetTotal += Number(data.dataAsset[i].money);
              // Map to year index
              let yearIdx = this.chartLabels.indexOf(data.dataAsset[i].year);
              if (yearIdx >= 0) {
                this.chartAssetData[yearIdx] += Number(data.dataAsset[i].money);
              }
            }
          }
          if (data.dataAssetp) {
            for (let i = 0; i < data.dataAssetp.length; i++) {
              this.assetpCount += Number(data.dataAssetp[i].num);
              this.assetpTotal += Number(data.dataAssetp[i].money);
            }
          }
          // Summary & chart data from dataBuilding
          if (data.dataBuilding) {
            for (let i = 0; i < data.dataBuilding.length; i++) {
              this.buildingCount += Number(data.dataBuilding[i].num);
              this.buildingTotal += Number(data.dataBuilding[i].money);
              let yearIdx = this.chartLabels.indexOf(data.dataBuilding[i].year);
              if (yearIdx >= 0) {
                this.chartBuildingData[yearIdx] += Number(data.dataBuilding[i].money);
              }
            }
          }
          // Summary & chart data from dataProject
          if (data.dataProject) {
            for (let i = 0; i < data.dataProject.length; i++) {
              this.projectCount += Number(data.dataProject[i].num);
              this.projectTotal += Number(data.dataProject[i].money);
              let yearIdx = this.chartLabels.indexOf(data.dataProject[i].year);
              if (yearIdx >= 0) {
                this.chartProjectData[yearIdx] += Number(data.dataProject[i].money);
              }
            }
          }

          // Table data
          this.datalistAsset = data.dataListAsset || [];
          this.datalistBuilding = data.dataListBuilding || [];
          this.datalistProject = data.dataListProject || [];

          this.createBarCharts();
        } else {
          // ใช้ mock data เมื่อยังไม่มี API
          // this.loadMockData();
        }
        this.loading = null;
      }, (error) => {
        // ใช้ mock data เมื่อ API ยังไม่พร้อม
        //this.loadMockData();
        this.loading = null;
      });
  }

  loadMockData() {
    this.assetCount = 245;
    this.assetTotal = 48750000;
    this.buildingCount = 18;
    this.buildingTotal = 125600000;
    this.projectCount = 56;
    this.projectTotal = 32450000;

    this.chartLabels = ['2568', '2569', '2570', '2571', '2572', '2573'];
    this.chartAssetData = [8500000, 12000000, 7500000, 9200000, 6300000, 5250000];
    this.chartBuildingData = [25000000, 18000000, 22000000, 30000000, 15600000, 15000000];
    this.chartProjectData = [5500000, 6200000, 4800000, 7000000, 5450000, 3500000];

    this.datalistAsset = [
      { FACULTY_TNAME: 'คณะวิศวกรรมศาสตร์', PRASSET_NAME: 'เครื่องคอมพิวเตอร์', PRASSET_NUM: 20, PRASSET_MONEY: 600000, PRASSET_RSTATUS: 'รอพิจารณา' },
      { FACULTY_TNAME: 'คณะบริหารธุรกิจ', PRASSET_NAME: 'เครื่องปรับอากาศ', PRASSET_NUM: 10, PRASSET_MONEY: 350000, PRASSET_RSTATUS: 'อนุมัติ' },
      { FACULTY_TNAME: 'คณะศิลปศาสตร์', PRASSET_NAME: 'โปรเจคเตอร์', PRASSET_NUM: 5, PRASSET_MONEY: 250000, PRASSET_RSTATUS: 'รอพิจารณา' },
      { FACULTY_TNAME: 'คณะวิทยาศาสตร์', PRASSET_NAME: 'กล้องจุลทรรศน์', PRASSET_NUM: 8, PRASSET_MONEY: 480000, PRASSET_RSTATUS: 'อนุมัติ' },
      { FACULTY_TNAME: 'คณะครุศาสตร์อุตสาหกรรม', PRASSET_NAME: 'เครื่องกลึง CNC', PRASSET_NUM: 2, PRASSET_MONEY: 1500000, PRASSET_RSTATUS: 'รอพิจารณา' },
    ];

    this.datalistBuilding = [
      { FACULTY_TNAME: 'คณะวิศวกรรมศาสตร์', PRBUILDING_NAME: 'อาคารปฏิบัติการใหม่', PRBUILDING_MONEY: 45000000, PRBUILDING_RSTATUS: 'อนุมัติ' },
      { FACULTY_TNAME: 'คณะบริหารธุรกิจ', PRBUILDING_NAME: 'ปรับปรุงอาคารเรียนรวม', PRBUILDING_MONEY: 12000000, PRBUILDING_RSTATUS: 'รอพิจารณา' },
      { FACULTY_TNAME: 'สำนักงานอธิการบดี', PRBUILDING_NAME: 'ปรับปรุงระบบไฟฟ้า', PRBUILDING_MONEY: 8500000, PRBUILDING_RSTATUS: 'อนุมัติ' },
    ];

    this.datalistProject = [
      { FACULTY_TNAME: 'คณะวิศวกรรมศาสตร์', PRPROJECT_NAME: 'โครงการพัฒนาห้องปฏิบัติการ IoT', PRPROJECT_MONEY: 2500000, PRPROJECT_RSTATUS: 'อนุมัติ' },
      { FACULTY_TNAME: 'คณะบริหารธุรกิจ', PRPROJECT_NAME: 'โครงการพัฒนาทักษะผู้ประกอบการ', PRPROJECT_MONEY: 1800000, PRPROJECT_RSTATUS: 'รอพิจารณา' },
      { FACULTY_TNAME: 'คณะวิทยาศาสตร์', PRPROJECT_NAME: 'โครงการวิจัยพลังงานสะอาด', PRPROJECT_MONEY: 3200000, PRPROJECT_RSTATUS: 'อนุมัติ' },
      { FACULTY_TNAME: 'สถาบันวิจัยฯ', PRPROJECT_NAME: 'โครงการวิจัยเกษตรอัจฉริยะ', PRPROJECT_MONEY: 4500000, PRPROJECT_RSTATUS: 'รอพิจารณา' },
    ];

    this.createBarCharts();
  }

  createBarCharts() {
    // ครุภัณฑ์ chart - red theme
    this.createSingleBarChart('chartAsset', this.chartLabels, this.chartAssetData,
      'ครุภัณฑ์ (บาท)',
      'rgba(220, 53, 69, 0.75)', 'rgba(220, 53, 69, 1)');

    // สิ่งก่อสร้าง chart - green theme
    this.createSingleBarChart('chartBuilding', this.chartLabels, this.chartBuildingData,
      'สิ่งก่อสร้าง (บาท)',
      'rgba(40, 167, 69, 0.75)', 'rgba(40, 167, 69, 1)');

    // โครงการ chart - blue theme
    this.createSingleBarChart('chartProject', this.chartLabels, this.chartProjectData,
      'โครงการ (บาท)',
      'rgba(13, 110, 253, 0.75)', 'rgba(13, 110, 253, 1)');
  }

  createSingleBarChart(canvasId: string, labels: string[], data: number[], label: string, bgColor: string, borderColor: string) {
    new Chart(canvasId, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: '#333',
            anchor: 'end',
            align: 'top',
            font: {
              size: 10,
              weight: 'bold'
            },
            formatter: function (value) {
              if (value === 0) return '';
              return new Intl.NumberFormat('th-TH').format(value);
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let lbl = context.dataset.label || '';
                if (lbl) lbl += ': ';
                if (context.parsed.y !== null) {
                  lbl += new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(context.parsed.y);
                }
                return lbl;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return new Intl.NumberFormat('th-TH').format(Number(value));
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
