namespace PideServicio.Application.Features.Empresas.Commands.EliminarCorreoCopiaEmpresa;

using PideServicio.Application.Common.CQRS;

public sealed record EliminarCorreoCopiaEmpresaCommand(Guid Id, Guid EmpresaId) : ICommand;
