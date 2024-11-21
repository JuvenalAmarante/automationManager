'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Automacoes() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<
    {
      id: number;
      nome: string;
      criado_em: string;
    }[]
  >([]);

  const loadList = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      if (!token) router.push('/login');

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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <div className='flex flex-col justify-center items-center p-4'>
      <div className='flex justify-center flex-row'>
        <h1 className='font-bold mb-4 text-xl text-center'>
          Listagem de automações
        </h1>

        <Link
          href={'/automacoes/criar'}
          className='absolute right-4 mb-4 text-white bg-primary-600 disabled:bg-primary-500 disabled:hover:bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
        >
          Novo
        </Link>
      </div>

      {loading ? (
        <div>
          <svg
            aria-hidden='true'
            role='status'
            className='inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600'
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
        </div>
      ) : (
        <div className='mt-4 w-full'>
          {list.map((item, index) => (
            <div
              className='p-4 border-gray-50 border-opacity-45 border-x border-y rounded mb-2 flex justify-between'
              key={index}
            >
              <div>
                <p className='text-base font-bold'>{item.nome}</p>
                <p className='text-sm'>
                  Criado em: {new Date(item.criado_em).toLocaleString()}
                </p>
              </div>

              <Link
                href={`/automacoes/${item.id}`}
                className='text-white bg-primary-600 disabled:bg-primary-500 disabled:hover:bg-primary-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                Visualizar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
