class MenuController {
  menusAdmin = [2, 4, 8];
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
          url: 'automacoes/parametros',
          target: '_blank',
          label: 'Parâmetros',
          icon: '',
        },
        {
          item_id: 4,
          url: 'automacoes',
          target: '_blank',
          label: 'Buscar',
          icon: '',
        },
      ],
    },
    {
      item_id: 5,
      url: null,
      target: '_blank',
      label: 'Agendamentos',
      icon: 'clock-circle',
      items: [
        {
          item_id: 6,
          url: 'agendamentos/criar',
          target: '_blank',
          label: 'Criar',
          icon: '',
        },
        {
          item_id: 7,
          url: 'agendamentos',
          target: '_blank',
          label: 'Buscar',
          icon: '',
        },
      ],
    },
    {
      item_id: 8,
      url: null,
      target: '_blank',
      label: 'Sistema',
      icon: 'setting',
      items: [
        {
          item_id: 9,
          url: 'usuarios',
          target: '_blank',
          label: 'Usuarios',
          icon: '',
        },
      ],
    },
  ];

  listar = (req, res) => {
    const { usuario } = req;

    let novaLista = this.lista;

    if (!usuario.admin)
      novaLista = novaLista
        .filter(
          (item) =>
            !this.menusAdmin.includes(item.item_id) ||
            item.items.find((subItem) =>
              this.menusAdmin.includes(subItem.item_id)
            )
        )
        .map((item) => ({
          ...item,
          items: item.items.filter(
            (subItem) => !this.menusAdmin.includes(subItem.item_id)
          ),
        }));

    return res.status(200).json({ success: true, data: novaLista });
  };
}

module.exports = new MenuController();
