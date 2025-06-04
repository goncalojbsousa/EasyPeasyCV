'use client';

// Interface for education entry
interface Education {
  type: string;
  status: string;
  course: string;
  institution: string;
  startMonth: string;
  startYear: string;
  description: string;
}

// Props interface for the AcademicEducation component
interface AcademicEducationProps {
  education: Education[];
  step: number;
  STEPS: string[];
  onEducationChange: (idx: number, field: string, value: any) => void;
  onAddEducation: () => void;
  onRemoveEducation: (idx: number) => void;
  onStepChange: (newStep: number) => void;
}

export function AcademicEducation({
  education,
  step,
  STEPS,
  onEducationChange,
  onAddEducation,
  onRemoveEducation,
  onStepChange
}: AcademicEducationProps) {
  return (
    <form className="space-y-8 flex flex-col items-center">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <span className="text-blue-600">
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-7 h-7'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
            </span>
            Formação Académica
          </h2>
          <button
            type="button"
            onClick={onAddEducation}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Adicionar Formação
          </button>
        </div>
        {education.length === 0 && (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-8 text-gray-400 mb-4">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-10 h-10 mb-2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Nenhuma formação adicionada
          </div>
        )}
        {education.map((ed, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 mb-6 relative">
            <button
              type="button"
              onClick={() => onRemoveEducation(idx)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Formação</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={ed.type}
                  onChange={e => onEducationChange(idx, 'type', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Ensino Secundário">Ensino Secundário</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Licenciatura">Licenciatura</option>
                  <option value="Pós-graduação">Pós-graduação</option>
                  <option value="Mestrado">Mestrado</option>
                  <option value="Doutoramento">Doutoramento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={ed.status}
                  onChange={e => onEducationChange(idx, 'status', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Completo">Completo</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Interrompido">Interrompido</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Curso</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Licenciatura em Engenharia Informática"
                  value={ed.course}
                  onChange={e => onEducationChange(idx, 'course', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Instituição</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Universidade do Porto"
                  value={ed.institution}
                  onChange={e => onEducationChange(idx, 'institution', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mês Início</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={ed.startMonth}
                  onChange={e => onEducationChange(idx, 'startMonth', e.target.value)}
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
                  value={ed.startYear}
                  onChange={e => onEducationChange(idx, 'startYear', e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Descrição (Opcional)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Ex: Tese sobre inteligência artificial, disciplinas relevantes, projetos académicos..."
                value={ed.description}
                onChange={e => onEducationChange(idx, 'description', e.target.value)}
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