'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function CriarAgendamento() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState('');
  const [list, setList] = useState<
    {
      id: number;
      nome: string;
      criado_em: string;
    }[]
  >([]);

  const salvar = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      setError('');
      setLoading(true);

      const formData = new FormData(event.currentTarget);
      const horario = formData.get('horario');
      const automacao_id = formData.get('automacao_id');

      const token = localStorage.getItem('token');

      if (!token) router.replace('/login');

      const res = await fetch('http://localhost:3100/agendamentos', {
        method: 'POST',
        body: JSON.stringify({ horario, automacao_id }),
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/agendamentos');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadList = async () => {
    try {
      setLoadingList(true);

      const token = localStorage.getItem('token');

      if (!token) router.replace('/login');

      const res = await fetch('http://localhost:3100/automacoes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setList(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div className='w-full p-4'>
      <div className='flex justify-center flex-row'>
        <h1 className='font-bold mb-4 text-xl text-center'>
          Criar novo agendamento
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
        <div className='flex flex-row justify-center'>
          <div className='w-full mr-2'>
            <label
              htmlFor='tipo_agendamento_id'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Tipo de execução
            </label>
            <select
              id='tipo_agendamento_id'
              name='tipo_agendamento_id'
              disabled
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            >
              <option defaultValue={'1'}>Diária</option>
            </select>
          </div>

          <div className='w-full'>
            <label
              htmlFor='horario'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Selecione o horário de execução:
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none'>
                <svg
                  className='w-4 h-4 text-gray-500 dark:text-gray-400'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    fillRule='evenodd'
                    d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <input
                type='time'
                id='horario'
                name='horario'
                className='bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                min='00:00'
                max='23:59'
                defaultValue='00:00'
                required
              />
            </div>
          </div>
        </div>
        
        <div>
          <label
            htmlFor='automacao_id'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
          >
            Selecione a automação
          </label>
          <select
            id='automacao_id'
            name='automacao_id'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          >
            {loadingList ? (
              <option defaultValue={''}>Carregando...</option>
            ) : (
              <>
                <option defaultValue={''}>Selecione uma automação</option>
                {list.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.nome}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

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
