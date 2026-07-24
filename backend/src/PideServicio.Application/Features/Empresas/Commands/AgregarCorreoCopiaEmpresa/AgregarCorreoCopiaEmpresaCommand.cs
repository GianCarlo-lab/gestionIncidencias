namespace PideServicio.Application.Features.Empresas.Commands.AgregarCorreoCopiaEmpresa;

using PideServicio.Application.Common.CQRS;

public sealed record AgregarCorreoCopiaEmpresaCommand(Guid EmpresaId, string Correo) : ICommand<Guid>;
