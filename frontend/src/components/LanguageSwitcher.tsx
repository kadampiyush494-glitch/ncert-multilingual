import { SupportedLanguage, languages } from '../i18n';

interface LanguageSwitcherProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
}

export function LanguageSwitcher({
  value,
  onChange,
}: LanguageSwitcherProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SupportedLanguage)}
      className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700"
    >
      {Object.keys(languages).map((lang) => (
        <option key={lang} value={lang}>
          {languages[lang as SupportedLanguage].label}
        </option>
      ))}
    </select>
  );
}
