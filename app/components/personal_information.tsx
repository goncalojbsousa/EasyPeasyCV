'use client';

interface Link {
  type: string;
  value: string;
}

interface PersonalInformationProps {
  links: Link[];
  step: number;
  STEPS: string[];
  onLinkTypeChange: (idx: number, newType: string) => void;
  onLinkValueChange: (idx: number, newValue: string) => void;
  onAddLink: () => void;
  onRemoveLink: (idx: number) => void;
  onStepChange: (newStep: number) => void;
}

const LINK_TYPES = [
  { label: 'LinkedIn', prefix: 'linkedin.com/in/' },
  { label: 'GitHub', prefix: 'github.com/' },
  { label: 'Portfolio', prefix: '' },
];

export function PersonalInformation({
  links,
  step,
  STEPS,
  onLinkTypeChange,
  onLinkValueChange,
  onAddLink,
  onRemoveLink,
  onStepChange
}: PersonalInformationProps) {
  return (
    <form className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <span className="text-blue-600">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z' />
              <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 19.25v-.75A6.75 6.75 0 0111.25 11.75h1.5A6.75 6.75 0 0120.5 18.5v.75' />
            </svg>
          </span>
          Informações Pessoais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Informações Pessoais</label>
            <input type="text" placeholder="Ex: Gonçalo Sousa" className="w-full p-2 border border-gray-300 rounded-lg bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cargo Desejado</label>
            <input type="text" placeholder="Ex: Desenvolvedor Full Stack" className="w-full p-2 border border-gray-300 rounded-lg bg-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-1">Codigo Postal</label>
            <input type="text" placeholder="Ex: 1234-567" className="w-full p-2 border border-gray-300 rounded-lg bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cidade</label>
            <input type="text" placeholder="Ex: Viana do Castelo" className="w-full p-2 border border-gray-300 rounded-lg bg-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email<span className="text-red-500">*</span></label>
            <input type="email" placeholder="Ex: email@exemplo.com" className="w-full p-2 border border-gray-300 rounded-lg bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código do País</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg bg-white">
              <option>Portugal (+351)</option>
              <option>Brasil (+55)</option>
              <option>Espanha (+34)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input type="text" placeholder="Ex: 912345678" className="w-full p-2 border border-gray-300 rounded-lg bg-white" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Links e Redes Sociais</label>
        <div className="flex flex-col gap-4">
          {links.map((link, idx) => {
            const linkType = LINK_TYPES.find(t => t.label === link.type) || LINK_TYPES[0];
            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium mb-1">Tipo de Link</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                    value={link.type}
                    onChange={e => onLinkTypeChange(idx, e.target.value)}
                  >
                    {LINK_TYPES.map(t => (
                      <option key={t.label} value={t.label}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">URL</label>
                    <div className="flex">
                      {linkType.prefix && (
                        <span className="inline-flex items-center px-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">{linkType.prefix}</span>
                      )}
                      <input
                        type="text"
                        placeholder={linkType.label === 'LinkedIn' ? 'Ex: seuperfil' : linkType.label === 'GitHub' ? 'Ex: usuario' : 'Ex: seuwebsite.com'}
                        className={`w-full p-2 border border-gray-300 ${linkType.prefix ? 'rounded-r-lg' : 'rounded-lg'} bg-white`}
                        value={link.value}
                        onChange={e => onLinkValueChange(idx, e.target.value)}
                      />
                    </div>
                  </div>
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveLink(idx)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={onAddLink}
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm mt-2"
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
            </svg>
            Adicionar Link
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="bg-gray-100 text-gray-500 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          onClick={() => onStepChange(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Anterior
        </button>
        <button
          type="button"
          className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          onClick={() => onStepChange(Math.min(STEPS.length, step + 1))}
          disabled={step === STEPS.length}
        >
          Próximo
        </button>
      </div>
    </form>
  );
}