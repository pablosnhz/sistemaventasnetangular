﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.VTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IDashBoardService
    {
        Task<DashBoardDTO> Resumen();
    }
}
