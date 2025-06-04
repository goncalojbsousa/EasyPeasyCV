'use client';

// Interface for certification entry
interface Certification {
  name: string;
  issuer: string;
  completionDate: string;
  hours: string;
  validationLink: string;
  description: string;
}

// Props interface for the Certifications component
interface CertificationsProps {
  certifications: Certification[];
  step: number;
  STEPS: string[];
  onCertificationChange: (idx: number, field: string, value: string) => void;
  onAddCertification: () => void;
  onRemoveCertification: (idx: number) => void;
  onStepChange: (newStep: number) => void;
}

export function Certifications({
  certifications,
  step,
  STEPS,
  onCertificationChange,
  onAddCertification,
  onRemoveCertification,
  onStepChange
}: CertificationsProps) {
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
            Certificações/Cursos
          </h2>
          <button
            type="button"
            onClick={onAddCertification}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Adicionar Certificação/Curso
          </button>
        </div>
        {certifications.length === 0 && (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-8 text-gray-400 mb-4">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-10 h-10 mb-2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Nenhuma certificação adicionada
          </div>
        )}
        {certifications.map((cert, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 mb-6 relative">
            <button
              type="button"
              onClick={() => onRemoveCertification(idx)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Certificação</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Certificação AWS Cloud Practitioner"
                  value={cert.name}
                  onChange={e => onCertificationChange(idx, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Emissor/Instituição</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: Udemy, Alura, AWS"
                  value={cert.issuer}
                  onChange={e => onCertificationChange(idx, 'issuer', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data de Conclusão</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  value={cert.completionDate}
                  onChange={e => onCertificationChange(idx, 'completionDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Carga Horária</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: 40 horas"
                  value={cert.hours}
                  onChange={e => onCertificationChange(idx, 'hours', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link de Validação</label>
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Ex: https://certificado.instituicao.com/123456"
                  value={cert.validationLink}
                  onChange={e => onCertificationChange(idx, 'validationLink', e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Descrição (Opcional)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Ex: Curso focado em desenvolvimento de APIs REST com Node.js..."
                value={cert.description}
                onChange={e => onCertificationChange(idx, 'description', e.target.value)}
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