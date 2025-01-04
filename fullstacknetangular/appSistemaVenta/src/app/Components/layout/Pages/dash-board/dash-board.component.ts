import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashBoardService } from 'src/app/services/dash-board.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit{

  totalIngresos: number = 0;
  totalVentas: number = 0;
  totalProductos: number = 0;

  constructor(  private _dashBoardService: DashBoardService){}

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]){
    const chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [
          {
            label: '# de Ventas',
            data: dataGrafico,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  ngOnInit(): void {
    this._dashBoardService.resumen().subscribe({
      next: (data) => {
        if(data.status){
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.ventasUltimaSemana;
          console.log(arrayData);

          // separamos las fechas
          const labelTemp = arrayData.map((item) => item.fecha);
          const dataTemp = arrayData.map((item) => item.fecha);

          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: (e) => {}
    })
  }
}
