export function validateCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]+/g, '');
  
    // Verifica se o CNPJ está vazio ou possui tamanho inválido
    if (cnpj === '' || cnpj.length !== 14) return false;
  
    // Elimina CNPJs inválidos conhecidos
    const invalidCNPJs = [
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999',
    ];
  
    if (invalidCNPJs.includes(cnpj)) return false;
  
    // Validação dos dígitos verificadores (DVs)
    const validarDigito = (cnpj: string, tamanho: number): boolean => {
      let soma = 0;
      let pos = tamanho - 7;
  
      for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(cnpj.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
      }
  
      const resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      return resultado === parseInt(cnpj.charAt(tamanho));
    };
  
    // Valida primeiro DV
    const tamanho = cnpj.length - 2;
    if (!validarDigito(cnpj, tamanho)) return false;
  
    // Valida segundo DV
    return validarDigito(cnpj, tamanho + 1);
  }
  