'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function CriarAutomacao() {
  const router = useRouter();

  const [listParameters, setListParameters] = useState<number[]>([]);
  const [listTypeParameters, setListTypeParameters] = useState<
    {
      id: number;
      nome: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const adicionarParametro = () => {
    const list = listParameters;
    list.push((listParameters.slice(-1)?.at(0) || 0) + 1);

    setListParameters(list);
  };

  const salvar = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError('');
      setLoading(true);

      const formData = new FormData(event.currentTarget);

      const token = localStorage.getItem('token');

      if (!token) router.replace('/login');

      const res = await fetch('http://localhost:3100/automacoes', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/automacoes');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadListTypeParameters = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) router.push('/login');

      const res = await fetch('http://localhost:3100/tipos-parametros', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setListTypeParameters(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadListTypeParameters();
  }, []);

  return (
    <div className='w-full p-4'>
      <div className='flex justify-center flex-row'>
        <h1 className='font-bold mb-4 text-xl text-center'>
          Criar nova automação
        </h1>
      </div>

      <form className='space-y-4 md:space-y-6 mx-40' onSubmit={salvar}>
        {error && (
          <div
            className=' p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400'
            role='alert'
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor='nome'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Nome
          </label>
          <input
            name='nome'
            id='nome'
            className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Processo exemplo'
            required={false}
          />
        </div>

        <div>
          <label
            htmlFor='arquivo'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Arquivo
          </label>
          <input
            type='file'
            name='arquivo'
            id='arquivo'
            className='block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-primary-600 focus:ring-primary-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-700 dark:border-gray-600 dark:text-white file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-gray-800 dark:file:text-neutral-400'
          />
        </div>

        <div className='h-20 flex justify-between items-center flex-row'>
          <h1 className='font-bold mb-2 text-lg'>Parâmetros</h1>

          <button
            onClick={adicionarParametro}
            type='button'
            className='h-10 text-white bg-primary-600 disabled:bg-primary-500 disabled:hover:bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
          >
            Adicionar
          </button>
        </div>

        {listParameters.length
          ? listParameters.map((parameter) => (
              <div key={parameter} className='flex flex-row justify-center'>
                <div className='w-full mr-2'>
                  <label
                    htmlFor='horario'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Nome:
                  </label>
                  <input
                    name='nome'
                    id='nome'
                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='exemplo'
                    required={false}
                  />
                </div>

                <div className='w-full '>
                  <label
                    htmlFor='tipo_agendamento_id'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Tipo
                  </label>
                  <select
                    id='tipo_agendamento_id'
                    name='tipo_agendamento_id'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option defaultValue={''}>Selecione um tipo</option>
                    {listTypeParameters.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          : 'Nenhum parametro adicionado'}

        <button
          type='submit'
          disabled={loading}
          className='w-full text-white bg-primary-600 disabled:bg-primary-500 disabled:hover:bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
        >
          {loading ? (
            <>
              <svg
                aria-hidden='true'
                role='status'
                className='inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                ></path>
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='#1C64F2'
                ></path>
              </svg>
              Carregando
            </>
          ) : (
            'Salvar'
          )}
        </button>
      </form>
    </div>
  );
}
