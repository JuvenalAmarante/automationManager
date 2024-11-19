'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const getMenuClasses = () => {
    let menuClasses = [];

    if (isOpen) {
      menuClasses = [
        'flex',
        'absolute',
        'top-[60px]',
        'bg-gray-800',
        'w-full',
        'p-4',
        'left-0',
        'gap=10',
        'flex-col',
      ];
    } else {
      menuClasses = ['hidden', 'md:flex'];
    }

    return menuClasses.join(' ');
  };

  return (
    <nav className='bg-gray-800 text-white p-4 sm:p-4 md:flex md:justify-between md:items-center '>
      <div className='container mx-auto flex justify-between items-center'>
        <Image
          src='https://avancontabilidade.com.br/wp-content/uploads/2023/12/LOGO-BRANCA.svg'
          className='w-8 h-8'
          alt='logo'
          width={20}
          height={20}
        />

        <div className={getMenuClasses()}>
          <Link href='/automacoes' className='mx-2 hover:text-gray-300'>
            Automações
          </Link>
          <Link href='/agendamentos' className='mx-2 hover:text-gray-300'>
            Agendamentos
          </Link>
        </div>

        <div className='md:hidden flex items-center'>
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                ></path>
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16m-7 6h7'
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
