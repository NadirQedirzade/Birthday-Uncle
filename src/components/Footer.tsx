import { birthday } from '../data/birthday'

export function Footer() {
  return (
    <footer className="border-t border-hairline px-5 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center text-[0.8125rem] leading-relaxed text-label-2">
      <p>{birthday.footer.madeBy}</p>
      <p className="mt-1 tabular-nums">
        {birthday.honoree.fullName} · {birthday.honoree.age} · {birthday.footer.year}
      </p>
    </footer>
  )
}
