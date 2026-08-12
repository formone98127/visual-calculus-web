import { Link, useParams } from 'react-router-dom'
import { LessonPlayer } from '../components/LessonPlayer'
import { getLesson } from '../data/catalog'
import { useI18n } from '../i18n/I18nProvider'

export function LessonPage() {
  const { id } = useParams()
  const { t, localizeLesson } = useI18n()
  const raw = id ? getLesson(id) : undefined

  if (!raw) {
    return (
      <div className="missing">
        <p>{t.missing}</p>
        <Link to="/">{t.backHome}</Link>
      </div>
    )
  }

  return <LessonPlayer lesson={localizeLesson(raw)} />
}
