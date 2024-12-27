﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.VTO
{
    public class UsuarioDTO
    {
        public string? NombreCompleto { get; set; }

        public string? Correo { get; set; }

        public int? IdRol { get; set; }
        public string? RolDescripcion { get; set; }


        public string? Clave { get; set; }

        public int? EsActivo { get; set; }
    }
}