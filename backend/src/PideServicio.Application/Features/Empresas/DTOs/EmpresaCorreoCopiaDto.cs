namespace PideServicio.Application.Features.Empresas.DTOs;

public sealed record EmpresaCorreoCopiaDto(Guid Id, string Correo, bool Activo, DateTimeOffset CreatedAt);
