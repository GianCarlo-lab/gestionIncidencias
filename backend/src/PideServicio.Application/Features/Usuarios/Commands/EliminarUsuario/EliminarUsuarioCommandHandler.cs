namespace PideServicio.Application.Features.Usuarios.Commands.EliminarUsuario;

using PideServicio.Application.Common.CQRS;
using PideServicio.Application.Common.Interfaces;
using PideServicio.Application.Common.Interfaces.Repositories;
using PideServicio.Application.Common.Models;
using PideServicio.Domain.Enums;
using PideServicio.Domain.Exceptions;

public sealed class EliminarUsuarioCommandHandler : ICommandHandler<EliminarUsuarioCommand>
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly ISupabaseAuthService _supabaseAuth;
    private readonly IAuditService _auditService;

    public EliminarUsuarioCommandHandler(
        IUsuarioRepository usuarioRepository,
        ICurrentUserService currentUserService,
        ISupabaseAuthService supabaseAuth,
        IAuditService auditService)
    {
        _usuarioRepository = usuarioRepository;
        _currentUserService = currentUserService;
        _supabaseAuth = supabaseAuth;
        _auditService = auditService;
    }

    public async Task<Result> Handle(EliminarUsuarioCommand request, CancellationToken ct)
    {
        var claims = _currentUserService.UsuarioActual;
        if (claims is null) return Result.NoAutorizado();

        var actorDb = claims.Id != Guid.Empty
            ? await _usuarioRepository.ObtenerPorIdAsync(claims.Id, ct)
            : await _usuarioRepository.ObtenerPorAuthIdAsync(claims.AuthId, ct);
        if (actorDb is null || !actorDb.Activo) return Result.NoAutorizado();

        if (actorDb.Rol is not (RolTipo.ADMIN or RolTipo.SUPERADMIN))
            return Result.NoPermitido("Solo administradores pueden eliminar usuarios.");

        if (request.UsuarioId == actorDb.Id)
            return Result.NoPermitido("No puede eliminarse a sí mismo.");

        var usuario = await _usuarioRepository.ObtenerPorIdAsync(request.UsuarioId, ct);
        if (usuario is null)
            return Result.NoEncontrado("Usuario", request.UsuarioId);

        if (actorDb.Rol == RolTipo.ADMIN && usuario.EmpresaId != actorDb.EmpresaId)
            return Result.NoPermitido("Solo puede eliminar usuarios de su empresa.");

        try
        {
            var authId = usuario.AuthId;
            var nombreCompleto = usuario.NombreCompleto;

            usuario.Eliminar(actorDb.Id);
            await _usuarioRepository.ActualizarAsync(usuario, ct);

            await _auditService.RegistrarAsync(
                entidad: "Usuario",
                entidadId: usuario.Id,
                accion: "Eliminar",
                antes: new { NombreCompleto = nombreCompleto, Activo = usuario.Activo },
                despues: new { EliminadoPor = actorDb.Id },
                cancellationToken: ct);

            // Eliminar de Supabase Auth en segundo plano — si falla, el borrado lógico ya quedó registrado
            try
            {
                await _supabaseAuth.EliminarUsuarioDeAuthAsync(authId, ct);
            }
            catch
            {
                // Ignoramos el fallo de Auth: el borrado lógico en BD es suficiente para el sistema
            }

            return Result.Exito();
        }
        catch (ValidationException ex)
        {
            return Result.ErrorValidacion(ex.Errors);
        }
        catch (NotFoundException ex)
        {
            return Result.NoEncontrado(ex.Message);
        }
        catch (ForbiddenException ex)
        {
            return Result.NoPermitido(ex.Message);
        }
        catch (DomainException ex)
        {
            return Result.Fallo(ex.Message);
        }
    }
}
