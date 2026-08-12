import { LOCALES } from '../i18n/locale'
import { useI18n } from '../i18n/I18nProvider'

export function LangSwitch() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l.id}
          type="button"
          className={locale === l.id ? 'active' : ''}
          onClick={() => setLocale(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
