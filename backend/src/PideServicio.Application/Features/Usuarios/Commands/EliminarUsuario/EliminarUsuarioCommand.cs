namespace PideServicio.Application.Features.Usuarios.Commands.EliminarUsuario;

using PideServicio.Application.Common.CQRS;

public sealed record EliminarUsuarioCommand(Guid UsuarioId) : ICommand;
