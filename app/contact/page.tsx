export default function ContactPage() {
  return (
    <section className="flex min-h-[calc(100vh-var(--header-h))] flex-col items-center justify-center px-6 py-16 text-center md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight md:text-3xl">
          새로운 연결을 기다립니다.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-foreground md:text-base">
          좋은 경험을 함께 만들어갈 기회에 늘 열려있습니다.
          <br />
          언제든 편하게 연락해주세요.
        </p>

        {/* Compact, inline fields: label on the LEFT of each line, input on the
            RIGHT of the same underline. Keeps the Submit button above the fold. */}
        <form
          method="POST"
          action="https://formspree.io/f/mjybddkb"
          className="mt-8 flex flex-col text-left"
        >
          <Field id="name" name="name" label="Name" type="text" />
          <Field id="email" name="email" label="Email" type="email" />
          <Field id="message" name="message" label="Message" type="textarea" />

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="border-b border-foreground pb-1 text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-60"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({
  id,
  name,
  label,
  type,
}: {
  id: string
  name: string
  label: string
  type: string
}) {
  // Label sits on the LEFT of the underline; the input fills the RIGHT of the
  // exact same line. Compact vertical padding keeps the whole form on-screen.
  return (
    <div className="flex items-baseline gap-4 border-b border-foreground py-3">
      <label
        htmlFor={id}
        className="w-16 shrink-0 text-xs font-semibold uppercase tracking-widest text-foreground md:w-24"
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={2}
          required
          className="flex-1 resize-none bg-transparent text-base leading-relaxed outline-none"
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required
          className="flex-1 bg-transparent text-base outline-none"
        />
      )}
    </div>
  )
}
