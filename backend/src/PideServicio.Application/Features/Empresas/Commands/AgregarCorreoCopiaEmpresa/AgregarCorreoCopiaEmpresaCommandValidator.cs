namespace PideServicio.Application.Features.Empresas.Commands.AgregarCorreoCopiaEmpresa;

using FluentValidation;

public sealed class AgregarCorreoCopiaEmpresaCommandValidator : AbstractValidator<AgregarCorreoCopiaEmpresaCommand>
{
    public AgregarCorreoCopiaEmpresaCommandValidator()
    {
        RuleFor(x => x.EmpresaId)
            .NotEmpty().WithMessage("El identificador de empresa es requerido.");

        RuleFor(x => x.Correo)
            .NotEmpty().WithMessage("El correo electrónico es requerido.")
            .EmailAddress().WithMessage("El correo electrónico no tiene un formato válido.")
            .MaximumLength(254).WithMessage("El correo electrónico no puede exceder 254 caracteres.");
    }
}
