class PermissaoController {
  lista = [
    {
      item_id: 1,
      url: '',
      target: '',
      label: 'Automações',
      icon: 'file-sync',
      items: [
        {
          item_id: 2,
          url: 'automacoes/criar',
          target: '',
          label: 'Criar',
          icon: '',
        },
        {
          item_id: 3,
          url: 'automacoes',
          target: '',
          label: 'Buscar',
          icon: '',
        },
      ],
    },
    {
      item_id: 4,
      url: '',
      target: '',
      label: 'Agendamentos',
      icon: 'clock-circle',
      items: [
        {
          item_id: 5,
          url: 'agendamentos/criar',
          target: '',
          label: 'Criar',
          icon: '',
        },
        {
          item_id: 6,
          url: 'agendamentos',
          target: '',
          label: 'Buscar',
          icon: '',
        },
      ],
    },
    {
      item_id: 7,
      url: '',
      target: '',
      label: 'Sistema',
      icon: 'clock-circle',
      items: [
        {
          item_id: 8,
          url: 'usuarios',
          target: '',
          label: 'Usuarios',
          icon: '',
        },
        {
          item_id: 9,
          url: 'permissoes',
          target: '',
          label: 'Permissões',
          icon: '',
        },
      ],
    },
  ];

  validar = (req, res) => {
    const { usuario } = req;

    return res.status(200).json({ success: true, data: this.lista });
  };
}

module.exports = new PermissaoController();
