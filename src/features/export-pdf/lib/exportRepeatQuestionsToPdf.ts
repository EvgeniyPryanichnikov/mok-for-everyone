import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

import type { Question } from '@/entities/question/model/types'

export function exportRepeatQuestionsToPdf(questions: Question[]): void {
  const dateChunk = new Date().toISOString().slice(0, 10)
  const filename = `repeat-questions-${dateChunk}.pdf`

  const vfs = pdfFonts as unknown as Record<string, string>
  ;(pdfMake as unknown as { addVirtualFileSystem?: (nextVfs: Record<string, string>) => void }).addVirtualFileSystem?.(
    vfs,
  )
  ;(pdfMake as unknown as { vfs?: Record<string, string> }).vfs = vfs

  const content =
    questions.length === 0
      ? [{ text: 'Нет отмеченных вопросов для повторения.', margin: [0, 12, 0, 0] }]
      : questions.flatMap((question, index) => [
          {
            text: `${index + 1}. [${question.topic.toUpperCase()}] ${question.question}`,
            bold: true,
            margin: [0, 10, 0, 3],
          },
          {
            text: `Ответ: ${question.answer}`,
            margin: [0, 0, 0, 4],
          },
        ])

  const documentDefinition = {
    defaultStyle: {
      font: 'Roboto',
      fontSize: 11,
    },
    pageMargins: [36, 36, 36, 36] as [number, number, number, number],
    content: [
      { text: 'Вопросы для повторения', fontSize: 16, bold: true },
      { text: `Date: ${dateChunk}`, color: '#555555', margin: [0, 4, 0, 8] },
      ...content,
    ],
  }

  pdfMake.createPdf(documentDefinition).download(filename)
}
