namespace PideServicio.Application.Features.Empresas.Queries.GetCorreosCopiaEmpresa;

using PideServicio.Application.Common.CQRS;
using PideServicio.Application.Features.Empresas.DTOs;

public sealed record GetCorreosCopiaEmpresaQuery(Guid EmpresaId) : IQuery<IReadOnlyList<EmpresaCorreoCopiaDto>>;
