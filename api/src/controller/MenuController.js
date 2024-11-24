class MenuController {
  menusAdmin = [1, 7]
  lista = [
    {
      item_id: 1,
      url: null,
      target: '_blank',
      label: 'Automações',
      icon: 'file-sync',
      items: [
        {
          item_id: 2,
          url: 'automacoes/criar',
          target: '_blank',
          label: 'Criar',
          icon: '',
        },
        {
          item_id: 3,
          url: 'automacoes',
          target: '_blank',
          label: 'Buscar',
          icon: '',
        },
      ],
    },
    {
      item_id: 4,
      url: null,
      target: '_blank',
      label: 'Agendamentos',
      icon: 'clock-circle',
      items: [
        {
          item_id: 5,
          url: 'agendamentos/criar',
          target: '_blank',
          label: 'Criar',
          icon: '',
        },
        {
          item_id: 6,
          url: 'agendamentos',
          target: '_blank',
          label: 'Buscar',
          icon: '',
        },
      ],
    },
    {
      item_id: 7,
      url: null,
      target: '_blank',
      label: 'Sistema',
      icon: 'setting',
      items: [
        {
          item_id: 8,
          url: 'usuarios',
          target: '_blank',
          label: 'Usuarios',
          icon: '',
        },
        {
          item_id: 9,
          url: 'permissoes',
          target: '_blank',
          label: 'Permissões',
          icon: '',
        },
      ],
    },
  ];

  listar = (req, res) => {
    const { usuario } = req;

    let novaLista = this.lista;

    if(!usuario.admin) 
      novaLista = novaLista.filter(item => !this.menusAdmin.includes(item.item_id))

    return res.status(200).json({ success: true, data: novaLista });
  };
}

module.exports = new MenuController();
