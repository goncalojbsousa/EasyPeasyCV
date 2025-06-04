'use client';

// Interface for language entry
interface Language {
  name: string;
  level: string;
}

// Props interface for the Languages component
interface LanguagesProps {
  languages: Language[];
  step: number;
  STEPS: string[];
  onLanguageChange: (idx: number, field: string, value: string) => void;
  onAddLanguage: () => void;
  onRemoveLanguage: (idx: number) => void;
  onStepChange: (newStep: number) => void;
}

export function Languages({
  languages,
  step,
  STEPS,
  onLanguageChange,
  onAddLanguage,
  onRemoveLanguage,
  onStepChange
}: LanguagesProps) {
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
            Idiomas
          </h2>
          <button
            type="button"
            onClick={onAddLanguage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Adicionar Idioma
          </button>
        </div>
        {languages.length === 0 && (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-8 text-gray-400 mb-4">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-10 h-10 mb-2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Nenhum idioma adicionado
          </div>
        )}
        {languages.map((lang, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 mb-6 relative">
            <button
              type="button"
              onClick={() => onRemoveLanguage(idx)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Idioma</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Inglês"
                  value={lang.name}
                  onChange={e => onLanguageChange(idx, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nível</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={lang.level}
                  onChange={e => onLanguageChange(idx, 'level', e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Fluente">Fluente</option>
                  <option value="Nativo">Nativo</option>
                </select>
              </div>
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