'use client';

import { useState } from 'react';

export default function Home() {

  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white px-6 py-10 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">CV Builder</h1>
            <p className="text-sm">Crie um currículo profissional em minutos</p>
          </div>
          <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            Gerar Currículo em PDF
          </button>
        </div>
      </header>

      <nav className="bg-white shadow px-6">
        <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto">
          {['Informações Pessoais', 'Resumo Profissional', 'Experiência Profissional'].map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={`p-2 border-b-2 ${step === i + 1 ? 'text-blue-600' : 'border-transparent text-gray-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
      
    </div>
  );
}
