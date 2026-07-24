namespace PideServicio.Application.Features.Empresas.Commands.EliminarCorreoCopiaEmpresa;

using PideServicio.Application.Common.CQRS;
using PideServicio.Application.Common.Interfaces;
using PideServicio.Application.Common.Interfaces.Repositories;
using PideServicio.Application.Common.Models;
using PideServicio.Domain.Enums;

public sealed class EliminarCorreoCopiaEmpresaCommandHandler : ICommandHandler<EliminarCorreoCopiaEmpresaCommand>
{
    private readonly IEmpresaCorreoCopiaRepository _repo;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ICurrentUserService _currentUser;
    private readonly IAuditService _auditService;

    public EliminarCorreoCopiaEmpresaCommandHandler(
        IEmpresaCorreoCopiaRepository repo,
        IUsuarioRepository usuarioRepository,
        ICurrentUserService currentUser,
        IAuditService auditService)
    {
        _repo = repo;
        _usuarioRepository = usuarioRepository;
        _currentUser = currentUser;
        _auditService = auditService;
    }

    public async Task<Result> Handle(EliminarCorreoCopiaEmpresaCommand request, CancellationToken ct)
    {
        var claims = _currentUser.UsuarioActual;
        if (claims is null) return Result.NoAutorizado();

        var actorDb = claims.Id != Guid.Empty
            ? await _usuarioRepository.ObtenerPorIdAsync(claims.Id, ct)
            : await _usuarioRepository.ObtenerPorAuthIdAsync(claims.AuthId, ct);
        if (actorDb is null || !actorDb.Activo) return Result.NoAutorizado();

        if (actorDb.Rol == RolTipo.ADMIN)
        {
            if (actorDb.EmpresaId != request.EmpresaId)
                return Result.NoPermitido("Solo puede gestionar correos en copia de su propia empresa.");
        }
        else if (actorDb.Rol != RolTipo.SUPERADMIN)
        {
            return Result.NoPermitido("No tiene permisos para eliminar correos en copia.");
        }

        var eliminado = await _repo.EliminarAsync(request.Id, ct);
        if (!eliminado)
            return Result.NoEncontrado("CorreoCopia", request.Id);

        await _auditService.RegistrarAsync(
            "empresa_correos_copia",
            request.Id,
            "ELIMINADO",
            new { request.Id, request.EmpresaId },
            null,
            ct);

        return Result.Exito();
    }
}
