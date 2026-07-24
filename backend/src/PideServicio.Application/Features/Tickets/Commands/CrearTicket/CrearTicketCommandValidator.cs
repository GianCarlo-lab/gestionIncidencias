namespace PideServicio.Application.Features.Tickets.Commands.CrearTicket;

using FluentValidation;

public sealed class CrearTicketCommandValidator : AbstractValidator<CrearTicketCommand>
{
    public CrearTicketCommandValidator()
    {
        RuleFor(x => x.Titulo)
            .MaximumLength(300).WithMessage("El título no puede exceder 300 caracteres.")
            .When(x => x.Titulo is not null);

        RuleFor(x => x.SucursalId)
            .NotEmpty().WithMessage("La sucursal es requerida.");

        RuleFor(x => x.AreaNombre)
            .NotEmpty().WithMessage("El área es requerida.")
            .MaximumLength(150).WithMessage("El nombre del área no puede exceder 150 caracteres.");

        RuleFor(x => x.TipoServicioId)
            .NotEmpty().WithMessage("El tipo de servicio es requerido.");

        RuleFor(x => x.CategoriaId)
            .NotEmpty().WithMessage("La categoría es requerida.");

        When(x => x.CorreosJefe is { Count: > 0 }, () =>
        {
            RuleFor(x => x.CorreosJefe)
                .Must(s => s!.Count <= 5)
                .WithMessage("Máximo 5 correos de supervisores por ticket.");
            RuleForEach(x => x.CorreosJefe).ChildRules(s =>
                s.RuleFor(x => x)
                    .NotEmpty().WithMessage("El correo no puede estar vacío.")
                    .EmailAddress().WithMessage("'{PropertyValue}' no es un correo electrónico válido."));
        });
    }
}
