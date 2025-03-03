let saldo = 534.56; // Saldo inicial
    const movimentacoes = []; // Lista de movimentações
    let tipoTransacaoAtual = ''; // Tipo de transação atual

    // Função para formatar valores em moeda brasileira
    function formatarMoeda(valor) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    // Função para atualizar o saldo na tela
    function atualizarSaldo() {
      document.getElementById('saldo').textContent = formatarMoeda(saldo);
    }

    // Função para adicionar uma movimentação
    function adicionarMovimentacao(tipo, valor, informacoesAdicionais) {
      const data = new Date().toLocaleString(); // Data e hora atual
      movimentacoes.push({ tipo, valor, data, informacoesAdicionais });

      // Atualiza o saldo
      if (tipo === 'Depósito') {
        saldo += valor;
      } else {
        saldo -= valor;
      }

      // Atualiza a lista de movimentações
      const listaMovimentacoes = document.getElementById('listaMovimentacoes');
      listaMovimentacoes.innerHTML = movimentacoes.map(mov => `
        <li class="flex items-center justify-between py-3 border-b">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center ${mov.tipo === 'Depósito' ? 'bg-green-100' : 'bg-red-100'}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ${mov.tipo === 'Depósito' ? 'text-green-600' : 'text-red-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${obterIconeTransacao(mov.tipo)}" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">${mov.tipo}</p>
              <p class="text-sm text-gray-500">${mov.data}</p>
              <p class="text-sm text-gray-500">${mov.informacoesAdicionais}</p>
            </div>
          </div>
          <p class="text-sm ${mov.tipo === 'Depósito' ? 'text-green-600' : 'text-red-600'}">${formatarMoeda(mov.valor)}</p>
        </li>
      `).join('');

      // Atualiza o saldo na tela
      atualizarSaldo();
    }

    // Função para abrir a tela de transação
    function abrirTelaTransacao(tipo) {
      tipoTransacaoAtual = tipo;
      document.getElementById('tituloTransacao').textContent = `Qual o valor ${tipo}?`;
      document.getElementById('saldoTransacao').textContent = formatarMoeda(saldo);

      // Adiciona o ícone correspondente ao tipo de transação
      const iconeTransacao = document.getElementById('iconeTransacao');
      if (iconeTransacao) {
        iconeTransacao.innerHTML = obterIconeTransacao(tipo);
      } else {
        console.error('Elemento iconeTransacao não encontrado!');
      }

      // Configura o campo de informações adicionais
      const campoInformacoesAdicionais = document.getElementById('campoInformacoesAdicionais');
      campoInformacoesAdicionais.innerHTML = ''; // Limpa o campo

      switch (tipo) {
        case 'PIX':
          campoInformacoesAdicionais.innerHTML = `
            <input type="text" id="chavePix" placeholder="Chave PIX" class="w-full p-4 border rounded mb-4 text-xl">
          `;
          break;
        case 'Transferir':
          campoInformacoesAdicionais.innerHTML = `
            <input type="text" id="agencia" placeholder="Agência" class="w-full p-4 border rounded mb-4 text-xl">
            <input type="text" id="conta" placeholder="Conta" class="w-full p-4 border rounded mb-4 text-xl">
          `;
          break;
        case 'Recarregar':
          campoInformacoesAdicionais.innerHTML = `
            <input type="text" id="operadora" placeholder="Operadora" class="w-full p-4 border rounded mb-4 text-xl">
          `;
          break;
        case 'Depósito':
          campoInformacoesAdicionais.innerHTML = `
            <input type="text" id="origemDeposito" placeholder="Origem do depósito" class="w-full p-4 border rounded mb-4 text-xl">
          `;
          break;
        default:
          campoInformacoesAdicionais.innerHTML = '';
      }

      document.getElementById('telaTransacao').classList.remove('hidden');
    }

    // Função para obter o ícone da transação
    function obterIconeTransacao(tipo) {
      switch (tipo) {
        case 'PIX':
          return `M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z`;
        case 'Pagar':
          return `M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z`;
        case 'Transferir':
          return `M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z`;
        case 'Depósito':
          return `M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z`;
        case 'Recarregar':
          return `M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3`;
        default:
          return '';
      }
    }

    // Função para fechar a tela de transação
    function fecharTelaTransacao() {
      document.getElementById('telaTransacao').classList.add('hidden');
    }

    // Função para confirmar a transação
    function confirmarTransacao() {
      const valor = parseFloat(document.getElementById('valorTransacao').value);
      if (!isNaN(valor)) {
        if (tipoTransacaoAtual !== 'Depósito' && valor > saldo) {
          alert('Saldo insuficiente!');
        } else {
          let informacoesAdicionais = '';
          switch (tipoTransacaoAtual) {
            case 'PIX':
              informacoesAdicionais = `Chave PIX: ${document.getElementById('chavePix').value}`;
              break;
            case 'Transferir':
              informacoesAdicionais = `Agência: ${document.getElementById('agencia').value}, Conta: ${document.getElementById('conta').value}`;
              break;
            case 'Recarregar':
              informacoesAdicionais = `Operadora: ${document.getElementById('operadora').value}`;
              break;
            case 'Depósito':
              informacoesAdicionais = `Origem: ${document.getElementById('origemDeposito').value}`;
              break;
            default:
              informacoesAdicionais = '';
          }

          adicionarMovimentacao(tipoTransacaoAtual, valor, informacoesAdicionais);
          fecharTelaTransacao();
        }
      } else {
       
      }
    }

    // Função para alternar a visibilidade do saldo
    function alternarVisibilidadeSaldo() {
      const saldoElemento = document.getElementById('saldo');
      const iconeOlho = document.getElementById('iconeOlho');

      if (saldoElemento.textContent === formatarMoeda(saldo)) {
        saldoElemento.textContent = '••••••';
        iconeOlho.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />`;
      } else {
        saldoElemento.textContent = formatarMoeda(saldo);
        iconeOlho.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
      }
    }

    // Função para alternar a visibilidade da seção de movimentações
    function alternarVisibilidadeMovimentacoes() {
      const saldoElemento = document.getElementById('saldo');
      if (saldoElemento.textContent !== '••••••') {
        const secaoMovimentacoes = document.getElementById('secaoMovimentacoes');
        secaoMovimentacoes.classList.toggle('hidden');
      }
    }

    // Função para salvar o perfil
    function salvarPerfil() {
      const nomeUsuario = document.getElementById('nomeUsuario').value;
      const fotoPerfil = document.getElementById('fotoPerfil').files[0];

      if (nomeUsuario) {
        localStorage.setItem('nomeUsuario', nomeUsuario);
        document.getElementById('mensagemBoasVindas').textContent = `Olá, ${nomeUsuario}! O Banco do Futuro é Aqui...`;
      }

      if (fotoPerfil) {
        const reader = new FileReader();
        reader.onload = function (e) {
          localStorage.setItem('fotoPerfil', e.target.result);
          document.getElementById('fotoPerfilContainer').style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(fotoPerfil);
      }

      fecharModalPerfil();
    }

    // Função para fechar o modal de perfil
    function fecharModalPerfil() {
      document.getElementById('modalPerfil').classList.add('hidden');
    }

    // Função para abrir o modal de perfil
    function abrirModalPerfil() {
      document.getElementById('modalPerfil').classList.remove('hidden');
    }

    // Carregar perfil ao iniciar a página
    window.onload = function () {
      const nomeUsuario = localStorage.getItem('nomeUsuario');
      const fotoPerfil = localStorage.getItem('fotoPerfil');

      if (nomeUsuario) {
        document.getElementById('mensagemBoasVindas').textContent = `Olá, ${nomeUsuario}! O Banco do Futuro é Aqui...`;
      }

      if (fotoPerfil) {
        document.getElementById('fotoPerfilContainer').style.backgroundImage = `url(${fotoPerfil})`;
      }

      // Atualiza o saldo inicial
      atualizarSaldo();
    };