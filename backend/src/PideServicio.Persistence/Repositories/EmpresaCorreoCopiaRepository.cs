namespace PideServicio.Persistence.Repositories;

using Dapper;
using Npgsql;
using PideServicio.Application.Common.Interfaces;
using PideServicio.Application.Common.Interfaces.Repositories;
using PideServicio.Application.Features.Empresas.DTOs;

public sealed class EmpresaCorreoCopiaRepository : IEmpresaCorreoCopiaRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public EmpresaCorreoCopiaRepository(IDbConnectionFactory connectionFactory)
        => _connectionFactory = connectionFactory;

    public async Task<IReadOnlyList<string>> ListarCorreosPorEmpresaAsync(
        Guid empresaId, CancellationToken ct = default)
    {
        const string sql = """
            SELECT correo
            FROM   empresa_correos_copia
            WHERE  empresa_id = @EmpresaId
              AND  activo = true
            ORDER  BY created_at
            """;

        await using var cn = (NpgsqlConnection)await _connectionFactory.CrearConexionAsync(ct);
        var rows = await cn.QueryAsync<string>(sql, new { EmpresaId = empresaId });
        return rows.ToList().AsReadOnly();
    }

    public async Task<IReadOnlyList<EmpresaCorreoCopiaDto>> ListarConDetallesPorEmpresaAsync(
        Guid empresaId, CancellationToken ct = default)
    {
        const string sql = """
            SELECT id, correo, activo, created_at AS "CreatedAt"
            FROM   empresa_correos_copia
            WHERE  empresa_id = @EmpresaId
              AND  activo = true
            ORDER  BY created_at
            """;

        await using var cn = (NpgsqlConnection)await _connectionFactory.CrearConexionAsync(ct);
        var rows = await cn.QueryAsync<EmpresaCorreoCopiaDto>(sql, new { EmpresaId = empresaId });
        return rows.ToList().AsReadOnly();
    }

    public async Task<Guid> AgregarAsync(
        Guid empresaId, string correo, Guid? creadoPor = null, CancellationToken ct = default)
    {
        const string sql = """
            INSERT INTO empresa_correos_copia (empresa_id, correo, created_by)
            VALUES (@EmpresaId, @Correo, @CreadoPor)
            ON CONFLICT (empresa_id, correo)
            DO UPDATE SET activo = true
            RETURNING id
            """;

        await using var cn = (NpgsqlConnection)await _connectionFactory.CrearConexionAsync(ct);
        return await cn.ExecuteScalarAsync<Guid>(sql, new { EmpresaId = empresaId, Correo = correo.Trim().ToLowerInvariant(), CreadoPor = creadoPor });
    }

    public async Task<bool> EliminarAsync(Guid id, CancellationToken ct = default)
    {
        const string sql = """
            UPDATE empresa_correos_copia
            SET    activo = false
            WHERE  id = @Id
              AND  activo = true
            """;

        await using var cn = (NpgsqlConnection)await _connectionFactory.CrearConexionAsync(ct);
        var rowsAffected = await cn.ExecuteAsync(sql, new { Id = id });
        return rowsAffected > 0;
    }

    public async Task<bool> ExisteAsync(Guid empresaId, string correo, CancellationToken ct = default)
    {
        const string sql = """
            SELECT EXISTS(
                SELECT 1
                FROM   empresa_correos_copia
                WHERE  empresa_id = @EmpresaId
                  AND  correo = LOWER(@Correo)
                  AND  activo = true
            )
            """;

        await using var cn = (NpgsqlConnection)await _connectionFactory.CrearConexionAsync(ct);
        return await cn.ExecuteScalarAsync<bool>(sql, new { EmpresaId = empresaId, Correo = correo });
    }
}
