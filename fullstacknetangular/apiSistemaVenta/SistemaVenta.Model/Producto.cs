﻿using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class Producto
{
    public int IdProducto { get; set; }

    public string? Nombre { get; set; }

    public int? IdCategoria { get; set; }

    public int? Stock { get; set; }

    public decimal? Precio { get; set; }

    public bool? EsActivo { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public virtual ICollection<DatalleVenta> DatalleVenta { get; } = new List<DatalleVenta>();

    public virtual Categoria? IdCategoriaNavigation { get; set; }
}
