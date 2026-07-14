namespace PideServicio.Application.Features.Usuarios.Commands.EliminarUsuario;

using FluentValidation;

public sealed class EliminarUsuarioCommandValidator : AbstractValidator<EliminarUsuarioCommand>
{
    public EliminarUsuarioCommandValidator()
    {
        RuleFor(x => x.UsuarioId)
            .NotEmpty().WithMessage("El identificador del usuario es requerido.");
    }
}
