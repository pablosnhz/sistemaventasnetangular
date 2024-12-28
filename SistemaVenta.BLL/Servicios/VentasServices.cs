using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.VTO;
using SistemaVenta.Model;
using System.Globalization;
using Microsoft.EntityFrameworkCore;

namespace SistemaVenta.BLL.Servicios
{
    public class VentasServices : IVentaService
    {
        private readonly IVentaRepository _ventaRepositorio;
        private readonly IGenericRepository<DatalleVenta> _detalleVentaRepositorio;
        private readonly IMapper _mapper;

        public VentasServices(IVentaRepository ventaRepositorio, IGenericRepository<DatalleVenta> detalleVentaRepositorio, IMapper mapper)
        {
            _ventaRepositorio = ventaRepositorio;
            _detalleVentaRepositorio = detalleVentaRepositorio;
            _mapper = mapper;
        }

        public async Task<VentaDTO> Registrar(VentaDTO modelo)
        {
            try {
                var ventaGenerada = await _ventaRepositorio.Registrar(_mapper.Map<Venta>(modelo));
                if (ventaGenerada.IdVenta == 0)
                    throw new TaskCanceledException("No se pudo crear");
                return _mapper.Map<VentaDTO>(ventaGenerada);
            } catch {
                throw;
            }
        }
        
        public async Task<List<VentaDTO>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFin)
        {
            IQueryable<Venta> query = await _ventaRepositorio.Consultar();
            var ListaResultado = new List<Venta>();
            try { 
                if(buscarPor == "fecha")
                {
                    DateTime fech_Inicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-AR"));
                    DateTime fech_Fin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-AR"));

                    ListaResultado = await query.Where(v =>
                        v.FechaRegistro.Value.Date >= fech_Inicio.Date &&
                        v.FechaRegistro.Value.Date <= fech_Fin.Date
                    ).Include(dv => dv.DatalleVenta).ThenInclude(p => p.IdProductoNavigation).
                    ToListAsync();
                } else
                {
                    ListaResultado = await query.Where(v =>
                        v.NumeroDocumento == numeroVenta
                    ).Include(dv => dv.DatalleVenta).ThenInclude(p => p.IdProductoNavigation).
                    ToListAsync();
                }
            } catch {
                throw;
            }
            return _mapper.Map<List<VentaDTO>>(ListaResultado);
        }


        public async Task<List<ReporteDTO>> Reporte(string fechaInicio, string fechaFin)
        {
            IQueryable<DatalleVenta> query = await _detalleVentaRepositorio.Consultar();
            var ListaResultado = new List<DatalleVenta>();
            try {
                DateTime fech_Inicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-AR"));
                DateTime fech_Fin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", new CultureInfo("es-AR"));

                ListaResultado = await query
                    .Include(p => p.IdProductoNavigation)
                    .Include(v => v.IdVentaNavigation)
                    .Where(dv => 
                        dv.IdVentaNavigation.FechaRegistro.Value.Date >= fech_Inicio.Date &&
                        dv.IdVentaNavigation.FechaRegistro.Value.Date <= fech_Fin.Date
                    ).ToListAsync();
            } catch {
                throw;
            }
            return _mapper.Map<List<ReporteDTO>>(ListaResultado);
        }
    }
}
