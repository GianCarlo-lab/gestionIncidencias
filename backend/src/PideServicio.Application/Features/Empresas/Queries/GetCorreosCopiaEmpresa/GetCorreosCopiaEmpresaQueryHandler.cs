namespace PideServicio.Application.Features.Empresas.Queries.GetCorreosCopiaEmpresa;

using PideServicio.Application.Common.CQRS;
using PideServicio.Application.Common.Interfaces;
using PideServicio.Application.Common.Interfaces.Repositories;
using PideServicio.Application.Common.Models;
using PideServicio.Application.Features.Empresas.DTOs;
using PideServicio.Domain.Enums;

public sealed class GetCorreosCopiaEmpresaQueryHandler
    : IQueryHandler<GetCorreosCopiaEmpresaQuery, IReadOnlyList<EmpresaCorreoCopiaDto>>
{
    private readonly IEmpresaCorreoCopiaRepository _repo;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ICurrentUserService _currentUser;

    public GetCorreosCopiaEmpresaQueryHandler(
        IEmpresaCorreoCopiaRepository repo,
        IUsuarioRepository usuarioRepository,
        ICurrentUserService currentUser)
    {
        _repo = repo;
        _usuarioRepository = usuarioRepository;
        _currentUser = currentUser;
    }

    public async Task<Result<IReadOnlyList<EmpresaCorreoCopiaDto>>> Handle(
        GetCorreosCopiaEmpresaQuery query,
        CancellationToken ct)
    {
        var claims = _currentUser.UsuarioActual;
        if (claims is null) return Result.NoAutorizado<IReadOnlyList<EmpresaCorreoCopiaDto>>();

        var actorDb = claims.Id != Guid.Empty
            ? await _usuarioRepository.ObtenerPorIdAsync(claims.Id, ct)
            : await _usuarioRepository.ObtenerPorAuthIdAsync(claims.AuthId, ct);
        if (actorDb is null || !actorDb.Activo)
            return Result.NoAutorizado<IReadOnlyList<EmpresaCorreoCopiaDto>>();

        if (actorDb.Rol == RolTipo.ADMIN)
        {
            if (actorDb.EmpresaId != query.EmpresaId)
                return Result.NoPermitido<IReadOnlyList<EmpresaCorreoCopiaDto>>(
                    "Solo puede consultar los correos en copia de su propia empresa.");
        }
        else if (actorDb.Rol != RolTipo.SUPERADMIN)
        {
            return Result.NoPermitido<IReadOnlyList<EmpresaCorreoCopiaDto>>(
                "No tiene permisos para consultar correos en copia.");
        }

        var correos = await _repo.ListarConDetallesPorEmpresaAsync(query.EmpresaId, ct);
        return Result.Exito(correos);
    }
}
