import { Link, useParams } from 'react-router-dom'
import { LessonPlayer } from '../components/LessonPlayer'
import { getLesson } from '../data/trigDerivatives'

export function LessonPage() {
  const { id } = useParams()
  const lesson = id ? getLesson(id) : undefined

  if (!lesson) {
    return (
      <div className="missing">
        <p>Lesson not found.</p>
        <Link to="/">Back to catalog</Link>
      </div>
    )
  }

  return <LessonPlayer lesson={lesson} />
}
