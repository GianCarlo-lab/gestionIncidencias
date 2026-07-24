namespace PideServicio.Domain.Entities;

using PideServicio.Domain.Common;

public sealed class EmpresaCorreoCopia : BaseEntity
{
    public Guid EmpresaId { get; private set; }
    public string Correo { get; private set; } = string.Empty;
    public bool Activo { get; private set; } = true;
    public DateTimeOffset CreatedAt { get; private set; }
    public Guid? CreatedBy { get; private set; }

    private EmpresaCorreoCopia() { }

    public static EmpresaCorreoCopia Crear(Guid empresaId, string correo, Guid? creadoPor = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(correo);
        return new EmpresaCorreoCopia
        {
            Id = Guid.NewGuid(),
            EmpresaId = empresaId,
            Correo = correo.Trim().ToLowerInvariant(),
            Activo = true,
            CreatedAt = DateTimeOffset.UtcNow,
            CreatedBy = creadoPor,
        };
    }
}
