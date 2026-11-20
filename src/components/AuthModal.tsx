import React, { useState } from 'react';
import { Mail, UserCheck, X } from 'lucide-react';
import { CAMPUS_BUILDINGS } from '../data/menuData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (payload: {
    name: string;
    email: string;
    faculty: string;
    defaultBuilding: string;
  }) => void;
  promptReason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  promptReason,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [faculty, setFaculty] = useState('Ingeniería en Sistemas Computacionales');
  const [defaultBuilding, setDefaultBuilding] = useState(CAMPUS_BUILDINGS[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setError('Ingresa un correo electrónico válido (ej. estudiante@utp.ac.pa).');
      return;
    }

    if (mode === 'register' && name.trim().length < 2) {
      setError('Ingresa tu nombre completo para crear tu cuenta.');
      return;
    }

    setError('');
    onAuthenticate({
      name: name.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      faculty,
      defaultBuilding,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-700 text-amber-300 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="font-display text-lg font-bold text-slate-900">
                {mode === 'login' ? 'Ingresar a UTP Café' : 'Crear Cuenta Estudiantil'}
              </h2>
              <p className="text-xs text-slate-500">Cafetería UTP Veraguas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            aria-label="Cerrar ventana de acceso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {promptReason && (
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs font-medium text-amber-950">
            {promptReason}
          </div>
        )}

        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`min-h-[40px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`min-h-[40px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registrarme
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María Rodríguez"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo electrónico institucional o personal
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre.apellido@utp.ac.pa"
                required
                className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Facultad / Carrera
                </label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                >
                  <option>Ingeniería en Sistemas Computacionales</option>
                  <option>Ingeniería Civil</option>
                  <option>Ingeniería Industrial</option>
                  <option>Ingeniería Mecánica</option>
                  <option>Ingeniería Eléctrica</option>
                  <option>Ciencias y Tecnología / Docente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Edificio frecuente en Veraguas
                </label>
                <select
                  value={defaultBuilding}
                  onChange={(e) => setDefaultBuilding(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                >
                  {CAMPUS_BUILDINGS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && (
            <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm transition-colors cursor-pointer mt-2"
          >
            {mode === 'login' ? 'Continuar con mi correo' : 'Crear cuenta y empezar'}
          </button>
        </form>
      </div>
    </div>
  );
};
