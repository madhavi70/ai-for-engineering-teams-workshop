import { Customer } from '@/data/mock-customers';

export interface CustomerCardProps {
  customer: Customer;
}

function getHealthColor(score: number): string {
  if (score <= 30) return 'bg-red-500';
  if (score <= 70) return 'bg-yellow-500';
  return 'bg-green-500';
}

function getHealthTextColor(score: number): string {
  if (score <= 30) return 'text-red-700';
  if (score <= 70) return 'text-yellow-700';
  return 'text-green-700';
}

function getHealthBgLight(score: number): string {
  if (score <= 30) return 'bg-red-50';
  if (score <= 70) return 'bg-yellow-50';
  return 'bg-green-50';
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  const { name, company, healthScore, domains } = customer;
  const hasDomains = domains && domains.length > 0;
  const hasMultipleDomains = domains && domains.length > 1;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 w-full max-w-sm">
      {/* Header: name, company, health score */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-sm text-gray-500 truncate">{company}</p>
        </div>
        <div className={`flex flex-col items-center rounded-md px-3 py-1 shrink-0 ${getHealthBgLight(healthScore)}`}>
          <span className={`text-lg font-bold leading-none ${getHealthTextColor(healthScore)}`}>
            {healthScore}
          </span>
          <div className={`mt-1 h-1.5 w-8 rounded-full ${getHealthColor(healthScore)}`} />
        </div>
      </div>

      {/* Domains section */}
      {hasDomains && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Domains</span>
            {hasMultipleDomains && (
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-1.5 py-0.5">
                {domains!.length}
              </span>
            )}
          </div>
          <ul className="space-y-1">
            {domains!.map((domain) => (
              <li key={domain} className="text-xs text-gray-600 truncate">
                {domain}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
