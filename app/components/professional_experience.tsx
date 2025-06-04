'use client';

// Interface for experience entry
interface Experience {
  role: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  tech: string;
  activities: string;
  results: string;
}

// Props interface for the ProfessionalExperience component
interface ProfessionalExperienceProps {
  experiences: Experience[];
  step: number;
  STEPS: string[];
  onExperienceChange: (idx: number, field: string, value: any) => void;
  onAddExperience: () => void;
  onRemoveExperience: (idx: number) => void;
  onStepChange: (newStep: number) => void;
}

export function ProfessionalExperience({
  experiences,
  step,
  STEPS,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience,
  onStepChange
}: ProfessionalExperienceProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <span className="text-blue-600">
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-7 h-7'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6.75 6.75v10.5m10.5-10.5v10.5M6.75 6.75h10.5M6.75 17.25h10.5' />
              </svg>
            </span>
            Experiência Profissional
          </h2>
          <button
            type="button"
            onClick={onAddExperience}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Adicionar Experiência
          </button>
        </div>
        {experiences.length === 0 && (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-8 text-gray-400 mb-4">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-10 h-10 mb-2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Nenhuma experiência adicionada (opcional)
          </div>
        )}
        {experiences.map((exp, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 mb-6 relative">
            <button
              type="button"
              onClick={() => onRemoveExperience(idx)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cargo</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Desenvolvedor Full Stack"
                  value={exp.role}
                  onChange={e => onExperienceChange(idx, 'role', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Empresa</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Amazon"
                  value={exp.company}
                  onChange={e => onExperienceChange(idx, 'company', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mês Início</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={exp.startMonth}
                  onChange={e => onExperienceChange(idx, 'startMonth', e.target.value)}
                >
                  <option value="">Selecione</option>
                  {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ano Início</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ano"
                  value={exp.startYear}
                  onChange={e => onExperienceChange(idx, 'startYear', e.target.value)}
                />
              </div>
              {!exp.current && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mês Fim</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      value={exp.endMonth}
                      onChange={e => onExperienceChange(idx, 'endMonth', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ano Fim</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                      placeholder="Ano"
                      value={exp.endYear}
                      onChange={e => onExperienceChange(idx, 'endYear', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={e => onExperienceChange(idx, 'current', e.target.checked)}
                id={`current-${idx}`}
                className="mr-2"
              />
              <label htmlFor={`current-${idx}`} className="text-sm">Atual</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tecnologias Utilizadas</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Ex: TypeScript, Next.js, Tailwind CSS"
                value={exp.tech}
                onChange={e => onExperienceChange(idx, 'tech', e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Atividades Desenvolvidas</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Descreva suas responsabilidades (um item por linha)"
                value={exp.activities}
                onChange={e => onExperienceChange(idx, 'activities', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Conquistas (com métricas)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Ex: Reestruturei a arquitetura da aplicação usando Next.js com SSR, o que melhorou o SEO e aumentou a retenção de usuários em 25%."
                value={exp.results}
                onChange={e => onExperienceChange(idx, 'results', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between w-full">
        <button
          type="button"
          className="bg-gray-100 text-gray-500 px-6 py-2 rounded-lg font-semibold"
          onClick={() => onStepChange(Math.max(1, step - 1))}
        >
          Anterior
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={() => onStepChange(Math.min(STEPS.length, step + 1))}
        >
          Próximo
        </button>
      </div>
    </form>
  );
} 