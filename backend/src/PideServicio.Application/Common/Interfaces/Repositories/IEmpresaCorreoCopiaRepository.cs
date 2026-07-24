namespace PideServicio.Application.Common.Interfaces.Repositories;

using PideServicio.Application.Features.Empresas.DTOs;

public interface IEmpresaCorreoCopiaRepository
{
    Task<IReadOnlyList<string>> ListarCorreosPorEmpresaAsync(Guid empresaId, CancellationToken ct = default);
    Task<IReadOnlyList<EmpresaCorreoCopiaDto>> ListarConDetallesPorEmpresaAsync(Guid empresaId, CancellationToken ct = default);
    Task<Guid> AgregarAsync(Guid empresaId, string correo, Guid? creadoPor = null, CancellationToken ct = default);
    Task<bool> EliminarAsync(Guid id, CancellationToken ct = default);
    Task<bool> ExisteAsync(Guid empresaId, string correo, CancellationToken ct = default);
}
